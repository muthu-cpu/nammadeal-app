import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithPhoneNumber, signOut, updatePassword } from 'firebase/auth';
import { RecaptchaVerifierModal } from '../../components/auth/RecaptchaVerifierModal';
import { auth, firebaseConfig } from '../../config/firebase';

type Step = 'phone' | 'otp' | 'newPin';

export default function ForgotPinScreen({ navigation }: any) {
  const recaptchaVerifier = useRef<any>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [step, setStep] = useState<Step>('phone');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.length < 10) { Alert.alert('Enter a valid 10-digit number'); return; }
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, recaptchaVerifier.current!);
      setConfirmation(result);
      setStep('otp');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 6) { Alert.alert('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      setStep('newPin');
    } catch (e: any) {
      Alert.alert('Invalid OTP', 'Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPin = async () => {
    if (newPin.length !== 4) { Alert.alert('PIN must be 4 digits'); return; }
    if (newPin !== confirmPin) { Alert.alert('PINs do not match'); return; }
    setLoading(true);
    try {
      // Currently signed in via phone - update password then sign out so user logs in fresh
      const user = auth.currentUser;
      if (user) await updatePassword(user, newPin);
      await signOut(auth);
      Alert.alert('Success', 'PIN reset! Please login with your new PIN.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not reset PIN');
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

        {step === 'phone' && (
          <>
            <Text style={styles.title}>Reset PIN</Text>
            <Text style={styles.sub}>We'll send an OTP to verify your phone</Text>
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
            <TouchableOpacity onPress={sendOtp} disabled={loading} style={[styles.btn, loading && styles.btnDisabled]}>
              <Text style={styles.btnText}>{loading ? 'Sending…' : 'Send OTP'}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'otp' && (
          <>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.sub}>Sent to +91 {phone}</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="6-digit OTP"
              placeholderTextColor="#55556A"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity onPress={verifyOtp} disabled={loading} style={[styles.btn, loading && styles.btnDisabled]}>
              <Text style={styles.btnText}>{loading ? 'Verifying…' : 'Verify OTP'}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'newPin' && (
          <>
            <Text style={styles.title}>Set New PIN</Text>
            <Text style={styles.sub}>Choose a new 4-digit PIN</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="New 4-digit PIN"
              placeholderTextColor="#55556A"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={newPin}
              onChangeText={setNewPin}
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
            <TouchableOpacity onPress={resetPin} disabled={loading} style={[styles.btn, loading && styles.btnDisabled]}>
              <Text style={styles.btnText}>{loading ? 'Saving…' : 'Reset PIN'}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
          <Text style={styles.linkText}>← Back to Login</Text>
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
  link: { alignItems: 'center', marginTop: 12 },
  linkText: { color: '#F5A623', fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular' },
});
