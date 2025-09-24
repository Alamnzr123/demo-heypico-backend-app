# AI-Powered Local Business Search (Next.js Edition)

A web application that enables users to search for local businesses using AI and display results on an interactive map.

## TL;DR (Quickstart)

```bash
# 1) Run Ollama & pull model
ollama serve
ollama pull llama3:8b

# 2) Install dependencies
npm install

# 3) Configure environment variables
cp .env.example .env.local   # fill in GOOGLE_MAPS_API_KEY etc.

# 4) Start Next.js app (dev mode)
npm run dev                  # http://localhost:3000

# 5) (Optional) Serve UI on another port if needed
# npx serve -l 5500
```

## Key Features

- **AI-powered search**: Uses Ollama to process natural language search queries
- **Interactive maps**: Google Maps integration to display business locations
- **Real-time results**: Search and display results in real-time
- **Responsive design**: Responsive interface for various devices
- **Local business focus**: Specialized for local business search in Indonesia

## Technologies Used

- **Next.js** (API routes & frontend)
- **Ollama** (Local LLM)
- **Google Places API**
- **Google Maps JavaScript API**
- **Rate limiting & validation middleware**

## Prerequisites

1. **Node.js** (v18 or newer recommended)
2. **Ollama** installed and running
3. **Google Maps API Key** with access to:
   - Places API
   - Maps JavaScript API
   - Maps Embed API (optional)

## Installation & Setup

### 1. Install Ollama & Model

```bash
# Install Ollama (according to your OS)
# For macOS/Linux:
curl -fsSL https://ollama.ai/install.sh | sh

# For Windows: download from https://ollama.ai/download

# Run Ollama
ollama serve

# Pull required model
ollama pull llama3:8b
```

### 2. Setup Google Maps API

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable:
   - Places API
   - Maps JavaScript API
   - Maps Embed API (optional)
4. Create API Key in "Credentials"
5. Restrict API key for security (recommended)

### 3. Setup Next.js Project

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your API key and settings
```

**Example `.env.local`:**

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_EMBED_API_KEY=your_google_embed_api_key_here
PORT=3000
CORS_ORIGINS=http://127.0.0.1:3000,http://localhost:3000
MAX_QUERY_LEN=120
MAX_RESULTS=1
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3:8b
```

**Run the app:**

```bash
npm run dev
```

App will run at `http://localhost:3000`

## Usage

1. Open browser and access `http://localhost:3000`
2. Type natural language search queries, examples:
   - "Find good pasta restaurants in Jakarta"
   - "Nearest hospital from Menteng"
   - "Cafes with good wifi in Bandung"
3. Click "Search" or press Enter
4. View results on map and click markers for details
5. Use "Directions" button for navigation

## Project Structure

```
demo-heypico/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── maps/
│   │   │       ├── health/
│   │   │       │   └── route.js
│   │   │       ├── search-place/
│   │   │       │   └── route.js
│   │   │       ├── ai-search/
│   │   │       │   └── route.js
│   │   │       └── embed/
│   │   │           └── [placeId]/
│   │   │               └── route.js
│   │   ├── handler/
│   │   │   └── mapsHandler.js
│   │   └── module/
│   │       ├── mapsService.js
│   │       └── ollamaServices.js
│   ├── middleware.js
├── .env.local
├── .env.example
├── package.json
├── README.md
└── ...
```

## API Endpoints

### GET /api/maps/health

Health check endpoint.

**Response:**  
`OK`

### POST /api/maps/search-place

Search for a place using a text query.

**Request:**

```json
{
  "query": "Find good pasta restaurants in Jakarta"
}
```

**Response:**

```json
{
  "place_id": "ChIJ...",
  "name": "Pasta Paradise",
  "address": "Jl. Thamrin No. 1, Jakarta",
  "latitude": -6.1944,
  "longitude": 106.8229,
  "embed_url": "...",
  "directions_url": "..."
}
```

### POST /api/maps/ai-search

Main AI search endpoint.

**Request:**

```json
{
  "prompt": "Find good pasta restaurants in Jakarta"
}
```

**Response:**

```json
{
  "query": "pasta restaurants jakarta",
  "results": [
    {
      "place_id": "ChIJ...",
      "name": "Pasta Paradise",
      "address": "Jl. Thamrin No. 1, Jakarta",
      "latitude": -6.1944,
      "longitude": 106.8229,
      "embed_url": "...",
      "directions_url": "..."
    }
  ]
}
```

### GET /api/maps/embed/[placeId]

Returns an embeddable Google Maps iframe for a place.

---

## Security & Considerations

- **Restrict API Keys**: Set restrictions in Google Cloud Console
- **Environment Variables**: Don't commit `.env.local` files
- **Rate Limiting**: Built-in via global middleware
- **Input Validation**: Built-in via global middleware
- **HTTPS**: Use HTTPS in production
- **CORS**: Set CORS origins according to your domain

## Troubleshooting

**Missing GOOGLE_MAPS_API_KEY error**

- Ensure `.env.local` exists and contains your API key

**Ollama connection errors**

- Ensure Ollama is running: `ollama serve`
- Check `OLLAMA_URL` in `.env.local`
- Verify model is available: `ollama list`

**Maps not loading**

- Check browser console for API key errors
- Verify API key has correct API access and restrictions

## Deployment Checklist

- [ ] `.gitignore` contains `.env.local` and `node_modules/`
- [ ] `.env.example` is available and up-to-date
- [ ] Ollama is running and model is available
- [ ] `/api/maps/health` endpoint returns `OK`
- [ ] `/api/maps/ai-search` endpoint works properly
- [ ] UI displays map and search features
- [ ] Google Maps API key is valid and not restricted

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

[MIT License](LICENSE) - see LICENSE
