import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Chip { label: string; value: string; }
interface Props {
  chips: Chip[];
  selected?: string;
  onSelect: (value: string) => void;
}

export function ChipRow({ chips, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row} contentContainerStyle={styles.content}>
      {chips.map((chip) => {
        const active = chip.value === selected;
        return (
          <TouchableOpacity
            key={chip.value}
            onPress={() => onSelect(chip.value)}
            style={[styles.chip, active && styles.active]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{chip.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12 },
  content: { gap: 6, paddingBottom: 2 },
  chip: {
    flexShrink: 0, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#141418', borderWidth: 1, borderColor: '#1E1E26',
    borderRadius: 20,
  },
  active: { backgroundColor: 'rgba(245,166,35,0.12)', borderColor: 'rgba(245,166,35,0.2)' },
  label: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_600SemiBold' },
  activeLabel: { color: '#F5A623' },
});
