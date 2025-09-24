import axios from 'axios';

const mapsKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

export async function textSearch(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${mapsKey}`;
  const { data } = await axios.get(url);
  return data?.results || [];
}

export async function placeDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${mapsKey}`;
  const { data } = await axios.get(url);
  return data?.result || null;
}

export function shapePlace(p) {
  const { lat, lng } = p.geometry.location;
  return {
    name: p.name,
    address: p.formatted_address,
    place_id: p.place_id,
    latitude: lat,
    longitude: lng,
    embed_url: `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(p.name)}`,
    directions_url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  };
}