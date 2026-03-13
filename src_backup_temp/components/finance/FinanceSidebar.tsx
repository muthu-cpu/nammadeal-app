import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useAppStore } from '../../store/useAppStore';
import { FIN_DATA, FIN_LABELS, FIN_CATEGORIES } from '../../data/financeData';
import { FinCard } from './FinCard';

const SCREEN_W = Dimensions.get('window').width;

export function FinanceSidebar() {
  const { financeOpen, closeFinance } = useAppStore();
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(SCREEN_W)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string>('loans');

  useEffect(() => {
    if (financeOpen) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, { toValue: SCREEN_W, duration: 280, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [financeOpen]);

  if (!visible) return null;

  const products = FIN_DATA[activeCategory] || [];

  return (
    <>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeFinance} />
      </Animated.View>
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }], paddingTop: insets.top + 14 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Finance</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={closeFinance}>
            <Text style={styles.closeTxt}>X</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={{ gap: 6 }}>
            {FIN_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, activeCategory === cat.key && styles.chipActive]}
                onPress={() => setActiveCategory(cat.key)}
              >
                <Text style={[styles.chipText, activeCategory === cat.key && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.resHeader}>
            <Text style={styles.resTitle}>{FIN_LABELS[activeCategory]}</Text>
            <Text style={styles.resCnt}>{products.length} options</Text>
          </View>
          {products.map((item, i) => (
            <FinCard key={i} item={item} isBest={i === 0} />
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300 },
  sidebar: {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: SCREEN_W * 0.88, maxWidth: 380,
    backgroundColor: Colors.sidebar, zIndex: 301,
    borderLeftWidth: 1, borderLeftColor: Colors.border,
    flexDirection: 'column',
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { flex: 1, fontFamily: Fonts.display, fontSize: 22, color: Colors.primary, letterSpacing: 1 },
  closeBtn: { width: 34, height: 34, borderRadius: 9, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 14, color: Colors.muted2, fontFamily: Fonts.semibold },
  body: { flex: 1, padding: 14 },
  chipRow: { marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card2 },
  chipActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.borderGold },
  chipText: { fontSize: 12, fontFamily: Fonts.semibold, color: Colors.muted2 },
  chipTextActive: { color: Colors.primary },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  resTitle: { fontFamily: Fonts.display, fontSize: 16, color: Colors.text, letterSpacing: 0.5 },
  resCnt: { fontSize: 11, color: Colors.muted, fontFamily: Fonts.body },
});
