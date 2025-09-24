import { embedProxy } from '../../../../handler/mapsHandler.js';

export async function GET(request, { params }) {
  try {
    let statusCode = 200;
    let htmlData = null;
    const res = {
      status(code) { statusCode = code; return this; },
      send(data) { htmlData = data; return this; },
      type() { return this; }
    };

    await embedProxy({ params }, res);

    return new Response(htmlData, { status: statusCode, headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    console.error('Embed API Error:', err);
    return new Response(
      `<!doctype html><html><body><h1>Internal Server Error</h1><pre>${err?.message}</pre></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}