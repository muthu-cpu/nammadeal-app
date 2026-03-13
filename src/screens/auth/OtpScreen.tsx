import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../store/useAppStore';

export function OtpScreen({ navigation, route }: any) {
  const { confirmation, phone, mode, signupData } = route.params;
  const { setUser } = useAppStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) { Alert.alert('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const result = await confirmation.confirm(otp);
      const user = result.user;

      if (mode === 'signup' && signupData) {
        const profile = {
          uid: user.uid,
          phone,
          name: signupData.name,
          gender: signupData.gender,
          age: signupData.age,
          createdAt: new Date().toISOString(),
          totalSaved: 0,
          recentSearches: [],
        };
        await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
        setUser(user.uid, phone, signupData.name);
      } else {
        const existing = await AsyncStorage.getItem('@user_profile');
        let profile: any = existing ? JSON.parse(existing) : null;
        if (!profile) {
          profile = { uid: user.uid, phone, createdAt: new Date().toISOString(), totalSaved: 0, recentSearches: [] };
          await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
        }
        setUser(user.uid, phone, profile.name || null);
      }
    } catch (e: any) {
      Alert.alert('Invalid OTP', 'The code you entered is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>NammaDeal</Text>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.sub}>Enter the 6-digit code sent to +91 {phone}</Text>
        <TextInput
          style={styles.input}
          placeholder="------"
          placeholderTextColor="#55556A"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          textAlign="center"
        />
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading || otp.length < 6}
          style={[styles.btn, (loading || otp.length < 6) && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>{loading ? 'Verifying...' : 'Verify and Continue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.resend}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  back: { position: 'absolute', top: 20, left: 0 },
  backText: { color: '#F5A623', fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular' },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 32, textAlign: 'center' },
  title: { fontSize: 22, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 8 },
  sub: { fontSize: 14, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 32, lineHeight: 20 },
  input: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, padding: 16, color: '#F0F0F5', fontSize: 28, fontFamily: 'BebasNeue_400Regular', marginBottom: 20, letterSpacing: 8 },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  resend: { color: '#F5A623', fontSize: 14, textAlign: 'center', fontFamily: 'SpaceGrotesk_400Regular' },
});
