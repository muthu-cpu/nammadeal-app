import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SortOption { label: string; value: string; }
interface Props {
  options: SortOption[];
  selected: string;
  onSelect: (v: string) => void;
}

export function SortRow({ options, selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sort:</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          style={[styles.btn, selected === opt.value && styles.active]}
        >
          <Text style={[styles.btnText, selected === opt.value && styles.activeText]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  label: { fontSize: 11, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular' },
  btn: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    borderWidth: 1, borderColor: '#1E1E26', backgroundColor: '#141418',
  },
  active: { backgroundColor: 'rgba(245,166,35,0.12)', borderColor: 'rgba(245,166,35,0.2)' },
  btnText: { fontSize: 11, fontWeight: '600', color: '#7A7A95', fontFamily: 'SpaceGrotesk_600SemiBold' },
  activeText: { color: '#F5A623' },
});
