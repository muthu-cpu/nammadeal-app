import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SavingsBadge } from '../common/SavingsBadge';
import { useSubscription } from '../../hooks/useSubscription';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { status, daysLeft } = useSubscription();

  const badge =
    status === 'free_launch' ? { label: '🎁 Free till Jun 1', color: '#22C55E' } :
    status === 'trial'       ? { label: `🎁 ${daysLeft}d trial`, color: '#22C55E' } :
    status === 'active'      ? { label: '✓ Pro', color: '#F5A623' } :
    null;

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.logo}>
        <Text style={styles.logoAccent}>Namma</Text>
        <Text style={styles.logoDeal}>Deal</Text>
      </Text>
      <View style={styles.right}>
        {badge && (
          <View style={[styles.trialBadge, { borderColor: badge.color + '55', backgroundColor: badge.color + '18' }]}>
            <Text style={[styles.trialTxt, { color: badge.color }]}>{badge.label}</Text>
          </View>
        )}
        <SavingsBadge />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16, paddingBottom: 10,
    backgroundColor: '#08080A',
    borderBottomWidth: 1, borderBottomColor: 'rgba(245,166,35,0.2)',
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  logo:        { flex: 1 },
  logoAccent:  { color: '#F5A623', fontSize: 24, fontFamily: 'BebasNeue_400Regular', letterSpacing: 1.5 },
  logoDeal:    { color: '#F0F0F5', fontSize: 24, fontFamily: 'BebasNeue_400Regular', letterSpacing: 1.5 },
  right:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trialBadge:  { backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4 },
  trialTxt:    { fontSize: 11, color: '#22C55E', fontFamily: 'SpaceGrotesk_600SemiBold' },
});
