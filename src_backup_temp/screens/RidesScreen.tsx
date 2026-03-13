import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useAppStore } from '../store/useAppStore';
import { haversine } from '../utils/haversine';
import { calcRidePrices } from '../utils/ridesPricing';
import { useDeepLink } from '../hooks/useDeepLink';
import { SaveBar } from '../components/common/SaveBar';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';

const QUICK_DESTS = [
  { name: 'Airport', lat: 13.1986, lng: 77.7066 },
  { name: 'MG Road', lat: 12.9756, lng: 77.6099 },
  { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
  { name: 'Whitefield', lat: 12.9698, lng: 77.75 },
  { name: 'Electronic City', lat: 12.8458, lng: 77.6603 },
  { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
  { name: 'HSR Layout', lat: 12.9116, lng: 77.6389 },
];

const BLR = { lat: 12.9716, lng: 77.5946, name: 'Bengaluru Centre' };

export default function RidesScreen() {
  const { pickup, drop, setPickup, setDrop, swapLocations, openMap, addSavings, showToast } = useAppStore();
  const { openApp } = useDeepLink();
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState<any[]>([]);
  const [distance, setDistance] = useState(0);
  const [savings, setSavings] = useState(0);
  const [sort, setSort] = useState<'price' | 'eta'>('price');

  const compare = async () => {
    if (!pickup || !drop) { showToast('Select pickup and drop first'); return; }
    setLoading(true);
    setRides([]);
    await new Promise(r => setTimeout(r, 1500));
    const dist = haversine(pickup.lat, pickup.lng, drop.lat, drop.lng);
    const rideOptions = calcRidePrices(dist);
    const save = Math.max(...rideOptions.map(r => r.price)) - Math.min(...rideOptions.map(r => r.price));
    setDistance(dist);
    setSavings(save);
    addSavings(save);
    setRides(rideOptions);
    setLoading(false);
  };

  const sorted = [...rides].sort((a, b) => sort === 'eta' ? a.eta - b.eta : a.price - b.price);

  const setQuickDest = (dest: typeof QUICK_DESTS[0]) => {
    if (!pickup) setPickup(BLR);
    setDrop({ lat: dest.lat, lng: dest.lng, name: dest.name });
    showToast('Drop set: ' + dest.name);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
        {/* Location card */}
        <Text style={styles.sectionLbl}>Choose Locations</Text>
        <View style={styles.locCard}>
          <TouchableOpacity style={styles.locRow} onPress={() => openMap('pickup')}>
            <View style={[styles.locDot, { backgroundColor: Colors.green, shadowColor: Colors.green }]} />
            <View style={styles.locText}>
              <Text style={styles.locLabel}>Pickup</Text>
              <Text style={[styles.locVal, !pickup && styles.locPlaceholder]}>
                {pickup?.name || 'Tap to select on map'}
              </Text>
            </View>
            <View style={styles.pinBtn}><Text style={styles.pinBtnText}>Map</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapBtn} onPress={swapLocations}>
            <Text style={{ color: Colors.muted2, fontFamily: Fonts.semibold }}>SW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.locRow, { borderBottomWidth: 0 }]} onPress={() => openMap('drop')}>
            <View style={[styles.locDot, { backgroundColor: Colors.primary, shadowColor: Colors.primary }]} />
            <View style={styles.locText}>
              <Text style={styles.locLabel}>Drop</Text>
              <Text style={[styles.locVal, !drop && styles.locPlaceholder]}>
                {drop?.name || 'Tap to select on map'}
              </Text>
            </View>
            <View style={styles.pinBtn}><Text style={styles.pinBtnText}>Map</Text></View>
          </TouchableOpacity>
        </View>

        {/* Quick destinations */}
        <Text style={styles.sectionLbl}>Quick Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 14 }}>
          {QUICK_DESTS.map((dest, i) => (
            <TouchableOpacity key={i} style={styles.qchip} onPress={() => setQuickDest(dest)}>
              <Text style={styles.qchipText}>{dest.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Compare CTA */}
        <TouchableOpacity
          style={[styles.cta, (!pickup || !drop) && styles.ctaDisabled]}
          onPress={compare}
          disabled={!pickup || !drop}
        >
          <Text style={styles.ctaText}>Compare All Rides</Text>
        </TouchableOpacity>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingTxt}>Comparing Uber, Ola, Rapido & Namma Yatri...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && sorted.length > 0 && (
          <>
            <SaveBar savings={savings} label="Best price saves you" />
            <View style={styles.resHeader}>
              <Text style={styles.resTitle} numberOfLines={1}>
                {pickup?.name?.split(',')[0]} to {drop?.name?.split(',')[0]}
              </Text>
              <Text style={styles.resCnt}>{distance.toFixed(1)} km</Text>
            </View>
            {/* Sort row */}
            <View style={styles.sortRow}>
              <Text style={styles.sortLbl}>Sort:</Text>
              {(['price', 'eta'] as const).map(s => (
                <TouchableOpacity key={s} style={[styles.sortBtn, sort === s && styles.sortBtnActive]} onPress={() => setSort(s)}>
                  <Text style={[styles.sortBtnText, sort === s && styles.sortBtnTextActive]}>
                    {s === 'price' ? 'Price' : 'ETA'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {sorted.map((r, i) => {
              const best = i === 0;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.rideCard, best && styles.rideCardBest]}
                  onPress={() => openApp(r.name, r.deepLink, r.playStore)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.rideIco, { backgroundColor: r.bg }]}>
                    <Text style={styles.rideIcoTxt}>{r.name[0]}</Text>
                  </View>
                  <View style={styles.rideInfo}>
                    <View style={styles.rideNameRow}>
                      <Text style={styles.rideName}>{r.name}</Text>
                      {best && (
                        <View style={styles.rideBestTag}>
                          <Text style={styles.rideBestTxt}>{sort === 'eta' ? 'FASTEST' : 'CHEAPEST'}</Text>
                        </View>
                      )}
                      <View style={[
                        styles.srcBadge,
                        r.source === 'ONDC'    && styles.srcBadge_ONDC,
                        r.source === 'API'     && styles.srcBadge_API,
                        r.source === 'Partner' && styles.srcBadge_Partner,
                      ]}>
                      <Text style={[
                        r.source === 'ONDC'    && styles.srcBadgeTxt_ONDC,
                        r.source === 'API'     && styles.srcBadgeTxt_API,
                        r.source === 'Partner' && styles.srcBadgeTxt_Partner,
                      ]}>{r.source}</Text>
                    </View>
                    </View>
                    <Text style={styles.rideMeta}>{r.type} · {r.eta} mins · {distance.toFixed(1)} km</Text>
                  </View>
                  <View style={styles.ridePrice}>
                    <Text style={styles.rideAmt}>₹{r.price}</Text>
                    <Text style={styles.rideBook}>Book</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionLbl: { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, fontFamily: Fonts.semibold, marginTop: 4 },
  locCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  locDot: { width: 10, height: 10, borderRadius: 5, shadowOffset: { width: 0, height: 0 }, shadowRadius: 6, shadowOpacity: 1 },
  locText: { flex: 1 },
  locLabel: { fontSize: 11, color: Colors.muted, marginBottom: 2, fontFamily: Fonts.body },
  locVal: { fontSize: 14, fontFamily: Fonts.semibold, color: Colors.text },
  locPlaceholder: { color: Colors.muted, fontFamily: Fonts.body },
  pinBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 5 },
  pinBtnText: { fontSize: 11, color: Colors.primary, fontFamily: Fonts.semibold },
  swapBtn: { width: 32, height: 32, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: -6, zIndex: 1 },
  qchip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  qchipText: { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.medium },
  cta: { width: '100%', padding: 14, backgroundColor: Colors.primary, borderRadius: 11, alignItems: 'center', marginBottom: 14 },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { fontSize: 15, fontFamily: Fonts.bold, color: '#000' },
  loadingWrap: { alignItems: 'center', padding: 40, gap: 12 },
  loadingTxt: { fontSize: 13, color: Colors.muted2, textAlign: 'center', fontFamily: Fonts.body },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  resTitle: { fontFamily: Fonts.display, fontSize: 16, color: Colors.text, letterSpacing: 0.5, flex: 1 },
  resCnt: { fontSize: 11, color: Colors.muted, fontFamily: Fonts.body },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sortLbl: { fontSize: 11, color: Colors.muted, fontFamily: Fonts.body },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card2 },
  sortBtnActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.borderGold },
  sortBtnText: { fontSize: 11, fontFamily: Fonts.semibold, color: Colors.muted2 },
  sortBtnTextActive: { color: Colors.primary },
  rideCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 8 },
  rideCardBest: { borderColor: Colors.borderGold },
  rideIco: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rideIcoTxt: { fontSize: 20, fontFamily: Fonts.bold, color: Colors.text },
  rideInfo: { flex: 1, minWidth: 0 },
  rideNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' },
  rideName: { fontSize: 14, fontFamily: Fonts.bold, color: Colors.text },
  rideBestTag: { backgroundColor: Colors.primaryDim, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  rideBestTxt: { fontSize: 9, color: Colors.primary, fontFamily: Fonts.bold },
  srcBadge: { borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  srcBadge_ONDC: { backgroundColor: 'rgba(59,130,246,0.15)' },
  srcBadge_API: { backgroundColor: 'rgba(168,85,247,0.15)' },
  srcBadge_Partner: { backgroundColor: 'rgba(34,197,94,0.15)' },
  srcBadgeTxt_ONDC: { fontSize: 10, color: '#60a5fa', fontFamily: Fonts.semibold },
  srcBadgeTxt_API: { fontSize: 10, color: '#c084fc', fontFamily: Fonts.semibold },
  srcBadgeTxt_Partner: { fontSize: 10, color: '#4ade80', fontFamily: Fonts.semibold },
  rideMeta: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body },
  ridePrice: { alignItems: 'flex-end', flexShrink: 0 },
  rideAmt: { fontFamily: Fonts.display, fontSize: 22, color: Colors.text, letterSpacing: 0.5 },
  rideBook: { fontSize: 10, color: Colors.primary, marginTop: 1, fontFamily: Fonts.medium },
});
