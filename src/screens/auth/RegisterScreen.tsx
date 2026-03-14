import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function RegisterScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (phone.length < 10) { Alert.alert('Enter a valid 10-digit number'); return; }
    if (pin.length !== 4) { Alert.alert('PIN must be exactly 4 digits'); return; }
    if (pin !== confirmPin) { Alert.alert('PINs do not match'); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, `${phone}@nammadeal.app`, pin);
      // Auth state change will navigate automatically
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('Already registered', 'This number already has an account. Please login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', e.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.logo}>NammaDeal</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.sub}>Enter your phone number and set a 4-digit PIN</Text>

        <View style={styles.inputWrap}>
          <View style={styles.prefix}><Text style={styles.prefixText}>+91</Text></View>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#55556A"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TextInput
          style={styles.pinInput}
          placeholder="Create 4-digit PIN"
          placeholderTextColor="#55556A"
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          value={pin}
          onChangeText={setPin}
        />

        <TextInput
          style={styles.pinInput}
          placeholder="Confirm PIN"
          placeholderTextColor="#55556A"
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          value={confirmPin}
          onChangeText={setConfirmPin}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={[styles.btn, loading && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>{loading ? 'Creating…' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
          <Text style={styles.linkText}>Already have account? <Text style={styles.linkHighlight}>Login</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 32, textAlign: 'center' },
  title: { fontSize: 22, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 8 },
  sub: { fontSize: 14, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 32, lineHeight: 20 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26',
    borderRadius: 11, overflow: 'hidden', marginBottom: 12,
  },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  pinInput: {
    backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26',
    borderRadius: 11, paddingHorizontal: 14, paddingVertical: 13,
    color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular',
    marginBottom: 12, letterSpacing: 8, textAlign: 'center',
  },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16, marginTop: 8 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#55556A', fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular' },
  linkHighlight: { color: '#F5A623' },
});
