import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { Colors, PlatformColors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useAppStore } from '../store/useAppStore';
import { GDB, GROCERY_CHIPS, GROCERY_EMOJIS } from '../data/groceryDB';
import { useDeepLink } from '../hooks/useDeepLink';
import { SaveBar } from '../components/common/SaveBar';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { GroceryProduct } from '../store/types';

type GMode = 'single' | 'basket';

export default function GroceryScreen() {
  const { basket, addToBasket, clearBasket, addRecent, recent, showToast, addSavings } = useAppStore();
  const { openApp } = useDeepLink();
  const [mode, setMode] = useState<GMode>('single');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroceryProduct[]>([]);
  const [savings, setSavings] = useState(0);
  const [ondcSource, setOndcSource] = useState(false);

  const BACKEND = 'http://10.0.2.2:3000'; // Android emulator localhost; change to ngrok URL for real device

  const search = async (q: string) => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) { showToast('Enter a product name'); return; }
    addRecent('grocery', trimmed);
    setLoading(true); setResults([]); setOndcSource(false);

    // ── Try ONDC backend ─────────────────────────────────────
    let ondcTxId: string | null = null;
    try {
      const resp = await Promise.race([
        fetch(`${BACKEND}/api/search`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmed, domain: 'grocery' }),
        }),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
      ]);
      const json = await (resp as Response).json();
      ondcTxId = json.transactionId || null;
    } catch { /* backend unreachable — use local DB */ }

    // ── Local DB fallback ────────────────────────────────────
    const { searchGDB } = require('../data/groceryDB');
    const local: GroceryProduct[] = searchGDB(trimmed);
    const fallback: GroceryProduct = {
      name: q, emoji: 'default',
      platforms: [
        { label: 'Zepto',     cls: 'zepto',     price: 49, size: '1pc', perUnit: '-', deepLink: 'zepto://search?q='     + encodeURIComponent(q), playStore: 'https://play.google.com/store/apps/details?id=com.zepto.app' },
        { label: 'Blinkit',   cls: 'blinkit',   price: 52, size: '1pc', perUnit: '-', deepLink: 'blinkit://search?q='   + encodeURIComponent(q), playStore: 'https://play.google.com/store/apps/details?id=com.blinkit.android' },
        { label: 'BigBasket', cls: 'bigbasket', price: 46, size: '1pc', perUnit: '-', deepLink: 'bigbasket://search?q=' + encodeURIComponent(q), playStore: 'https://play.google.com/store/apps/details?id=com.bigbasket' },
      ],
    };
    const base = local.length > 0 ? local : [fallback];

    // ── Poll ONDC results (up to 8s) ─────────────────────────
    if (ondcTxId) {
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 1600));
        try {
          const poll = await fetch(`${BACKEND}/api/results/${ondcTxId}`);
          const data = await poll.json();
          if (data.results?.length > 0) {
            const ondcPlatforms = data.results.slice(0, 5).map((item: any) => ({
              label: item.provider || 'ONDC',
              cls: 'ondc', price: item.price,
              size: item.unit || '1pc', perUnit: '-',
              deepLink: '', playStore: '',
            }));
            const merged = [{ ...base[0], platforms: [...ondcPlatforms, ...base[0].platforms] }, ...base.slice(1)];
            const allP = merged.flatMap(p => p.platforms.map(pl => pl.price));
            const save = Math.max(...allP) - Math.min(...allP);
            setSavings(save); addSavings(save);
            setResults(merged); setOndcSource(true); setLoading(false);
            return;
          }
        } catch { break; }
      }
    }

    // ── Show local estimates ──────────────────────────────────
    const allP = base.flatMap(p => p.platforms.map(pl => pl.price));
    const save = Math.max(...allP) - Math.min(...allP);
    setSavings(save); addSavings(save);
    setResults(base); setLoading(false);
  };


  // Basket totals by platform
  const basketTotals = React.useMemo(() => {
    const pm: Record<string, { t: number; dl: string; ps: string }> = {};
    basket.forEach(item => {
      item.platforms?.forEach(pl => {
        if (!pm[pl.label]) pm[pl.label] = { t: 0, dl: pl.deepLink, ps: pl.playStore };
        pm[pl.label].t += pl.price;
      });
    });
    return Object.entries(pm).map(([n, v]) => ({ n, ...v })).sort((a, b) => a.t - b.t);
  }, [basket]);

  const getEmoji = (key: string) => GROCERY_EMOJIS[key] || 'ðŸ›’';

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity style={[styles.modeBtn, mode === 'single' && styles.modeBtnActive]} onPress={() => setMode('single')}>
            <Text style={[styles.modeBtnText, mode === 'single' && styles.modeBtnTextActive]}>Single Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, mode === 'basket' && styles.modeBtnActive]} onPress={() => setMode('basket')}>
            <Text style={[styles.modeBtnText, mode === 'basket' && styles.modeBtnTextActive]}>Basket Builder</Text>
          </TouchableOpacity>
        </View>

        {/* Basket panel */}
        {mode === 'basket' && (
          <View style={styles.basketPanel}>
            <View style={styles.basketHeader}>
              <Text style={styles.basketTitle}>My Basket ({basket.length} items)</Text>
              {basket.length > 0 && (
                <TouchableOpacity onPress={() => { clearBasket(); showToast('Basket cleared'); }}>
                  <Text style={{ color: Colors.red, fontSize: 11, fontFamily: Fonts.semibold }}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
            {basket.length === 0 ? (
              <Text style={styles.basketEmpty}>Search and add items below</Text>
            ) : (
              <>
                {basket.map((item, i) => {
                  const bestP = Math.min(...(item.platforms?.map(p => p.price) || [0]));
                  return (
                    <View key={i} style={styles.basketItem}>
                      <Text style={styles.basketItemName}>{item.name}</Text>
                      <Text style={{ fontSize: 12, fontFamily: Fonts.bold, color: Colors.green }}>₹{bestP}</Text>
                    </View>
                  );
                })}
                {basketTotals.length > 0 && (
                  <View>
                    <Text style={styles.totalLbl}>Total by platform:</Text>
                    <View style={styles.totalsGrid}>
                      {basketTotals.slice(0, 3).map((x, i) => (
                        <TouchableOpacity key={x.n} style={[styles.totalCell, i === 0 && styles.totalCellBest]} onPress={() => openApp(x.n, x.dl, x.ps)}>
                          <Text style={styles.totalPlatName}>{x.n}</Text>
                          <Text style={[styles.totalAmt, i === 0 && { color: Colors.green }]}>₹{x.t}</Text>
                          {i === 0 && <Text style={styles.cheapestLbl}>CHEAPEST</Text>}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, color: Colors.muted }}>S</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search e.g. Milk, Eggs, Paneer..."
            placeholderTextColor={Colors.muted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => search(query)}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.goBtn} onPress={() => search(query)}>
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Recent */}
        {recent.grocery.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.recentLbl}>Recent</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {recent.grocery.map((r, i) => (
                <TouchableOpacity key={i} style={styles.recentChip} onPress={() => { setQuery(r); search(r); }}>
                  <Text style={styles.recentChipText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 14 }}>
          {GROCERY_CHIPS.map(chip => (
            <TouchableOpacity key={chip.key} style={styles.chip} onPress={() => { setQuery(chip.key); search(chip.key); }}>
              <Text style={styles.chipText}>{getEmoji(chip.key)} {chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingTxt}>Searching on Blinkit, Zepto, BigBasket...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <SaveBar savings={savings} label="Best savings found" />
            <View style={styles.resHeader}>
              <Text style={styles.resTitle}>Results for "{query}"</Text>
              <Text style={styles.resCnt}>{results.length} products</Text>
            </View>
            {/* Price disclaimer */}
            <View style={[styles.disclaimer, { borderColor: ondcSource ? Colors.green + '44' : Colors.border }]}>
              <Text style={styles.disclaimerTxt}>
                {ondcSource
                  ? '🟢 Live prices from ONDC network · Verify before purchase'
                  : '🕐 Price estimates · Updated periodically · Verify in app'}
              </Text>
            </View>
            <View style={styles.prodGrid}>
              {results.map((prod, pi) => {
                const sorted = [...prod.platforms].sort((a, b) => a.price - b.price);
                return (
                  <View key={pi} style={styles.prodCard}>
                    <View style={styles.prodImg}>
                      <Text style={{ fontSize: 46 }}>{getEmoji(Object.keys(GDB).find(k => prod.name.toLowerCase().includes(k)) || 'default')}</Text>
                    </View>
                    <Text style={styles.prodName}>{prod.name}</Text>
                    <View style={styles.platList}>
                      {sorted.map((pl, i) => {
                        const pc = PlatformColors[pl.cls] || { bg: Colors.card2, text: Colors.text };
                        return (
                          <TouchableOpacity key={i} style={styles.platRow} onPress={() => openApp(pl.label, pl.deepLink, pl.playStore)}>
                            {i === 0 && <Text style={styles.cheapestTag}>CHEAPEST</Text>}
                            <View style={{ flex: 1 }}>
                              <View style={[styles.platBadge, { backgroundColor: pc.bg }]}>
                                <Text style={[styles.platBadgeText, { color: pc.text }]}>{pl.label}</Text>
                              </View>
                              <Text style={styles.platSize}>{pl.size}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={styles.platPrice}>₹{pl.price}</Text>
                              <Text style={styles.platPer}>{pl.perUnit}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {mode === 'basket' && (
                      <TouchableOpacity
                        style={styles.addBasketBtn}
                        onPress={() => {
                          const inBasket = basket.find((b: any) => b.name === prod.name);
                          if (inBasket) { showToast('Already in basket!'); return; }
                          addToBasket({ name: prod.name, platforms: prod.platforms });
                          showToast(prod.name + ' added to basket');
                        }}
                      >
                        <Text style={styles.addBasketBtnText}>+ Add to Basket</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  modeToggle: { flexDirection: 'row', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 11, padding: 4, marginBottom: 12 },
  modeBtn: { flex: 1, padding: 7, borderRadius: 8, alignItems: 'center' },
  modeBtnActive: { backgroundColor: Colors.primaryDim },
  modeBtnText: { fontSize: 12, fontFamily: Fonts.semibold, color: Colors.muted2 },
  modeBtnTextActive: { color: Colors.primary },
  basketPanel: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 13, padding: 12, marginBottom: 12 },
  basketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  basketTitle: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.text },
  basketEmpty: { fontSize: 12, color: Colors.muted, textAlign: 'center', padding: 8, fontFamily: Fonts.body },
  basketItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  basketItemName: { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.body },
  totalLbl: { fontSize: 11, color: Colors.muted, marginTop: 8, marginBottom: 4, fontFamily: Fonts.body },
  totalsGrid: { flexDirection: 'row', gap: 5 },
  totalCell: { flex: 1, backgroundColor: Colors.card2, borderRadius: 8, padding: 7, alignItems: 'center' },
  totalCellBest: { borderWidth: 1, borderColor: Colors.borderGold },
  totalPlatName: { fontSize: 9, color: Colors.muted2, marginBottom: 3, fontFamily: Fonts.body },
  totalAmt: { fontFamily: Fonts.display, fontSize: 17, color: Colors.primary },
  cheapestLbl: { fontSize: 8, color: Colors.green, fontFamily: Fonts.bold },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, marginBottom: 10 },
  searchInput: { flex: 1, paddingVertical: 13, color: Colors.text, fontSize: 14, fontFamily: Fonts.body },
  goBtn: { width: 32, height: 32, backgroundColor: Colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  goBtnText: { fontSize: 12, fontFamily: Fonts.bold, color: '#000' },
  recentLbl: { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: Fonts.semibold },
  recentChip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.card2, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', borderRadius: 20 },
  recentChipText: { fontSize: 12, color: '#60a5fa', fontFamily: Fonts.medium },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  chipText: { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.medium },
  loadingWrap: { alignItems: 'center', padding: 40, gap: 12 },
  loadingTxt: { fontSize: 13, color: Colors.muted2, textAlign: 'center', fontFamily: Fonts.body },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  resTitle: { fontFamily: Fonts.display, fontSize: 16, color: Colors.text, letterSpacing: 0.5 },
  resCnt: { fontSize: 11, color: Colors.muted, fontFamily: Fonts.body },
  prodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  prodCard: { width: '47%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, overflow: 'hidden' },
  prodImg: { backgroundColor: Colors.card2, height: 100, alignItems: 'center', justifyContent: 'center' },
  prodName: { fontSize: 12, fontFamily: Fonts.semibold, padding: 7, lineHeight: 16, color: Colors.text },
  platList: { paddingHorizontal: 8, paddingBottom: 8, gap: 4 },
  platRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, paddingHorizontal: 7, borderRadius: 7, backgroundColor: Colors.card2, position: 'relative' },
  cheapestTag: { position: 'absolute', top: -6, left: '50%', backgroundColor: Colors.green, color: '#000', fontSize: 7, fontFamily: Fonts.bold, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3 },
  platBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  platBadgeText: { fontSize: 10, fontFamily: Fonts.bold },
  platSize: { fontSize: 9, color: Colors.muted, marginTop: 1, fontFamily: Fonts.body },
  platPrice: { fontFamily: Fonts.display, fontSize: 15, color: Colors.text },
  platPer: { fontSize: 8, color: Colors.muted, fontFamily: Fonts.body },
  addBasketBtn: { margin: 6, padding: 6, backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 7, alignItems: 'center' },
  addBasketBtnText: { fontSize: 11, fontFamily: Fonts.semibold, color: Colors.primary },
  disclaimer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 10 },
  disclaimerTxt: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body, flex: 1 },
});

