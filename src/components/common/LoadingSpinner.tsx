import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, Text, StyleSheet } from 'react-native';

interface Props { text?: string; }

export function LoadingSpinner({ text }: Props) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 40, gap: 12 },
  spinner: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 3, borderColor: '#1E1E26', borderTopColor: '#F5A623',
  },
  text: { fontSize: 13, color: '#7A7A95', textAlign: 'center', lineHeight: 20, fontFamily: 'SpaceGrotesk_400Regular' },
});
