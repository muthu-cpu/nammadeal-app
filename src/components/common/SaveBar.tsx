import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { label: string; savings: number; }

export function SaveBar({ label, savings }: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>₹{savings}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)', borderRadius: 11,
    padding: 10, paddingHorizontal: 14, marginBottom: 10,
  },
  label: { fontSize: 12, color: '#22C55E', fontWeight: '500', fontFamily: 'SpaceGrotesk_500Medium' },
  amount: { fontSize: 22, color: '#22C55E', fontFamily: 'BebasNeue_400Regular', letterSpacing: 0.5 },
});
