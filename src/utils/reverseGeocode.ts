// Google Maps API key (same as app.json androidConfig.googleMapsApiKey)
const MAPS_API_KEY = 'AIzaSyDeXYsdKo1QeffWNhONEQc1EcL4F5B9DtI';

/** Uses Google Geocoding API for accurate reverse geocoding. */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const components = data.results[0].address_components;
      const sublocality = components.find((c: any) => c.types.includes('sublocality_level_1'))?.long_name;
      const locality    = components.find((c: any) => c.types.includes('locality'))?.long_name;
      const route       = components.find((c: any) => c.types.includes('route'))?.long_name;
      return sublocality || locality || route || data.results[0].formatted_address.split(',')[0];
    }
  } catch {}
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/** Uses Google Places Autocomplete for real-time suggestions (like Google Maps). */
export async function searchPlaces(
  query: string,
): Promise<{ name: string; address: string; lat: number; lng: number }[]> {
  const autocompleteUrl =
    `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
    `?input=${encodeURIComponent(query)}&components=country:in&types=geocode|establishment&key=${MAPS_API_KEY}`;
  try {
    const res = await fetch(autocompleteUrl);
    const data = await res.json();
    if (data.status !== 'OK') return [];
    const predictions: any[] = data.predictions.slice(0, 5);
    const results = await Promise.all(
      predictions.map(async (p: any) => {
        try {
          const detailUrl =
            `https://maps.googleapis.com/maps/api/place/details/json` +
            `?place_id=${p.place_id}&fields=geometry,name,formatted_address&key=${MAPS_API_KEY}`;
          const detailRes = await fetch(detailUrl);
          const detail = await detailRes.json();
          if (detail.status === 'OK') {
            const loc = detail.result.geometry.location;
            return {
              name: detail.result.name || p.structured_formatting.main_text,
              address: detail.result.formatted_address || p.structured_formatting.secondary_text || '',
              lat: loc.lat,
              lng: loc.lng,
            };
          }
        } catch {}
        return null;
      }),
    );
    return results.filter(Boolean) as any[];
  } catch {
    return [];
  }
}
