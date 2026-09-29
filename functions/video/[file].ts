// Pages static assets lack byte ranges; this preserves browser video seeking.
export async function onRequest({ request, env }: {
  request: Request;
  env: { ASSETS: { fetch(request: Request): Promise<Response> } };
}) {
  if (!['/video/idea-to-reality.mp4', '/video/idea-to-reality-mobile.mp4', '/video/ville.mp4'].includes(new URL(request.url).pathname)) return env.ASSETS.fetch(request);
  if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405 });
  const headers = new Headers(request.headers);
  headers.delete('Range');
  headers.delete('If-Range');
  const asset = await env.ASSETS.fetch(new Request(request, { headers }));
  if (!asset.ok || request.method === 'HEAD') return asset;
  const range = request.headers.get('Range');
  const validator = request.headers.get('If-Range');
  if (!range || (validator && validator !== asset.headers.get('ETag') && validator !== asset.headers.get('Last-Modified'))) return asset;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return asset;
  const data = await asset.arrayBuffer();
  const length = data.byteLength;
  const start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), length - 1) : length - 1;
  const responseHeaders = new Headers(asset.headers);
  responseHeaders.set('Accept-Ranges', 'bytes');
  responseHeaders.delete('Content-Encoding');
  responseHeaders.delete('Content-Length');
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= length) {
    responseHeaders.set('Content-Range', `bytes */${length}`);
    return new Response(null, { status: 416, headers: responseHeaders });
  }
  responseHeaders.set('Content-Range', `bytes ${start}-${end}/${length}`);
  responseHeaders.set('Content-Length', String(end - start + 1));
  return new Response(data.slice(start, end + 1), { status: 206, headers: responseHeaders });
}
