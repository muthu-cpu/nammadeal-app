import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithPhoneNumber, signOut, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecaptchaVerifierModal } from '../../components/auth/RecaptchaVerifierModal';
import { auth, firebaseConfig } from '../../config/firebase';

type Step = 'phone' | 'otp' | 'done';

export default function ForgotPinScreen({ navigation }: any) {
  const recaptchaVerifier = useRef<any>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [step, setStep] = useState<Step>('phone');
  const [loading, setLoading] = useState(false);

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    return user.slice(0, 2) + '***@' + domain;
  };

  const sendOtp = async () => {
    if (phone.length < 10) { Alert.alert('Enter a valid 10-digit number'); return; }
    const email = await AsyncStorage.getItem('@phone_' + phone);
    if (!email) {
      Alert.alert('Not Found', 'No account registered with this phone number.');
      return;
    }
    setMaskedEmail(maskEmail(email));
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, '+91' + phone, recaptchaVerifier.current!);
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
      const email = await AsyncStorage.getItem('@phone_' + phone);
      if (email) {
        await signOut(auth);
        await sendPasswordResetEmail(auth, email);
      }
      setStep('done');
    } catch (e: any) {
      Alert.alert('Invalid OTP', 'Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <RecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.logo}>NammaDeal</Text>

        {step === 'phone' && (
          <>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.sub}>Enter your registered mobile number. We will verify via OTP then send a reset link to your email.</Text>
            <View style={styles.inputWrap}>
              <View style={styles.prefix}><Text style={styles.prefixText}>+91</Text></View>
              <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#55556A" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
            </View>
            <TouchableOpacity onPress={sendOtp} disabled={loading || phone.length < 10} style={[styles.btn, (loading || phone.length < 10) && styles.btnDisabled]}>
              <Text style={styles.btnText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'otp' && (
          <>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.sub}>Code sent to +91 {phone}</Text>
            <TextInput style={styles.otpInput} placeholder="6-digit OTP" placeholderTextColor="#55556A" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} textAlign="center" />
            <TouchableOpacity onPress={verifyOtp} disabled={loading || otp.length < 6} style={[styles.btn, (loading || otp.length < 6) && styles.btnDisabled]}>
              <Text style={styles.btnText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'done' && (
          <>
            <Text style={styles.successIcon}>Email Sent!</Text>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.sub}>
              {'A password reset link has been sent to\n'}
              <Text style={styles.emailHighlight}>{maskedEmail}</Text>
              {'\n\nOpen your email, click the reset link, set your new password, then return here to login.'}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.btnText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}

        {step !== 'done' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 32, textAlign: 'center' },
  title: { fontSize: 22, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 8 },
  sub: { fontSize: 14, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 28, lineHeight: 22 },
  successIcon: { fontSize: 22, color: '#22C55E', fontFamily: 'SpaceGrotesk_700Bold', textAlign: 'center', marginBottom: 16 },
  emailHighlight: { color: '#F5A623', fontFamily: 'SpaceGrotesk_700Bold' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, overflow: 'hidden', marginBottom: 16 },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  otpInput: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 16, color: '#F0F0F5', fontSize: 28, fontFamily: 'BebasNeue_400Regular', marginBottom: 16, letterSpacing: 10 },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  link: { alignItems: 'center', marginTop: 12 },
  linkText: { color: '#F5A623', fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular' },
});
