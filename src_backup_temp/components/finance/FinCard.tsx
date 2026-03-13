import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { FinanceProduct } from '../../store/types';
import { useDeepLink } from '../../hooks/useDeepLink';

interface Props {
  item: FinanceProduct;
  isBest: boolean;
}

export function FinCard({ item, isBest }: Props) {
  const { openApp } = useDeepLink();
  return (
    <TouchableOpacity
      style={[styles.card, isBest && styles.bestCard]}
      onPress={() => openApp(item.name, item.deepLink, item.playStore)}
      activeOpacity={0.8}
    >
      <View style={styles.top}>
        <View style={[styles.ico, { backgroundColor: item.bg }]}>
          <Text style={styles.icoText}>{item.logo}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {isBest && <View style={styles.bestTag}><Text style={styles.bestTagText}>BEST</Text></View>}
          </View>
          <Text style={styles.meta}>{item.meta}</Text>
        </View>
        <View style={styles.rateCol}>
          <Text style={styles.rate}>{item.rate}</Text>
          <Text style={styles.pa}>p.a.</Text>
        </View>
      </View>
      <View style={styles.tagRow}>
        {item.tags.map((tag, i) => (
          <View key={i} style={[styles.tag, i === 0 && styles.tagGreen]}>
            <Text style={[styles.tagText, i === 0 && styles.tagTextGreen]}>{tag}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() => openApp(item.name, item.deepLink, item.playStore)}
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 13, marginBottom: 8 },
  bestCard: { borderColor: Colors.borderGold },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  ico: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icoText: { fontSize: 18 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.text },
  bestTag: { backgroundColor: Colors.primaryDim, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  bestTagText: { fontSize: 9, color: Colors.primary, fontFamily: Fonts.bold },
  meta: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body },
  rateCol: { alignItems: 'flex-end', flexShrink: 0 },
  rate: { fontSize: 20, fontFamily: Fonts.display, color: Colors.green },
  pa: { fontSize: 10, color: Colors.muted, fontFamily: Fonts.body },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 8 },
  tag: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagGreen: { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' },
  tagText: { fontSize: 11, color: Colors.muted2, fontFamily: Fonts.body },
  tagTextGreen: { color: Colors.green },
  applyBtn: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  applyText: { fontSize: 12, fontFamily: Fonts.bold, color: '#000' },
});
