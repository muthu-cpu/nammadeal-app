import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, FlatList, ActivityIndicator, Keyboard,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useAppStore } from '../../store/useAppStore';
import { searchPlaces, reverseGeocode } from '../../utils/reverseGeocode';
import { DARK_MAP_STYLE } from '../../constants/mapStyle';

const BLR = { latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export function MapModal() {
  const { mapOpen, mapTarget, closeMap, setPickup, setDrop, showToast } = useAppStore();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('Tap map or drag crosshair to select');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [tappedCoord, setTappedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchBottom, setSearchBottom] = useState(130);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-show error fallback if map doesn't load within 12 seconds
  useEffect(() => {
    if (mapOpen && !mapReady && !mapError) {
      mapErrorTimer.current = setTimeout(() => {
        setMapError(true);
      }, 12000);
    }
    return () => {
      if (mapErrorTimer.current) clearTimeout(mapErrorTimer.current);
    };
  }, [mapOpen, mapReady, mapError]);

  const onRegionChangeComplete = useCallback((region: any) => {
    if (geoTimer.current) clearTimeout(geoTimer.current);
    geoTimer.current = setTimeout(async () => {
      setCurrentAddress('Locating...');
      const result = await reverseGeocode(region.latitude, region.longitude);
      setCurrentAddress(result);
      setCurrentCoords({ lat: region.latitude, lng: region.longitude });
    }, 600);
  }, []);

  const onSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (text.length < 2) { setSuggestions([]); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const results = await searchPlaces(text);
      setSuggestions(results);
      setSearching(false);
    }, 400);
  }, []);

  const pickSuggestion = useCallback((item: any) => {
    setSearchQuery(item.name);
    setSuggestions([]);
    Keyboard.dismiss();
    setCurrentAddress(item.name + (item.address ? ', ' + item.address : ''));
    setCurrentCoords({ lat: item.lat, lng: item.lng });
    setTappedCoord({ latitude: item.lat, longitude: item.lng });
    mapRef.current?.animateToRegion(
      { latitude: item.lat, longitude: item.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      500,
    );
  }, []);

  // Tap on map → drop pin exactly there
  const onMapPress = useCallback(async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTappedCoord({ latitude, longitude });
    setCurrentCoords({ lat: latitude, lng: longitude });
    setCurrentAddress('Locating...');
    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 },
      300,
    );
    const addr = await reverseGeocode(latitude, longitude);
    setCurrentAddress(addr);
  }, []);

  // Use current GPS location
  const useMyLocation = useCallback(async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { showToast('Location permission denied'); setLocating(false); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;
      setTappedCoord({ latitude, longitude });
      setCurrentCoords({ lat: latitude, lng: longitude });
      setCurrentAddress('Locating...');
      mapRef.current?.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 },
        500,
      );
      const addr = await reverseGeocode(latitude, longitude);
      setCurrentAddress(addr);
    } catch { showToast('Could not get location'); }
    setLocating(false);
  }, []);

  const confirmLocation = useCallback(() => {
    if (!currentCoords) { showToast('Tap on the map to select a location'); return; }
    const loc = { lat: currentCoords.lat, lng: currentCoords.lng, name: currentAddress };
    if (mapTarget === 'pickup') setPickup(loc);
    else setDrop(loc);
    showToast((mapTarget === 'pickup' ? 'Pickup' : 'Drop') + ' set: ' + currentAddress);
    closeMap();
    setSearchQuery('');
    setSuggestions([]);
    setCurrentAddress('Tap map or drag crosshair to select');
    setCurrentCoords(null);
    setTappedCoord(null);
    setMapError(false);
    setMapReady(false);
  }, [currentCoords, currentAddress, mapTarget]);

  return (
    <Modal visible={mapOpen} animationType="slide" statusBarTranslucent onRequestClose={closeMap}>
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={closeMap}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {mapTarget === 'pickup' ? '📍 Select Pickup' : '🎯 Select Drop'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Search */}
        <View
          style={styles.searchWrap}
          onLayout={(e) => setSearchBottom(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
        >
          <View style={styles.searchBar}>
            <Text style={{ fontSize: 15, color: Colors.muted }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search area, landmark or pincode..."
              placeholderTextColor={Colors.muted}
              value={searchQuery}
              onChangeText={onSearch}
              autoCorrect={false}
            />
            {searching && <ActivityIndicator color={Colors.primary} size="small" />}
            {searchQuery.length > 0 && !searching && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSuggestions([]); }}>
                <Text style={{ color: Colors.muted, fontSize: 16, paddingHorizontal: 4 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Suggestions overlay */}
        {suggestions.length > 0 && (
          <View style={[styles.suggBox, { top: searchBottom }]}>
            <FlatList
              data={suggestions}
              keyExtractor={(_, i) => String(i)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggItem} onPress={() => pickSuggestion(item)}>
                  <Text style={styles.suggName}>{item.name}</Text>
                  <Text style={styles.suggAddr} numberOfLines={1}>{item.address}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Map */}
        <View style={styles.mapWrap}>
          {mapError ? (
            /* Fallback if map fails to load */
            <View style={styles.mapFallback}>
              <Text style={styles.mapFallbackIcon}>🗺️</Text>
              <Text style={styles.mapFallbackTitle}>Map Unavailable</Text>
              <Text style={styles.mapFallbackText}>
                Google Maps couldn't load.{'\n'}
                Use the search bar above to find a location.
              </Text>
              <TouchableOpacity
                style={styles.mapFallbackBtn}
                onPress={() => { setMapError(false); setMapReady(false); }}
              >
                <Text style={styles.mapFallbackBtnTxt}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {!mapReady && (
                <View style={styles.mapLoading}>
                  <ActivityIndicator color={Colors.primary} size="large" />
                  <Text style={styles.mapLoadingTxt}>Loading map...</Text>
                </View>
              )}
              <MapView
                ref={mapRef}
                style={[styles.map, !mapReady && styles.mapHidden]}
                provider={PROVIDER_GOOGLE}
                initialRegion={BLR}
                onRegionChangeComplete={onRegionChangeComplete}
                onPress={onMapPress}
                onMapReady={() => {
                  setMapReady(true);
                  if (mapErrorTimer.current) clearTimeout(mapErrorTimer.current);
                }}
                showsUserLocation
                showsMyLocationButton={false}
                loadingEnabled
                loadingIndicatorColor={Colors.primary}
                loadingBackgroundColor={Colors.bg}
                customMapStyle={DARK_MAP_STYLE}
                moveOnMarkerPress={false}
              >
                {tappedCoord && (
                  <Marker coordinate={tappedCoord} anchor={{ x: 0.5, y: 1 }}>
                    <View style={styles.tapMarker}>
                      <View style={[styles.tapMarkerDot, { backgroundColor: mapTarget === 'pickup' ? Colors.green : Colors.primary }]} />
                      <Text style={[styles.tapMarkerLabel, { color: mapTarget === 'pickup' ? Colors.green : Colors.primary }]}>
                        {mapTarget === 'pickup' ? 'PICKUP' : 'DROP'}
                      </Text>
                      <View style={[styles.tapMarkerStem, { backgroundColor: mapTarget === 'pickup' ? Colors.green : Colors.primary }]} />
                    </View>
                  </Marker>
                )}
              </MapView>
            </>
          )}

          {/* Crosshair (shows only when no tap pin yet) */}
          {mapReady && !mapError && !tappedCoord && (
            <View style={styles.pinWrap} pointerEvents="none">
              <View style={[styles.crossH, { backgroundColor: mapTarget === 'pickup' ? Colors.green : Colors.primary }]} />
              <View style={[styles.crossV, { backgroundColor: mapTarget === 'pickup' ? Colors.green : Colors.primary }]} />
            </View>
          )}

          {/* GPS button */}
          {mapReady && !mapError && (
            <TouchableOpacity style={styles.gpsBtn} onPress={useMyLocation} disabled={locating}>
              {locating
                ? <ActivityIndicator color={Colors.primary} size="small" />
                : <Text style={styles.gpsBtnTxt}>📍 My Location</Text>
              }
            </TouchableOpacity>
          )}

          {/* Hint */}
          {mapReady && !mapError && !tappedCoord && (
            <View style={styles.hintWrap} pointerEvents="none">
              <Text style={styles.hintTxt}>👇 Tap anywhere to drop a pin</Text>
            </View>
          )}
        </View>

        {/* Confirm bar */}
        <View style={[styles.confirmBar, { paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.addrRow}>
            <Text style={styles.addrLabel}>
              {mapTarget === 'pickup' ? '📍 Pickup' : '🎯 Drop'}
            </Text>
            <Text style={styles.addrTxt} numberOfLines={2}>{currentAddress}</Text>
          </View>
          <TouchableOpacity
            style={[styles.confirmBtn, !currentCoords && styles.confirmBtnDisabled]}
            onPress={confirmLocation}
            disabled={!mapError && !currentCoords}
          >
            <Text style={styles.confirmTxt}>Confirm Location</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  closeBtn:     { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  closeTxt:     { color: Colors.muted2, fontSize: 14, fontFamily: Fonts.semibold },
  title:        { flex: 1, textAlign: 'center', fontFamily: Fonts.display, fontSize: 18, color: Colors.text, letterSpacing: 1 },

  searchWrap:   { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 12 },
  searchBar:    { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 11, paddingHorizontal: 12 },
  searchInput:  { flex: 1, paddingVertical: 11, color: Colors.text, fontSize: 14, fontFamily: Fonts.body },

  suggBox:      { position: 'absolute', left: 12, right: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 11, zIndex: 100, elevation: 10, maxHeight: 240 },
  suggItem:     { padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  suggName:     { fontSize: 13, fontFamily: Fonts.semibold, color: Colors.text },
  suggAddr:     { fontSize: 11, color: Colors.muted2, marginTop: 2 },

  mapWrap:      { flex: 1, position: 'relative' },
  map:          { flex: 1 },
  mapHidden:    { opacity: 0 },

  mapLoading:   { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg, gap: 12 },
  mapLoadingTxt:{ fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body },

  mapFallback:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  mapFallbackIcon:  { fontSize: 56 },
  mapFallbackTitle: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.text },
  mapFallbackText:  { fontSize: 13, color: Colors.muted2, textAlign: 'center', lineHeight: 20, fontFamily: Fonts.body },
  mapFallbackBtn:   { marginTop: 12, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 10 },
  mapFallbackBtnTxt:{ fontSize: 13, fontFamily: Fonts.semibold, color: Colors.primary },

  // Crosshair
  pinWrap:      { position: 'absolute', top: '50%', left: '50%', alignItems: 'center', justifyContent: 'center', marginLeft: -20, marginTop: -20, width: 40, height: 40 },
  crossH:       { position: 'absolute', width: 28, height: 2, borderRadius: 1, opacity: 0.7 },
  crossV:       { position: 'absolute', width: 2, height: 28, borderRadius: 1, opacity: 0.7 },

  // GPS button
  gpsBtn:       { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  gpsBtnTxt:    { fontSize: 12, color: Colors.primary, fontFamily: Fonts.semibold },

  // Hint
  hintWrap:     { position: 'absolute', bottom: 16, alignSelf: 'center', backgroundColor: 'rgba(8,8,10,0.8)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: Colors.border },
  hintTxt:      { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.body },

  // Tap marker
  tapMarker:    { alignItems: 'center' },
  tapMarkerDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#fff' },
  tapMarkerLabel:{ fontSize: 9, fontFamily: Fonts.bold, marginTop: 2, backgroundColor: Colors.card, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  tapMarkerStem:{ width: 2, height: 12, borderRadius: 1, marginTop: 1 },

  confirmBar:   { backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border, padding: 14, gap: 10 },
  addrRow:      { gap: 2 },
  addrLabel:    { fontSize: 10, color: Colors.muted, fontFamily: Fonts.semibold, textTransform: 'uppercase', letterSpacing: 1 },
  addrTxt:      { fontSize: 14, color: Colors.text, minHeight: 38, fontFamily: Fonts.body, lineHeight: 20 },
  confirmBtn:   { padding: 14, backgroundColor: Colors.primary, borderRadius: 10, alignItems: 'center' },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmTxt:   { fontSize: 15, fontFamily: Fonts.bold, color: '#000' },
});
