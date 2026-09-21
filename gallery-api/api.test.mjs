import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = 'http://127.0.0.1:8787';
const photo = 'assets/img/gallery/260918_2/IMG_0317.jpg';
const other = 'assets/img/gallery/260918_2/IMG_0318.jpg';
async function get(p = photo, before = '') {
  return (await fetch(`${base}/photo?photo=${encodeURIComponent(p)}${before ? '&before=' + before : ''}`)).json();
}
function post(route, body, origin = 'http://localhost:8765') {
  return fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
}
test('repeated concurrent likes persist, retries do not duplicate, and photos stay separate', async () => {
  const start = (await get()).likes;
  const second = (await get(other)).likes;
  const requests = Array.from({ length: 10 }, () => ({ photo, requestId: randomUUID() }));
  await Promise.all(requests.map(input => post('/like', input)));
  await post('/like', requests[0]);
  assert.equal((await get()).likes, start + 10);
  assert.equal((await get(other)).likes, second);
});
test('comments persist as plain text, retry safely, and paginate', async () => {
  const startingCount = (await get()).commentCount;
  const prefix = randomUUID();
  const body = { photo, requestId: randomUUID(), name: "O'Neil", body: '<img src=x onerror=alert(1)> ' + prefix };
  assert.equal((await post('/comment', body)).status, 201);
  await post('/comment', body);
  let snapshot = await get();
  assert.equal(snapshot.commentCount, startingCount + 1);
  assert.equal(snapshot.comments.filter(x => x.body === body.body).length, 1);
  for (let i = 0; i < 31; i++) await post('/comment', { ...body, requestId: randomUUID(), body: prefix + i });
  snapshot = await get();
  assert.equal(snapshot.comments.length, 30);
  assert.equal(snapshot.commentCount, startingCount + 32);
  assert.ok(snapshot.next);
  const older = await get(photo, snapshot.next);
  assert.equal(older.commentCount, snapshot.commentCount);
  assert.ok(older.comments.length >= 2);
  assert.ok(older.comments.every(x => x.id < snapshot.next));
});
test('rejects unknown photos, oversized input and foreign browser origins', async () => {
  assert.equal((await post('/like', { photo: 'unknown', requestId: randomUUID() })).status, 400);
  assert.equal((await post('/like', { photo, requestId: randomUUID() }, 'https://evil.example')).status, 403);
  assert.equal((await post('/comment', { photo, requestId: randomUUID(), name: 'A', body: 'x'.repeat(1001) })).status, 400);
  assert.equal((await post('/comment', { photo, requestId: randomUUID(), name: 'A', body: 'x'.repeat(9000) })).status, 400);
  const response = await fetch(`${base}/photo?photo=${encodeURIComponent(photo)}`, { headers: { Origin: 'http://localhost:8765' } });
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:8765');
});
