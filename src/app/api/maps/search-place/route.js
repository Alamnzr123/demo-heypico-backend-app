import { searchPlace } from '../../../handler/mapsHandler.js';

export async function POST(request) {
  try {
    const body = await request.json();

    let statusCode = 200;
    let jsonData = null;
    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { jsonData = data; return this; },
      send(data) { jsonData = data; return this; }
    };

    await searchPlace({ body }, res);

    return new Response(JSON.stringify(jsonData), { status: statusCode, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('API Error:', err);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}