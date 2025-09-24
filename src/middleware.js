import { NextResponse } from 'next/server';

const RATE_LIMIT = 30; // requests
const WINDOW_MS = 60 * 1000; // 1 minute
const ipHits = new Map();

export async function limiter(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'local';
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }

  ipHits.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
  }
}

// --- Validation logic ---
const ALLOWED = /^[\p{L}\p{N}\s,.\-'/&()]+$/u;

function clean(s = '') {
  return s
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F]/g, '')
    .trim();
}

async function validate(request) {
  const url = new URL(request.url);
  const isSearchPlace = url.pathname.endsWith('/api/maps/search-place');
  const isAiSearch = url.pathname.endsWith('/api/maps/ai-search');
  if (!isSearchPlace && !isAiSearch) return;

  const body = await request.clone().json().catch(() => ({}));
  const maxLen = Number(process.env.MAX_QUERY_LEN ?? 120);

  if (isSearchPlace) {
    const raw = String(body?.query ?? '');
    const query = clean(raw);

    if (!query) return NextResponse.json({ message: 'query is required' }, { status: 400 });
    if (query.length > maxLen) return NextResponse.json({ message: `query too long (>${maxLen})` }, { status: 400 });
    if (!ALLOWED.test(query)) return NextResponse.json({ message: 'query contains unsupported characters' }, { status: 400 });
    if (/https?:\/\//i.test(query) || /-?\d{1,3}\.\d{3,}/.test(query)) return NextResponse.json({ message: 'query looks unsafe' }, { status: 400 });
  }

  if (isAiSearch) {
    const raw = String(body?.prompt ?? '');
    const prompt = clean(raw);

    if (!prompt) return NextResponse.json({ message: 'prompt is required' }, { status: 400 });
    if (prompt.length > maxLen) return NextResponse.json({ message: `prompt too long (>${maxLen})` }, { status: 400 });
    if (!ALLOWED.test(prompt)) return NextResponse.json({ message: 'prompt contains unsupported characters' }, { status: 400 });
    if (/https?:\/\//i.test(prompt) || /-?\d{1,3}\.\d{3,}/.test(prompt)) return NextResponse.json({ message: 'prompt looks unsafe' }, { status: 400 });
  }
}

// --- Main middleware ---
export async function middleware(request) {
  // Rate limiting
  const limitResponse = await limiter(request);
  if (limitResponse) return limitResponse;

  // Validation
  const validationResponse = await validate(request);
  if (validationResponse) return validationResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/maps/:path*',
  ],
};