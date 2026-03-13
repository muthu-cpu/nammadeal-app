import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

export function Toast() {
  const { toastMsg, toastVisible } = useAppStore();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastVisible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [toastVisible, toastMsg]);

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>{toastMsg}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#1E1E26',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    zIndex: 9999,
  },
  text: {
    color: '#F0F0F5',
    fontSize: 13,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
});
