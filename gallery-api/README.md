# Gallery likes and comments

The GitHub Pages site calls this Cloudflare Worker, which stores public per-photo and per-video likes and comments in D1. Videos use the canonical `clip.src` path, including when a browser plays the WebM alternative. Existing photo records and API field names stay compatible. Likes are repeatable; each click has an idempotency key so a network retry does not add a second like. Comments use nicknames without accounts and are rendered as plain text. They are public and do not verify identity.

## Development

```sh
npm ci
node sync-photos.mjs
npx wrangler d1 execute choi-lab-gallery --local --file schema.sql
npx wrangler dev --port 8787 --var ALLOWED_ORIGIN:http://localhost:8765
# In another terminal:
node --test api.test.mjs
```

Use a local API URL in `assets/js/gallery-social-config.js` when previewing; restore the production URL before publishing. Tests write only to the local development database.

## Deploy and add photos

After adding gallery photos or videos, deploy again so the API accepts the new media paths. Wrangler automatically runs `node sync-photos.mjs` before each build or deploy to register the current gallery media. Preserve paths to preserve their reactions.

```sh
npx wrangler login
npx wrangler d1 execute choi-lab-gallery --remote --file schema.sql
npx wrangler deploy
```

Set the resulting Worker URL in `assets/js/gallery-social-config.js`, then publish the static site. Never put Cloudflare credentials in website files. This uses the account's existing plan; no paid plan is enabled by these instructions.

## Moderation

New comments show an × button in the browser that posted them. Clicking it deletes immediately and updates the count. The browser retains the private creation UUID in localStorage; `/comment/delete` requires that UUID, comment ID, and matching photo. Public comment listings never expose the UUID. Older comments and comments from another browser still require owner moderation below. Clearing browser storage removes access to these buttons. Deploy the Worker and static assets together; no database migration is needed.

The owner can review and remove unwanted comments using the Cloudflare D1 console for `choi-lab-gallery`. Review IDs before deleting a specific row:

```sql
SELECT id, photo, name, body, created_at FROM comments ORDER BY id DESC LIMIT 100;
-- Replace 123 with the reviewed comment ID:
DELETE FROM comments WHERE id = 123;
```

The API checks photo paths, input length, SQL parameters, and browser origins. Anonymous public endpoints are not protected from scripted spam by CORS; add Turnstile or a rate limiter if abuse becomes an issue. Like totals are intentionally not unique-person counts.
