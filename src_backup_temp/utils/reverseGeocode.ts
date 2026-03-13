/** Calls Nominatim OSM reverse geocoding API. Returns a human-readable area name. */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NammaDeal/1.0 (Android app)' },
    });
    const data = await res.json();
    const a = data.address || {};
    return (
      a.suburb ||
      a.neighbourhood ||
      a.quarter ||
      a.city_district ||
      a.road ||
      a.town ||
      a.city ||
      'Selected Location'
    );
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/** Calls Nominatim search API. Returns up to 6 place suggestions. */
export async function searchPlaces(query: string): Promise<{ name: string; address: string; lat: number; lng: number }[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1&countrycodes=in`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NammaDeal/1.0 (Android app)' },
    });
    const data = await res.json();
    return data.map((x: any) => ({
      name: x.display_name.split(',')[0],
      address: x.display_name.split(',').slice(1, 3).join(',').trim(),
      lat: parseFloat(x.lat),
      lng: parseFloat(x.lon),
    }));
  } catch {
    return [];
  }
}
