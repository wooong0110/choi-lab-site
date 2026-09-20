import photos from './photos.json';
const knownPhotos = new Set(photos);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function readBody(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new Error('format');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  const parts = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) { await reader.cancel(); throw new Error('size'); }
    parts.push(value);
  }
  return JSON.parse(await new Blob(parts).text());
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGIN.split(',').map(value => value.trim());
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin' };
    if (allowedOrigins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (origin && !allowedOrigins.includes(origin)) return reply({ error: 'Origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const url = new URL(request.url);
    if (!['/photo', '/like', '/comment'].includes(url.pathname)) return reply({ error: 'Not found' }, 404);
    if (request.method !== (url.pathname === '/photo' ? 'GET' : 'POST')) return reply({ error: 'Method not allowed' }, 405);
    let input;
    try { input = request.method === 'GET' ? Object.fromEntries(url.searchParams) : await readBody(request); }
    catch { return reply({ error: 'Invalid request' }, 400); }
    if (!input || !knownPhotos.has(input.photo)) return reply({ error: 'Unknown photo' }, 400);
    const photo = input.photo;
    try {
      if (url.pathname === '/photo') {
        const before = input.before === undefined ? Number.MAX_SAFE_INTEGER : Number(input.before);
        if (!Number.isSafeInteger(before) || before < 1) return reply({ error: 'Invalid cursor' }, 400);
        const [stats, comments] = await env.DB.batch([
          env.DB.prepare('SELECT likes FROM photo_stats WHERE photo = ?').bind(photo),
          env.DB.prepare('SELECT id, name, body, created_at FROM comments WHERE photo = ? AND id < ? ORDER BY id DESC LIMIT 31').bind(photo, before)
        ]);
        const rows = comments.results.slice(0, 30);
        return reply({ likes: stats.results[0]?.likes || 0, comments: rows, next: comments.results.length > 30 ? rows[rows.length - 1].id : null });
      }
      if (!uuid.test(input.requestId)) return reply({ error: 'Invalid request ID' }, 400);
      if (url.pathname === '/like') {
        const results = await env.DB.batch([
          env.DB.prepare('INSERT OR IGNORE INTO likes(request_id, photo) VALUES (?, ?)').bind(input.requestId, photo),
          env.DB.prepare('SELECT likes FROM photo_stats WHERE photo = ?').bind(photo)
        ]);
        return reply({ likes: results[1].results[0]?.likes || 0 });
      }
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      const body = typeof input.body === 'string' ? input.body.trim() : '';
      if (!name || name.length > 40 || !body || body.length > 1000) return reply({ error: 'Invalid comment' }, 400);
      await env.DB.prepare('INSERT OR IGNORE INTO comments(request_id, photo, name, body) VALUES (?, ?, ?, ?)').bind(input.requestId, photo, name, body).run();
      return reply({ ok: true }, 201);
    } catch (error) {
      console.error(JSON.stringify({ event: 'gallery_api_error', message: error.message }));
      return reply({ error: 'Please try again later' }, 503);
    }
  }
};
