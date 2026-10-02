const test = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server, base;
test.before(async () => {
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

test('GET /healthz returns ok', async () => {
  const res = await fetch(`${base}/healthz`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });
});

test('GET /attendance returns a list', async () => {
  const res = await fetch(`${base}/attendance`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(body) && body.length > 0);
});

test('GET /fail returns 500', async () => {
  const res = await fetch(`${base}/fail`);
  assert.strictEqual(res.status, 500);
});

test('GET /metrics exposes request counter and histogram', async () => {
  await fetch(`${base}/healthz`);
  const text = await (await fetch(`${base}/metrics`)).text();
  assert.match(text, /http_requests_total\{/);
  assert.match(text, /http_request_duration_seconds_bucket\{/);
  assert.match(text, /process_start_time_seconds/);
});
