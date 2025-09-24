import { health } from '../../../handler/mapsHandler.js';

export async function GET() {
  try {
    let statusCode = 200;
    let data = null;
    const res = {
      status(code) { statusCode = code; return this; },
      send(val) { data = val; return this; }
    };
    await health({}, res);
    return new Response(data, { status: statusCode, headers: { 'Content-Type': 'text/plain' } });
  } catch (err) {
    console.error('Health API Error:', err);
    return new Response(
      'Internal Server Error',
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}