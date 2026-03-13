import React, { useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

export function SavingsBadge() {
  const totalSaved = useAppStore((s) => s.totalSaved);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (totalSaved > 0) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [totalSaved]);

  return (
    <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
      <Text style={styles.text}>Saved </Text>
      <Text style={styles.amount}>Rs {Math.round(totalSaved || 0)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  text: { fontSize: 11, fontWeight: '700', color: '#22C55E', fontFamily: 'SpaceGrotesk_700Bold' },
  amount: { fontSize: 14, color: '#22C55E', fontFamily: 'BebasNeue_400Regular', letterSpacing: 0.5 },
});
