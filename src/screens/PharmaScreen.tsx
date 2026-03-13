import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SaveBar } from '../components/common/SaveBar';
import { ChipRow } from '../components/common/ChipRow';
import { useDeepLink } from '../hooks/useDeepLink';
import { useClipboard } from '../hooks/useClipboard';
import { PharmaOption } from '../store/types';

const PHARMA_CHIPS = [
  { label: 'Dolo 650',    value: 'Dolo 650' },
  { label: 'Vitamin C',   value: 'Vitamin C' },
  { label: 'Paracetamol', value: 'Paracetamol' },
  { label: 'Cetirizine',  value: 'Cetirizine' },
  { label: 'Omeprazole',  value: 'Omeprazole' },
];

export function PharmaScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PharmaOption[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const { addSavings, addRecent, recent, showToast } = useAppStore();
  const { openApp } = useDeepLink();
  const { copyText, shareWhatsApp } = useClipboard();

  const search = async (q: string) => {
    if (!q.trim()) { showToast('Enter medicine name'); return; }
    setLoading(true);
    setLastQuery(q);
    addRecent('pharma', q);
    await new Promise((r) => setTimeout(r, 1500));
    const base = Math.floor(Math.random() * 30) + 20;
    const enc = encodeURIComponent(q);
    const data: PharmaOption[] = [
      { name: '1mg',        price: base,     logo: '1M', bg: 'rgba(230,27,35,.12)',  deepLink: 'tata1mg://search?q=' + enc,   playStore: 'https://play.google.com/store/apps/details?id=com.aranoah.healthkart.plus' },
      { name: 'PharmEasy',  price: base + 3, logo: 'PE', bg: 'rgba(233,30,99,.12)',  deepLink: 'pharmeasy://search?q=' + enc, playStore: 'https://play.google.com/store/apps/details?id=in.pharmeasy.android' },
      { name: 'Apollo 247', price: base + 5, logo: 'AP', bg: 'rgba(0,90,156,.12)',   deepLink: 'apollo247://search?q=' + enc, playStore: 'https://play.google.com/store/apps/details?id=com.apollo247' },
      { name: 'Netmeds',    price: base + 8, logo: 'NM', bg: 'rgba(33,150,243,.12)', deepLink: 'netmeds://search?q=' + enc,  playStore: 'https://play.google.com/store/apps/details?id=com.netmeds.android' },
    ].sort((a, b) => a.price - b.price);
    addSavings(data[data.length - 1].price - data[0].price);
    setResults(data);
    setLoading(false);
  };

  const getShareText = () => {
    if (!results.length) return '';
    const best = results[0];
    const saved = results[results.length - 1].price - best.price;
    return 'NammaDeal: ' + lastQuery + ' cheapest on ' + best.name + ' at ₹' + best.price +
      '! Save ₹' + saved + ' vs most expensive. Compare pharma prices on NammaDeal app';
  };

  const recentChips = recent.pharma.map((r) => ({ label: r, value: r }));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>Rx</Text>
          <TextInput
            style={styles.input} placeholder="Search medicine e.g. Dolo 650..."
            placeholderTextColor="#55556A" value={query}
            onChangeText={setQuery} onSubmitEditing={() => search(query)}
          />
          <TouchableOpacity style={styles.goBtn} onPress={() => search(query)}>
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        {recentChips.length > 0 && <ChipRow chips={recentChips} onSelect={(v) => { setQuery(v); search(v); }} />}
        <ChipRow chips={PHARMA_CHIPS} onSelect={(v) => { setQuery(v); search(v); }} />

        {loading && <LoadingSpinner text={'Comparing "' + lastQuery + '" on 1mg, PharmEasy, Apollo, Netmeds...'} />}

        {!loading && results.length > 0 && (
          <>
            <SaveBar label="Best price saves you" savings={results[results.length - 1].price - results[0].price} />
            <View style={styles.shareRow}>
              <Text style={styles.resTitle}>Results for "{lastQuery}"</Text>
              <View style={styles.iconBtns}>
                <TouchableOpacity onPress={() => copyText(getShareText())} style={styles.iconBtn}>
                  <MaterialIcons name="content-copy" size={16} color="#A0A0B8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => shareWhatsApp(getShareText())} style={[styles.iconBtn, styles.waBtn]}>
                  <FontAwesome name="whatsapp" size={16} color="#25D366" />
                </TouchableOpacity>
              </View>
            </View>
            {results.map((item, i) => (
              <TouchableOpacity key={item.name} onPress={() => openApp(item.name, item.deepLink, item.playStore)} style={[styles.card, i === 0 && styles.bestCard]}>
                <View style={[styles.icon, { backgroundColor: item.bg }]}>
                  <Text style={styles.iconText}>{item.logo}</Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    {i === 0 && <View style={styles.bestTag}><Text style={styles.bestTagText}>CHEAPEST</Text></View>}
                  </View>
                  <Text style={styles.meta}>Strip of 10 - Home delivery</Text>
                </View>
                <View>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <Text style={styles.buy}>Buy</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080A' },
  content: { padding: 14, paddingBottom: 80 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 12, paddingHorizontal: 12, marginBottom: 10 },
  searchIcon: { fontSize: 11, color: '#55556A', marginRight: 8, fontFamily: 'SpaceGrotesk_700Bold' },
  input: { flex: 1, paddingVertical: 13, color: '#F0F0F5', fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular' },
  goBtn: { width: 32, height: 32, backgroundColor: '#F5A623', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  goBtnText: { color: '#000', fontWeight: '700', fontSize: 12, fontFamily: 'SpaceGrotesk_700Bold' },
  shareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  resTitle: { fontSize: 16, color: '#F0F0F5', fontFamily: 'BebasNeue_400Regular', letterSpacing: 0.5, flex: 1 },
  iconBtns: { flexDirection: 'row', gap: 6 },
  iconBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', alignItems: 'center', justifyContent: 'center' },
  waBtn: { borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.08)' },
  card: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 8 },
  bestCard: { borderColor: 'rgba(245,166,35,0.2)' },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 12, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  bestTag: { backgroundColor: 'rgba(245,166,35,0.12)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  bestTagText: { fontSize: 9, color: '#F5A623', fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  meta: { fontSize: 11, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular' },
  price: { fontSize: 22, color: '#F0F0F5', fontFamily: 'BebasNeue_400Regular', textAlign: 'right' },
  buy: { fontSize: 10, color: '#F5A623', textAlign: 'right', fontFamily: 'SpaceGrotesk_400Regular' },
});
