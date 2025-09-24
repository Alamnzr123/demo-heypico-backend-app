/** @type {import('next').NextConfig} */

// Validate required env vars
const required = ['GOOGLE_MAPS_API_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key} in environment variables (.env)`);
  }
}

// Custom config object
const appConfig = {
  port: Number(process.env.PORT ?? 5050),

  mapsKey: process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY,
  embedKey: process.env.GOOGLE_EMBED_API_KEY || process.env.GOOGLE_MAPS_API_KEY,

  maxQueryLen: Number(process.env.MAX_QUERY_LEN ?? 120),
  maxResults: Number(process.env.MAX_RESULTS ?? 1),

  ollamaUrl: process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL ?? 'llama3:8b',

  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean),
};

const nextConfig = {
  // ...other Next.js config options
  publicRuntimeConfig: appConfig, // If you want to access in client/server
};

export default nextConfig;
