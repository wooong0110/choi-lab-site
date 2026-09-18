CREATE TABLE IF NOT EXISTS likes (
  request_id TEXT PRIMARY KEY,
  photo TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS photo_stats (
  photo TEXT PRIMARY KEY,
  likes INTEGER NOT NULL DEFAULT 0
);
CREATE TRIGGER IF NOT EXISTS count_like AFTER INSERT ON likes BEGIN
  INSERT INTO photo_stats(photo, likes) VALUES (NEW.photo, 1)
  ON CONFLICT(photo) DO UPDATE SET likes = likes + 1;
END;
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL UNIQUE,
  photo TEXT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS comments_photo_id ON comments(photo, id DESC);
