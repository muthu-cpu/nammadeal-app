import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useAppStore } from '../store/useAppStore';
import { BUSES } from '../data/busRoutes';
import { useDeepLink } from '../hooks/useDeepLink';
import { SaveBar } from '../components/common/SaveBar';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';

type TType = 'bus' | 'train' | 'flight';

const POPULAR_ROUTES = [
  { from: 'Bengaluru', to: 'Chennai' },
  { from: 'Bengaluru', to: 'Hyderabad' },
  { from: 'Bengaluru', to: 'Mysuru' },
  { from: 'Bengaluru', to: 'Goa' },
  { from: 'Bengaluru', to: 'Coimbatore' },
  { from: 'Bengaluru', to: 'Pune' },
  { from: 'Bengaluru', to: 'Mumbai' },
  { from: 'Bengaluru', to: 'Kochi' },
];

const BUS_LOGO_COLORS: Record<string, string> = {
  red: '#DC2626', org: '#EA580C', blu: '#2563EB', grn: '#16A34A', gov: '#6D28D9',
};

export default function TravelsScreen() {
  const { addSavings, showToast } = useAppStore();
  const { openApp } = useDeepLink();
  const [tType, setTType] = useState<TType>('bus');
  const [fromCity, setFromCity] = useState('Bengaluru');
  const [toCity, setToCity] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [savings, setSavings] = useState(0);
  const [route, setRoute] = useState('');

  const swapCities = () => { const tmp = fromCity; setFromCity(toCity); setToCity(tmp); };

  const search = async () => {
    if (!fromCity.trim() || !toCity.trim()) { showToast('Enter From and To cities'); return; }
    if (tType !== 'bus') { showToast('Train & Flight coming soon!'); return; }
    setLoading(true);
    setResults([]);
    await new Promise(r => setTimeout(r, 1600));
    const key = fromCity.trim().split(' ')[0] + '-' + toCity.trim().split(' ')[0];
    const data = (BUSES as any)[key] || Object.values(BUSES)[0].map((b: any) => ({
      ...b, p: b.p + Math.floor(Math.random() * 200) - 50,
    }));
    const sorted = [...data].sort((a: any, b: any) => a.p - b.p);
    const diff = sorted[sorted.length - 1].p - sorted[0].p;
    setSavings(diff * passengers);
    addSavings(diff * passengers);
    setResults(sorted);
    setRoute(fromCity + ' to ' + toCity);
    setLoading(false);
  };

  const setPopularRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    setTimeout(search, 100);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
        {/* Travel form */}
        <View style={styles.form}>
          {/* Type toggle */}
          <View style={styles.typeToggle}>
            {(['bus', 'train', 'flight'] as TType[]).map(t => (
              <TouchableOpacity key={t} style={[styles.typeBtn, tType === t && styles.typeBtnActive]} onPress={() => setTType(t)}>
                <Text style={[styles.typeBtnText, tType === t && styles.typeBtnTextActive]}>
                  {t === 'bus' ? 'Bus' : t === 'train' ? 'Train' : 'Flight'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* City row */}
          <View style={styles.cityRow}>
            <TextInput style={styles.cityInp} placeholder="From city" placeholderTextColor={Colors.muted} value={fromCity} onChangeText={setFromCity} />
            <TouchableOpacity style={styles.swapBtn} onPress={swapCities}>
              <Text style={{ color: Colors.muted2, fontFamily: Fonts.semibold }}>SW</Text>
            </TouchableOpacity>
            <TextInput style={styles.cityInp} placeholder="To city" placeholderTextColor={Colors.muted} value={toCity} onChangeText={setToCity} />
          </View>
          {/* Passengers */}
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Passengers</Text>
            <View style={styles.passCtrl}>
              <TouchableOpacity style={styles.passBtn} onPress={() => setPassengers(Math.max(1, passengers - 1))}>
                <Text style={{ color: Colors.text, fontSize: 18 }}>-</Text>
              </TouchableOpacity>
              <Text style={styles.passNum}>{passengers}</Text>
              <TouchableOpacity style={styles.passBtn} onPress={() => setPassengers(Math.min(6, passengers + 1))}>
                <Text style={{ color: Colors.text, fontSize: 18 }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.searchCta} onPress={search}>
          <Text style={styles.searchCtaText}>Compare Prices</Text>
        </TouchableOpacity>

        {/* Popular routes */}
        <Text style={styles.sectionLbl}>Popular Routes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 16 }}>
          {POPULAR_ROUTES.map((r, i) => (
            <TouchableOpacity key={i} style={styles.qchip} onPress={() => setPopularRoute(r.from, r.to)}>
              <Text style={styles.qchipText}>{r.to}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingTxt}>Searching buses from {fromCity} to {toCity}...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <SaveBar savings={savings} label="Best price saves you/person" />
            <View style={styles.resHeader}>
              <Text style={styles.resTitle}>{route}</Text>
              <Text style={styles.resCnt}>{results.length} options · {passengers} pax</Text>
            </View>
            {results.map((b: any, i: number) => {
              const best = i === 0;
              const tot = b.p * passengers;
              const logoColor = BUS_LOGO_COLORS[b.logoKey] || Colors.primary;
              return (
                <View key={i} style={[styles.busCard, best && styles.busCardBest]}>
                  <View style={styles.busTop}>
                    <View style={[styles.busLogo, { backgroundColor: logoColor + '20' }]}>
                      <Text style={[styles.busLogoTxt, { color: logoColor }]}>{b.op[0]}</Text>
                    </View>
                    <View style={styles.busInfo}>
                      <View style={styles.busNameRow}>
                        <Text style={styles.busName}>{b.op}</Text>
                        {best && <View style={styles.busBestTag}><Text style={styles.busBestTxt}>CHEAPEST</Text></View>}
                      </View>
                      <Text style={styles.busMeta}>{b.name} · {b.type}</Text>
                    </View>
                    <View style={styles.busPrice}>
                      <Text style={styles.busAmt}>₹{b.p}</Text>
                      <Text style={styles.busPer}>per person</Text>
                    </View>
                  </View>
                  <View style={styles.busDetails}>
                    <View style={[styles.busTag, styles.busTagBlue]}><Text style={styles.busTagBlueTxt}>{b.dep} to {b.arr}</Text></View>
                    <View style={styles.busTag}><Text style={styles.busTagTxt}>{b.dur}</Text></View>
                    <View style={[styles.busTag, b.r >= 4.3 && styles.busTagGreen]}>
                      <Text style={[styles.busTagTxt, b.r >= 4.3 && { color: Colors.green }]}>★ {b.r}</Text>
                    </View>
                    {passengers > 1 && (
                      <View style={[styles.busTag, styles.busTagGreen]}>
                        <Text style={{ fontSize: 11, color: Colors.green, fontFamily: Fonts.medium }}>Total ₹{tot}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.busFooter}>
                    <Text style={styles.busSeats}><Text style={{ color: Colors.green, fontFamily: Fonts.bold }}>{b.seats}</Text> seats left</Text>
                    <TouchableOpacity style={styles.busBookBtn} onPress={() => openApp(b.op, b.dl, b.ps)}>
                      <Text style={styles.busBookTxt}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  form: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  typeToggle: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  typeBtn: { flex: 1, padding: 10, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
  typeBtnActive: { backgroundColor: Colors.primaryDim },
  typeBtnText: { fontSize: 12, fontFamily: Fonts.semibold, color: Colors.muted2 },
  typeBtnTextActive: { color: Colors.primary },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cityInp: { flex: 1, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 9, paddingHorizontal: 12, color: Colors.text, fontSize: 14, fontFamily: Fonts.medium },
  swapBtn: { width: 32, height: 32, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  passRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  passLabel: { flex: 1, fontSize: 12, color: Colors.muted, fontFamily: Fonts.body },
  passCtrl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  passBtn: { width: 28, height: 28, borderRadius: 7, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  passNum: { fontSize: 16, fontFamily: Fonts.bold, color: Colors.text, minWidth: 20, textAlign: 'center' },
  searchCta: { width: '100%', padding: 14, backgroundColor: Colors.primary, borderRadius: 11, alignItems: 'center', marginBottom: 14 },
  searchCtaText: { fontSize: 15, fontFamily: Fonts.bold, color: '#000' },
  sectionLbl: { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, fontFamily: Fonts.semibold },
  qchip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  qchipText: { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.medium },
  loadingWrap: { alignItems: 'center', padding: 40, gap: 12 },
  loadingTxt: { fontSize: 13, color: Colors.muted2, textAlign: 'center', fontFamily: Fonts.body },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  resTitle: { fontFamily: Fonts.display, fontSize: 16, color: Colors.text, letterSpacing: 0.5 },
  resCnt: { fontSize: 11, color: Colors.muted, fontFamily: Fonts.body },
  busCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 14, marginBottom: 8 },
  busCardBest: { borderColor: Colors.borderGold },
  busTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  busLogo: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  busLogoTxt: { fontSize: 20, fontFamily: Fonts.bold },
  busInfo: { flex: 1 },
  busNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  busName: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.text },
  busBestTag: { backgroundColor: Colors.primaryDim, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  busBestTxt: { fontSize: 9, color: Colors.primary, fontFamily: Fonts.bold },
  busMeta: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body },
  busPrice: { alignItems: 'flex-end' },
  busAmt: { fontFamily: Fonts.display, fontSize: 22, color: Colors.text, letterSpacing: 0.5 },
  busPer: { fontSize: 10, color: Colors.muted, fontFamily: Fonts.body },
  busDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  busTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border },
  busTagBlue: { backgroundColor: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)' },
  busTagBlueTxt: { fontSize: 11, color: '#60a5fa', fontFamily: Fonts.medium },
  busTagGreen: { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' },
  busTagTxt: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.medium },
  busFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  busSeats: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body },
  busBookBtn: { paddingHorizontal: 16, paddingVertical: 7, backgroundColor: Colors.primary, borderRadius: 8 },
  busBookTxt: { fontSize: 12, fontFamily: Fonts.bold, color: '#000' },
});
