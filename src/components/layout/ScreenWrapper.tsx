import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

interface Props { children: React.ReactNode; style?: ViewStyle; }

export function ScreenWrapper({ children, style }: Props) {
  return (
    <SafeAreaView style={[styles.safe, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
});
