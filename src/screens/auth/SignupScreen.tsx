import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithPhoneNumber } from 'firebase/auth';
import { RecaptchaVerifierModal } from '../../components/auth/RecaptchaVerifierModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firebaseConfig } from '../../config/firebase';

const GENDERS = ['Male', 'Female', 'Other'] as const;
type Gender = typeof GENDERS[number];

export function SignupScreen({ navigation }: any) {
  const recaptchaVerifier = useRef<any>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid =
    name.trim().length >= 2 &&
    gender !== null &&
    age.length >= 1 &&
    parseInt(age) >= 10 &&
    parseInt(age) <= 120 &&
    phone.length === 10;

  const handleSignup = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const existing = await AsyncStorage.getItem('@user_profile');
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.phone === phone) {
          Alert.alert(
            'Already Registered',
            'This number is linked to an existing account. Please login instead.',
            [
              { text: 'Go to Login', onPress: () => navigation.navigate('Phone') },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
          setLoading(false);
          return;
        }
      }
      const confirmation = await signInWithPhoneNumber(auth, '+91' + phone, recaptchaVerifier.current!);
      navigation.navigate('Otp', {
        confirmation,
        phone,
        mode: 'signup',
        signupData: { name: name.trim(), gender, age: parseInt(age) },
      });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <RecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>NammaDeal</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.sub}>Fill in your details to get started</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#55556A" value={name} onChangeText={setName} autoCapitalize="words" />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => (
              <TouchableOpacity key={g} style={[styles.genderBtn, gender === g && styles.genderBtnActive]} onPress={() => setGender(g)}>
                <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} placeholder="Your age" placeholderTextColor="#55556A" keyboardType="number-pad" maxLength={3} value={age} onChangeText={setAge} />

          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputWrap}>
            <View style={styles.prefix}><Text style={styles.prefixText}>+91</Text></View>
            <TextInput style={styles.phoneInput} placeholder="10-digit mobile number" placeholderTextColor="#55556A" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>

          <TouchableOpacity onPress={handleSignup} disabled={loading || !isValid} style={[styles.btn, (loading || !isValid) && styles.btnDisabled]}>
            <Text style={styles.btnText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Phone')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 24, textAlign: 'center' },
  title: { fontSize: 24, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 6 },
  sub: { fontSize: 14, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 28, lineHeight: 20 },
  label: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 16 },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  genderBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', alignItems: 'center' },
  genderBtnActive: { backgroundColor: 'rgba(245,166,35,0.12)', borderColor: '#F5A623' },
  genderText: { color: '#7A7A95', fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium' },
  genderTextActive: { color: '#F5A623', fontFamily: 'SpaceGrotesk_700Bold' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, overflow: 'hidden', marginBottom: 24 },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginHint: { fontSize: 13, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular' },
  loginLink: { fontSize: 13, color: '#F5A623', fontFamily: 'SpaceGrotesk_700Bold' },
});
