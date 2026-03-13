import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
}

export function CTAButton({ onPress, label, disabled, loading }: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[styles.btn, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%', padding: 14, backgroundColor: '#F5A623',
    borderRadius: 11, alignItems: 'center', marginBottom: 12,
  },
  disabled: { opacity: 0.4 },
  text: { color: '#000', fontSize: 15, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
});
