import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Linking,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useAppStore } from '../store/useAppStore';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';

// ── Google Maps Directions API ───────────────────────────────
// Key loaded from .env (EXPO_PUBLIC_GMAPS_KEY) — never hardcode credentials
const GMAPS_KEY = process.env.EXPO_PUBLIC_GMAPS_KEY || '';

// ── Popular Bengaluru locations ──────────────────────────────
const POPULAR = [
  'Majestic', 'MG Road', 'Koramangala', 'Indiranagar',
  'Whitefield', 'Electronic City', 'Hebbal', 'Jayanagar',
  'Yeshwanthpur', 'KR Puram', 'Bannerghatta Road', 'Airport',
];

interface Step {
  mode: 'WALKING' | 'TRANSIT' | 'DRIVING';
  instruction: string;
  distance: string;
  duration: string;
  transitDetails?: {
    lineName: string;
    lineShort: string;
    vehicleType: string;
    departStop: string;
    arriveStop: string;
    numStops: number;
    color: string;
  };
}

interface Route {
  totalDuration: string;
  totalDistance: string;
  fare?: string;
  steps: Step[];
  summary: string;
}

const MODE_ICON: Record<string, string> = {
  BUS:       '🚌',
  SUBWAY:    '🚇',
  TRAM:      '🚊',
  RAIL:      '🚆',
  WALKING:   '🚶',
  DRIVING:   '🚗',
  HEAVY_RAIL:'🚆',
  COMMUTER_TRAIN: '🚆',
  SHARE_TAXI: '🛺',
};

function modeColor(type: string): string {
  switch (type) {
    case 'BUS':    return '#F5A623';
    case 'SUBWAY': return '#3B82F6';
    case 'RAIL':   return '#8B5CF6';
    case 'TRAM':   return '#22C55E';
    default:       return Colors.muted2;
  }
}

async function fetchTransitRoutes(origin: string, destination: string): Promise<Route[]> {
  const enc = encodeURIComponent;
  const url =
    `https://maps.googleapis.com/maps/api/directions/json` +
    `?origin=${enc(origin + ', Bengaluru')}` +
    `&destination=${enc(destination + ', Bengaluru')}` +
    `&mode=transit&alternatives=true&region=IN` +
    `&key=${GMAPS_KEY}`;

  const res  = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.routes?.length) return [];

  return data.routes.slice(0, 4).map((route: any) => {
    const leg = route.legs[0];
    const steps: Step[] = leg.steps.map((s: any) => {
      const transit = s.transit_details;
      return {
        mode: s.travel_mode,
        instruction: s.html_instructions?.replace(/<[^>]*>/g, '') || s.travel_mode,
        distance: s.distance?.text || '',
        duration: s.duration?.text || '',
        transitDetails: transit ? {
          lineName:   transit.line?.name || '',
          lineShort:  transit.line?.short_name || transit.line?.name || '',
          vehicleType: transit.line?.vehicle?.type || 'BUS',
          departStop:  transit.departure_stop?.name || '',
          arriveStop:  transit.arrival_stop?.name || '',
          numStops:    transit.num_stops || 0,
          color:       transit.line?.color || '#F5A623',
        } : undefined,
      };
    });

    return {
      totalDuration: leg.duration?.text || '',
      totalDistance: leg.distance?.text || '',
      fare:          leg.fare?.text,
      summary:       route.summary || steps.filter(s => s.transitDetails).map(s => s.transitDetails!.lineShort).join(' → '),
      steps,
    };
  });
}

export default function RouteFinderScreen() {
  const { showToast } = useAppStore();
  const [from, setFrom]       = useState('');
  const [to,   setTo]         = useState('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes]   = useState<Route[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);

  const swap = () => { const t = from; setFrom(to); setTo(t); };

  const search = useCallback(async () => {
    if (!from.trim() || !to.trim()) { showToast('Enter From and To locations'); return; }
    setLoading(true);
    setRoutes([]);
    setExpanded(0);
    try {
      const results = await fetchTransitRoutes(from.trim(), to.trim());
      if (!results.length) {
        showToast('No transit routes found. Try different locations.');
      }
      setRoutes(results);
    } catch {
      showToast('Could not fetch routes. Check internet connection.');
    }
    setLoading(false);
  }, [from, to]);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from + ', Bengaluru')}&destination=${encodeURIComponent(to + ', Bengaluru')}&travelmode=transit`;
    Linking.openURL(url);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Search form */}
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <View style={[styles.dot, { backgroundColor: Colors.green }]} />
            <TextInput
              style={styles.input}
              placeholder="From (e.g. Majestic)"
              placeholderTextColor={Colors.muted}
              value={from}
              onChangeText={setFrom}
              returnKeyType="next"
            />
          </View>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.swapBtn} onPress={swap}>
            <Text style={styles.swapTxt}>⇅</Text>
          </TouchableOpacity>
          <View style={styles.inputRow}>
            <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
            <TextInput
              style={styles.input}
              placeholder="To (e.g. Whitefield)"
              placeholderTextColor={Colors.muted}
              value={to}
              onChangeText={setTo}
              onSubmitEditing={search}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Popular chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {POPULAR.map(p => (
            <TouchableOpacity key={p} style={styles.chip} onPress={() => { if (!from) setFrom(p); else setTo(p); }}>
              <Text style={styles.chipTxt}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search CTA */}
        <TouchableOpacity style={styles.searchBtn} onPress={search} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.searchBtnTxt}>🗺️  Find All Routes</Text>}
        </TouchableOpacity>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingTxt}>Searching bus, metro & all transit...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && routes.length > 0 && (
          <>
            <View style={styles.resHeader}>
              <Text style={styles.resTitle}>{from} → {to}</Text>
              <Text style={styles.resCnt}>{routes.length} options</Text>
            </View>

            {routes.map((route, ri) => {
              const isOpen = expanded === ri;
              // Dominant mode
              const transitSteps = route.steps.filter(s => s.transitDetails);
              return (
                <TouchableOpacity
                  key={ri}
                  style={[styles.routeCard, ri === 0 && styles.routeCardBest]}
                  onPress={() => setExpanded(isOpen ? null : ri)}
                  activeOpacity={0.85}
                >
                  {/* Card header */}
                  <View style={styles.routeTop}>
                    <View style={styles.routeModes}>
                      {route.steps.map((s, si) => {
                        if (s.mode === 'WALKING' && !s.transitDetails) {
                          return <Text key={si} style={styles.modeEmoji}>🚶</Text>;
                        }
                        if (s.transitDetails) {
                          const vt = s.transitDetails.vehicleType;
                          return (
                            <View key={si} style={[styles.lineBadge, { backgroundColor: s.transitDetails.color + '22', borderColor: s.transitDetails.color + '55' }]}>
                              <Text style={styles.modeEmoji}>{MODE_ICON[vt] || '🚌'}</Text>
                              <Text style={[styles.lineBadgeTxt, { color: s.transitDetails.color || Colors.primary }]}>
                                {s.transitDetails.lineShort}
                              </Text>
                            </View>
                          );
                        }
                        return null;
                      })}
                    </View>
                    <View style={styles.routeMeta}>
                      <Text style={styles.routeDuration}>{route.totalDuration}</Text>
                      <Text style={styles.routeDist}>{route.totalDistance}</Text>
                    </View>
                  </View>

                  {ri === 0 && (
                    <View style={styles.bestTag}><Text style={styles.bestTagTxt}>⚡ FASTEST</Text></View>
                  )}

                  {route.fare && (
                    <Text style={styles.fareTag}>Approx. fare: {route.fare}</Text>
                  )}

                  {/* Expanded steps */}
                  {isOpen && (
                    <View style={styles.steps}>
                      {route.steps.map((step, si) => (
                        <View key={si} style={styles.stepRow}>
                          <Text style={styles.stepIcon}>
                            {step.transitDetails ? (MODE_ICON[step.transitDetails.vehicleType] || '🚌') : (step.mode === 'WALKING' ? '🚶' : '🚗')}
                          </Text>
                          <View style={styles.stepInfo}>
                            {step.transitDetails ? (
                              <>
                                <Text style={styles.stepMain}>
                                  {step.transitDetails.vehicleType === 'SUBWAY' ? '🚇 Metro' : '🚌 Bus'}{' '}
                                  <Text style={{ color: Colors.primary }}>{step.transitDetails.lineShort}</Text>
                                </Text>
                                <Text style={styles.stepSub}>
                                  {step.transitDetails.departStop} → {step.transitDetails.arriveStop}
                                </Text>
                                <Text style={styles.stepSub}>
                                  {step.transitDetails.numStops} stops • {step.duration}
                                </Text>
                              </>
                            ) : (
                              <>
                                <Text style={styles.stepMain}>{step.instruction}</Text>
                                <Text style={styles.stepSub}>{step.distance} • {step.duration}</Text>
                              </>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.tapHint}>{isOpen ? '▲ Collapse' : '▼ Show step-by-step'}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Open in Google Maps */}
            <TouchableOpacity style={styles.gmapsBtn} onPress={openGoogleMaps}>
              <Text style={styles.gmapsBtnTxt}>🗺️  Open full route in Google Maps</Text>
            </TouchableOpacity>
          </>
        )}

        {!loading && routes.length === 0 && (from || to) && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTxt}>Search to find bus, metro & auto routes</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll:        { padding: 14, paddingBottom: 80 },
  card:          { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden', marginBottom: 10, position: 'relative' },
  inputRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 13 },
  dot:           { width: 10, height: 10, borderRadius: 5 },
  input:         { flex: 1, color: Colors.text, fontSize: 14, fontFamily: Fonts.body },
  separator:     { height: 1, backgroundColor: Colors.border, marginLeft: 38 },
  swapBtn:       { position: 'absolute', right: 14, top: '50%', marginTop: -16, width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  swapTxt:       { color: Colors.muted2, fontSize: 16 },
  chips:         { gap: 6, marginBottom: 10 },
  chip:          { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  chipTxt:       { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.medium },
  searchBtn:     { backgroundColor: Colors.primary, borderRadius: 11, padding: 14, alignItems: 'center', marginBottom: 16 },
  searchBtnTxt:  { fontSize: 15, fontFamily: Fonts.bold, color: '#000' },
  loadingBox:    { alignItems: 'center', padding: 40, gap: 12 },
  loadingTxt:    { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body, textAlign: 'center' },
  resHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  resTitle:      { fontFamily: Fonts.display, fontSize: 15, color: Colors.text, flex: 1 },
  resCnt:        { fontSize: 11, color: Colors.muted, fontFamily: Fonts.body },
  routeCard:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 14, marginBottom: 8 },
  routeCardBest: { borderColor: Colors.borderGold },
  routeTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  routeModes:    { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' },
  modeEmoji:     { fontSize: 16 },
  lineBadge:     { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  lineBadgeTxt:  { fontSize: 11, fontFamily: Fonts.bold },
  routeMeta:     { alignItems: 'flex-end' },
  routeDuration: { fontFamily: Fonts.display, fontSize: 18, color: Colors.text },
  routeDist:     { fontSize: 10, color: Colors.muted, fontFamily: Fonts.body },
  bestTag:       { backgroundColor: Colors.primaryDim, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6 },
  bestTagTxt:    { fontSize: 10, color: Colors.primary, fontFamily: Fonts.bold },
  fareTag:       { fontSize: 11, color: Colors.green, fontFamily: Fonts.semibold, marginBottom: 6 },
  tapHint:       { fontSize: 10, color: Colors.muted, fontFamily: Fonts.body, textAlign: 'center', marginTop: 8 },
  steps:         { marginTop: 10, gap: 8 },
  stepRow:       { flexDirection: 'row', gap: 10, paddingLeft: 4 },
  stepIcon:      { fontSize: 18, width: 26, textAlign: 'center' },
  stepInfo:      { flex: 1, gap: 2 },
  stepMain:      { fontSize: 13, color: Colors.text, fontFamily: Fonts.semibold },
  stepSub:       { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body },
  gmapsBtn:      { marginTop: 6, padding: 12, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 11, alignItems: 'center' },
  gmapsBtnTxt:   { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.semibold },
  emptyBox:      { alignItems: 'center', padding: 40, gap: 10 },
  emptyIcon:     { fontSize: 48 },
  emptyTxt:      { fontSize: 13, color: Colors.muted, fontFamily: Fonts.body, textAlign: 'center' },
});
