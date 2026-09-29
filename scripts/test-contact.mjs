import assert from 'node:assert/strict';

// Local-only smoke checks. No request is sent to a contact provider.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8788';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Tests only run against localhost.');
const valid = { name: 'Verifica locale', email: 'test@example.invalid', phone: '', service: 'Progettazione 2D / 3D', message: 'Richiesta di test locale, non inviare.', privacy: 'accepted', website: '' };
const cases = [
  ['invalid email', { ...valid, email: 'invalid' }, 422],
  ['missing consent', { ...valid, privacy: '' }, 422],
  ['unknown service', { ...valid, service: 'unknown' }, 422],
  ['honeypot', { ...valid, website: 'bot' }, 400],
  ['oversized message', { ...valid, message: 'a'.repeat(17000) }, 413],
];
for (const [name, body, expected] of cases) {
  const response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal(response.status, expected, name);
  assert.ok((await response.json()).error, name);
  console.log(`PASS ${name}: ${expected}`);
}
const crossOrigin = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.invalid' }, body: '{}' });
assert.equal(crossOrigin.status, 403);
console.log('PASS cross-origin: 403');
const malformed = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
assert.equal(malformed.status, 400);
console.log('PASS malformed JSON: 400');
// Only test unconfigured delivery when the UI explicitly says delivery is disabled.
const html = await (await fetch(base)).text();
if (html.includes('Il modulo di contatto sarà disponibile a breve.')) {
  const disabled = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid) });
  assert.equal(disabled.status, 503);
  console.log('PASS unconfigured provider: 503 (no false success)');
}
assert.match(html, /<html lang="it"/);
assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
for (const asset of ['/images/living-day.webp', '/video/blueprint.webp', '/video/idea-to-reality.mp4', '/video/idea-to-reality-mobile.mp4', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest']) {
  const response = await fetch(base + asset, { method: 'HEAD' });
  assert.equal(response.status, 200, asset);
}
const range = await fetch(`${base}/video/idea-to-reality.mp4`, { headers: { Range: 'bytes=0-1023' } });
assert.equal(range.status, 206, 'Video seeking needs byte ranges');
console.log('PASS language, heading, assets, metadata routes and video byte ranges');
for (const file of ['idea-to-reality.mp4', 'idea-to-reality-mobile.mp4', 'ville.mp4']) {
  const partial = await fetch(`${base}/video/${file}`, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(partial.status, 206, file);
  assert.equal((await partial.arrayBuffer()).byteLength, 1024, file);
  const suffix = await fetch(`${base}/video/${file}`, { headers: { Range: 'bytes=-128' } });
  assert.equal(suffix.status, 206);
  assert.equal((await suffix.arrayBuffer()).byteLength, 128);
  const invalid = await fetch(`${base}/video/${file}`, { headers: { Range: 'bytes=999999999-' } });
  assert.equal(invalid.status, 416);
}
for (const width of [384, 960, 1920]) {
  assert.equal((await fetch(`${base}/responsive/living-day-${width}.webp`)).status, 200);
}
console.log('PASS: all three videos support bounded/suffix/invalid ranges; responsive assets available.');
