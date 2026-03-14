import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithPhoneNumber } from 'firebase/auth';
import { RecaptchaVerifierModal } from '../../components/auth/RecaptchaVerifierModal';
import { auth, firebaseConfig } from '../../config/firebase';

export function PhoneScreen({ navigation }: any) {
  const recaptchaVerifier = useRef<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = name.trim().length > 0;
  const canSend = phone.length === 10 && (!isSignup || name.trim().length >= 2);

  const handleSend = async () => {
    if (phone.length < 10) { Alert.alert('Enter a valid 10-digit phone number'); return; }
    if (isSignup && name.trim().length < 2) { Alert.alert('Enter your full name (at least 2 characters)'); return; }
    setLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, recaptchaVerifier.current!);
      navigation.navigate('Otp', {
        confirmation,
        phone,
        mode: isSignup ? 'signup' : 'login',
        signupData: isSignup ? { name: name.trim(), gender: '', age: '' } : undefined,
      });
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>NammaDeal</Text>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.sub}>
            New user? Enter your name + number.{'\n'}Returning user? Just enter your number.
          </Text>

          {/* Name field */}
          <Text style={styles.label}>
            Full Name <Text style={styles.labelHint}>(new users only)</Text>
          </Text>
          <TextInput
            style={styles.inputSingle}
            placeholder="Enter your name"
            placeholderTextColor="#55556A"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          {/* Phone field */}
          <Text style={styles.label}>Mobile Number</Text>
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
            disabled={loading || !canSend}
            style={[styles.btn, (loading || !canSend) && styles.btnDisabled]}
          >
            <Text style={styles.btnText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>By continuing, you agree to our Terms of Service</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 32, textAlign: 'center' },
  title: { fontSize: 26, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 8 },
  sub: { fontSize: 13, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 28, lineHeight: 20 },
  label: { fontSize: 13, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 8 },
  labelHint: { color: '#55556A', fontSize: 12 },
  inputSingle: {
    backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26',
    borderRadius: 11, paddingHorizontal: 14, paddingVertical: 13,
    color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular',
    marginBottom: 20,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26',
    borderRadius: 11, overflow: 'hidden', marginBottom: 24,
  },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  hint: { fontSize: 12, color: '#55556A', textAlign: 'center', fontFamily: 'SpaceGrotesk_400Regular' },
});
