import { askOllama } from '../module/ollamaServices.js';
import { textSearch, placeDetails, shapePlace } from '../module/mapsService.js';

export async function health(_req, res) {
  res.send('OK');
}

export async function searchPlace(req, res) {
  const query = `${req.body?.query || ''}`.trim();
  if (!query) return res.status(400).json({ message: 'query is required' });

  const results = await textSearch(query);
  if (!results.length) return res.status(404).json({ message: 'No results found' });

  const top = results[0];
  res.json(shapePlace(top));
}

export async function aiSearch(req, res) {
  const prompt = `${req.body?.prompt || ''}`.trim();
  if (!prompt) return res.status(400).json({ message: 'prompt is required' });

  const hint = [
    'Turn user queries into short ones for Google Places Text Search.',
    'Answer ONE line without explanation, for example: "ramen near medan" or "coffee shop medan".'
  ].join(' ');

  const generated = await askOllama(`${hint}\nUser: ${prompt}\nQuery:`);
  const query = generated.trim().replace(/^"+|"+$/g, '');
  if (!query) return res.status(400).json({ message: 'LLM failed to produce a query' });

  const results = await textSearch(query);
  if (!results.length) return res.status(404).json({ message: 'No results found', query });

  const top3 = results.slice(0, 3).map(shapePlace);
  res.json({ query, results: top3 });
}

export async function embedProxy(req, res) {
  const { placeId } = req.params;
  if (!placeId) return res.status(400).send('placeId required');

  const detail = await placeDetails(placeId);
  const name = detail?.name || placeId;
  const embedKey = process.env.GOOGLE_EMBED_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  const src = `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodeURIComponent(name)}`;

  res.type('html').send(`<!doctype html>
<html><body style="margin:0">
<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${src}" allowfullscreen></iframe>
</body></html>`);
}