import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SaveBar } from '../components/common/SaveBar';
import { SortRow } from '../components/common/SortRow';
import { ChipRow } from '../components/common/ChipRow';
import { useDeepLink } from '../hooks/useDeepLink';
import { useClipboard } from '../hooks/useClipboard';
import { FoodOption } from '../store/types';

const FOOD_CHIPS = [
  { label: 'Biryani', value: 'Biryani' }, { label: 'Pizza', value: 'Pizza' },
  { label: 'Dosa', value: 'Dosa' }, { label: 'Burger', value: 'Burger' },
  { label: 'Thali', value: 'Thali' }, { label: 'Idli', value: 'Idli' },
  { label: 'Noodles', value: 'Noodles' },
];

export function FoodScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FoodOption[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const { addSavings, addRecent, recent, showToast } = useAppStore();
  const { openApp } = useDeepLink();
  const { copyText, shareWhatsApp } = useClipboard();

  const search = async (q: string) => {
    if (!q.trim()) { showToast('Enter a dish name'); return; }
    setLoading(true);
    setLastQuery(q);
    addRecent('food', q);
    await new Promise((r) => setTimeout(r, 1600));
    const base = Math.floor(Math.random() * 80) + 120;
    const enc = encodeURIComponent(q);
    const data: FoodOption[] = [
      { name: 'Zomato', price: base,      delivery: 30, eta: 28, rating: 4.2, emoji: 'Z', bg: 'rgba(239,68,68,.12)',    deepLink: 'zomato://search?q=' + enc, playStore: 'https://play.google.com/store/apps/details?id=com.application.zomato' },
      { name: 'Swiggy', price: base + 10, delivery: 25, eta: 32, rating: 4.1, emoji: 'S', bg: 'rgba(251,146,60,.12)',   deepLink: 'swiggy://search?q=' + enc, playStore: 'https://play.google.com/store/apps/details?id=in.swiggy.android' },
    ];
    const savings = Math.abs((data[0].price + data[0].delivery) - (data[1].price + data[1].delivery));
    addSavings(savings);
    setResults(data);
    setLoading(false);
  };

  const sorted = [...results].sort((a, b) =>
    sortBy === 'rating' ? b.rating - a.rating : (a.price + a.delivery) - (b.price + b.delivery)
  );

  const getShareText = () => {
    if (!sorted.length) return '';
    const best = sorted[0];
    const total = best.price + best.delivery;
    return 'NammaDeal: ' + lastQuery + ' cheapest on ' + best.name + ' at ₹' + total +
      ' (food ₹' + best.price + ' + del ₹' + best.delivery + '). Compare food prices on NammaDeal app';
  };

  const recentChips = recent.food.map((r) => ({ label: r, value: r }));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>F</Text>
          <TextInput
            style={styles.input} placeholder="Search dish e.g. Biryani, Dosa..."
            placeholderTextColor="#55556A" value={query}
            onChangeText={setQuery} onSubmitEditing={() => search(query)}
          />
          <TouchableOpacity style={styles.goBtn} onPress={() => search(query)}>
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        {recentChips.length > 0 && (
          <ChipRow chips={recentChips} onSelect={(v) => { setQuery(v); search(v); }} />
        )}

        <ChipRow chips={FOOD_CHIPS} onSelect={(v) => { setQuery(v); search(v); }} />

        {loading && <LoadingSpinner text={'Finding "' + lastQuery + '" on Swiggy and Zomato...'} />}

        {!loading && results.length > 0 && (
          <>
            <SaveBar label="Save incl. delivery" savings={Math.abs((sorted[0].price + sorted[0].delivery) - (sorted[sorted.length - 1].price + sorted[sorted.length - 1].delivery))} />
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
            <SortRow
              options={[{ label: 'Price', value: 'price' }, { label: 'Rating', value: 'rating' }]}
              selected={sortBy} onSelect={(v) => setSortBy(v as any)}
            />
            {sorted.map((item, i) => {
              const total = item.price + item.delivery;
              const best = i === 0;
              return (
                <TouchableOpacity key={item.name} onPress={() => openApp(item.name, item.deepLink, item.playStore)} style={[styles.card, best && styles.bestCard]}>
                  <View style={[styles.icon, { backgroundColor: item.bg }]}>
                    <Text style={styles.iconText}>{item.emoji}</Text>
                  </View>
                  <View style={styles.info}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{item.name}</Text>
                      {best && <View style={styles.bestTag}><Text style={styles.bestTagText}>{sortBy === 'rating' ? 'TOP RATED' : 'CHEAPEST'}</Text></View>}
                    </View>
                    <Text style={styles.meta}>Food ₹{item.price} + Del ₹{item.delivery} - {item.eta} mins - {item.rating} stars</Text>
                  </View>
                  <View>
                    <Text style={styles.price}>₹{total}</Text>
                    <Text style={styles.order}>Order</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
  searchIcon: { fontSize: 14, color: '#55556A', marginRight: 8, fontFamily: 'SpaceGrotesk_700Bold' },
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
  iconText: { fontSize: 14, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  bestTag: { backgroundColor: 'rgba(245,166,35,0.12)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  bestTagText: { fontSize: 9, color: '#F5A623', fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  meta: { fontSize: 11, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular' },
  price: { fontSize: 22, color: '#F0F0F5', fontFamily: 'BebasNeue_400Regular', textAlign: 'right' },
  order: { fontSize: 10, color: '#F5A623', textAlign: 'right', fontFamily: 'SpaceGrotesk_400Regular' },
});
