import { useState } from 'react';
import * as ExpoLocation from 'expo-location';
import { useAppStore } from '../store/useAppStore';

export function useLocation() {
  const [loading, setLoading] = useState(false);
  const { setPickup, showToast } = useAppStore();

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Location permission denied');
        return;
      }
      const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
      const { latitude: lat, longitude: lng } = loc.coords;
      // Reverse geocode
      const places = await ExpoLocation.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const p = places[0];
      const name = p?.subregion || p?.district || p?.city || 'My Location';
      setPickup({ lat, lng, name });
      showToast(`Pickup set: ${name}`);
    } catch {
      showToast('Could not get location');
    } finally {
      setLoading(false);
    }
  };

  return { getCurrentLocation, loading };
}
