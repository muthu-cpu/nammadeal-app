import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.logo}><Text style={styles.logoA}>Namma</Text><Text style={styles.logoB}>Deal</Text></Text>
          <Text style={styles.tagline}>Compare Rides · Grocery · Food</Text>
          <Text style={styles.tagline2}>Pharma · Travel · Fuel</Text>
        </View>

        <View style={styles.cards}>
          <View style={styles.card}><Text style={styles.cardIcon}>🚗</Text></View>
          <View style={styles.card}><Text style={styles.cardIcon}>🛒</Text></View>
          <View style={styles.card}><Text style={styles.cardIcon}>🍕</Text></View>
          <View style={styles.card}><Text style={styles.cardIcon}>💊</Text></View>
        </View>

        <Text style={styles.subtitle}>Get the best deals across all your favorite apps in one place</Text>

        <View style={styles.btns}>
          <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Phone')}>
            <Text style={styles.loginText}>Login with OTP</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>By continuing you agree to our Terms of Service</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 32 },
  top: { alignItems: 'center', marginTop: 20 },
  logo: { textAlign: 'center', marginBottom: 8 },
  logoA: { color: '#F5A623', fontSize: 52, fontFamily: 'BebasNeue_400Regular', letterSpacing: 2 },
  logoB: { color: '#F0F0F5', fontSize: 52, fontFamily: 'BebasNeue_400Regular', letterSpacing: 2 },
  tagline: { color: '#7A7A95', fontSize: 13, fontFamily: 'SpaceGrotesk_500Medium', textAlign: 'center', letterSpacing: 0.5 },
  tagline2: { color: '#55556A', fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular', marginTop: 2 },
  cards: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 16 },
  card: { width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(245,166,35,0.08)', borderWidth: 1, borderColor: 'rgba(245,166,35,0.15)', alignItems: 'center', justifyContent: 'center' },
  cardIcon: { fontSize: 28 },
  subtitle: { color: '#55556A', fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular', textAlign: 'center', lineHeight: 22 },
  btns: { gap: 12 },
  signupBtn: { backgroundColor: '#F5A623', borderRadius: 14, padding: 16, alignItems: 'center' },
  signupText: { color: '#000', fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold' },
  loginBtn: { backgroundColor: 'transparent', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1E1E26' },
  loginText: { color: '#F0F0F5', fontSize: 16, fontFamily: 'SpaceGrotesk_600SemiBold' },
  terms: { color: '#55556A', fontSize: 11, textAlign: 'center', fontFamily: 'SpaceGrotesk_400Regular' },
});
