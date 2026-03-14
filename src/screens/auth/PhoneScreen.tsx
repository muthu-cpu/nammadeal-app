import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithPhoneNumber } from 'firebase/auth';
import { RecaptchaVerifierModal } from '../../components/auth/RecaptchaVerifierModal';
import { auth, firebaseConfig } from '../../config/firebase';

export function PhoneScreen({ navigation }: any) {
  const recaptchaVerifier = useRef<any>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (phone.length < 10) { Alert.alert('Enter a valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, recaptchaVerifier.current!);
      navigation.navigate('Otp', { confirmation, phone });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <RecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.logo}>NammaDeal</Text>
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.sub}>We will send a 6-digit OTP to verify your number</Text>

        <View style={styles.inputWrap}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
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

        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || phone.length < 10}
          style={[styles.btn, (loading || phone.length < 10) && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>By continuing, you agree to our Terms of Service</Text>
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
    borderRadius: 11, overflow: 'hidden', marginBottom: 20,
  },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  hint: { fontSize: 12, color: '#55556A', textAlign: 'center', fontFamily: 'SpaceGrotesk_400Regular' },
});
