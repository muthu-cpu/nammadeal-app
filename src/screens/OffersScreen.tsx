import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { OFFERS } from '../data/offersData';
import { Offer } from '../store/types';
import { useClipboard } from '../hooks/useClipboard';

const CATEGORIES = [
  { label: 'All',     value: 'all' },
  { label: 'Rides',   value: 'rides' },
  { label: 'Grocery', value: 'grocery' },
  { label: 'Food',    value: 'food' },
  { label: 'Pharma',  value: 'pharma' },
  { label: 'Travels', value: 'travels' },
];

const CAT_COLORS: Record<string, string> = {
  rides: '#F5A623', grocery: '#22C55E', food: '#EF4444', pharma: '#3B82F6', travels: '#F5A623',
};

function OfferCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false);
  const { copyText } = useClipboard();

  const handleCopy = async () => {
    await copyText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.card, { borderTopColor: CAT_COLORS[offer.cat] || '#F5A623' }]}>
      <View style={styles.cardTop}>
        <View style={[styles.logo, { backgroundColor: offer.bg }]}>
          <Text style={styles.logoText}>{offer.logo}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.platform}>{offer.platform}</Text>
          <Text style={styles.desc}>{offer.desc}</Text>
        </View>
        <View style={styles.discCol}>
          <Text style={styles.disc}>{offer.disc}</Text>
          <Text style={styles.max}>{offer.max}</Text>
        </View>
      </View>
      <View style={styles.codeRow}>
        <View>
          <Text style={styles.code}>{offer.code}</Text>
          <Text style={styles.valid}>{offer.valid}</Text>
        </View>
        <TouchableOpacity onPress={handleCopy} style={[styles.copyBtn, copied && styles.copiedBtn]}>
          <Text style={styles.copyText}>{copied ? 'Done' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function OffersScreen() {
  const [selectedCat, setSelectedCat] = useState('all');
  const filtered = selectedCat === 'all' ? OFFERS : OFFERS.filter((o) => o.cat === selectedCat);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Active Offers & Promo Codes</Text>
        <Text style={styles.sub}>Tap code to copy instantly</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setSelectedCat(cat.value)}
              style={[styles.filterBtn, selectedCat === cat.value && styles.filterActive]}
            >
              <Text style={[styles.filterText, selectedCat === cat.value && styles.filterActiveText]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((offer, i) => <OfferCard key={i} offer={offer} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080A' },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 80 },
  title: { fontSize: 18, color: '#F0F0F5', fontFamily: 'BebasNeue_400Regular', letterSpacing: 0.5, marginBottom: 4 },
  sub: { fontSize: 12, color: '#7A7A95', marginBottom: 12, fontFamily: 'SpaceGrotesk_400Regular' },
  filterRow: { marginBottom: 14 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1E1E26', backgroundColor: '#141418', marginRight: 6 },
  filterActive: { backgroundColor: 'rgba(245,166,35,0.12)', borderColor: 'rgba(245,166,35,0.2)' },
  filterText: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular' },
  filterActiveText: { color: '#F5A623' },
  card: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 13, padding: 14, marginBottom: 8, borderTopWidth: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  logo: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 11, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  info: { flex: 1 },
  platform: { fontSize: 14, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 2 },
  desc: { fontSize: 12, color: '#7A7A95', lineHeight: 16, fontFamily: 'SpaceGrotesk_400Regular' },
  discCol: { alignItems: 'flex-end' },
  disc: { fontSize: 20, color: '#22C55E', fontFamily: 'BebasNeue_400Regular' },
  max: { fontSize: 10, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular' },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#141418', borderWidth: 1, borderColor: 'rgba(245,166,35,0.2)', borderStyle: 'dashed', borderRadius: 8, padding: 8, paddingHorizontal: 12 },
  code: { fontSize: 16, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 1 },
  valid: { fontSize: 10, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular' },
  copyBtn: { paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#F5A623', borderRadius: 6 },
  copiedBtn: { backgroundColor: '#22C55E' },
  copyText: { color: '#000', fontSize: 11, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
});
