import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/firebase';
import { useAppStore } from '../../store/useAppStore';

WebBrowser.maybeCompleteAuthSession();

// TODO: Replace with real Google OAuth Client IDs from Google Cloud Console
const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';

export default function RegisterScreen({ navigation }: any) {
  const { setUser } = useAppStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignUp(id_token);
    }
  }, [response]);

  const handleGoogleSignUp = async (idToken: string) => {
    setLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      const profile = {
        uid: user.uid,
        name: user.displayName || 'User',
        age: '',
        phone: '',
        email: user.email || '',
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        totalSaved: 0,
        recentSearches: [],
      };
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
      setUser(user.uid, '', user.displayName || '');
    } catch (e: any) {
      Alert.alert('Google Sign-Up Failed', e.message || 'Could not sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (name.trim().length < 2) { Alert.alert('Enter your full name'); return false; }
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) { Alert.alert('Enter a valid age (1-120)'); return false; }
    if (phone.length !== 10) { Alert.alert('Enter a valid 10-digit phone number'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { Alert.alert('Enter a valid email address'); return false; }
    if (password.length < 6) { Alert.alert('Password must be at least 6 characters'); return false; }
    if (password !== confirmPassword) { Alert.alert('Passwords do not match'); return false; }
    if (!agreed) { Alert.alert('Please agree to the Terms & Privacy Policy'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = result.user;
      const profile = {
        uid: user.uid,
        name: name.trim(),
        age: age.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        authProvider: 'email',
        createdAt: new Date().toISOString(),
        totalSaved: 0,
        recentSearches: [],
      };
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
      await AsyncStorage.setItem('@phone_' + phone.trim(), email.trim().toLowerCase());
      setUser(user.uid, phone.trim(), name.trim());
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('Email Already Registered', 'This email has an account. Please login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', e.message || 'Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const passStrength = password.length === 0 ? 'none' : password.length < 6 ? 'weak' : password.length < 10 ? 'good' : 'strong';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>NammaDeal</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.sub}>Save more on every ride, grocery and more</Text>

          <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync()} disabled={loading || !request}>
            <Text style={styles.googleBtnText}>G  Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divTxt}>OR SIGN UP WITH EMAIL</Text>
            <View style={styles.divLine} />
          </View>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.inputSingle} placeholder="Enter your full name" placeholderTextColor="#55556A" autoCapitalize="words" value={name} onChangeText={setName} />

          <Text style={styles.label}>Age *</Text>
          <TextInput style={styles.inputSingle} placeholder="Your age" placeholderTextColor="#55556A" keyboardType="number-pad" maxLength={3} value={age} onChangeText={setAge} />

          <Text style={styles.label}>Contact Number *</Text>
          <View style={styles.inputWrap}>
            <View style={styles.prefix}><Text style={styles.prefixText}>+91</Text></View>
            <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#55556A" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>

          <Text style={styles.label}>Email ID *</Text>
          <TextInput style={styles.inputSingle} placeholder="your@email.com" placeholderTextColor="#55556A" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

          <Text style={styles.label}>Create Password * (min. 6 characters)</Text>
          <View style={styles.passWrap}>
            <TextInput style={styles.passInput} placeholder="Create a strong password" placeholderTextColor="#55556A" secureTextEntry={!showPass} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}><Text style={styles.eyeTxt}>{showPass ? 'Hide' : 'Show'}</Text></TouchableOpacity>
          </View>
          {passStrength === 'weak' && <Text style={styles.passWeak}>Too short - minimum 6 characters</Text>}
          {(passStrength === 'good' || passStrength === 'strong') && <Text style={styles.passGood}>Password looks good</Text>}

          <Text style={[styles.label, { marginTop: 10 }]}>Confirm Password *</Text>
          <View style={styles.passWrap}>
            <TextInput style={styles.passInput} placeholder="Re-enter password" placeholderTextColor="#55556A" secureTextEntry={!showConfirm} value={confirmPassword} onChangeText={setConfirmPassword} />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}><Text style={styles.eyeTxt}>{showConfirm ? 'Hide' : 'Show'}</Text></TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && password !== confirmPassword && <Text style={styles.passWeak}>Passwords do not match</Text>}
          {confirmPassword.length >= 6 && password === confirmPassword && <Text style={styles.passGood}>Passwords match</Text>}

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(v => !v)} activeOpacity={0.8}>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Text style={styles.checkmark}>v</Text>}
            </View>
            <Text style={styles.termsTxt}>
              {'I agree to the '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' and '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister} disabled={loading || !agreed} style={[styles.btn, (loading || !agreed) && styles.btnDisabled]}>
            <Text style={styles.btnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 24, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 6 },
  sub: { fontSize: 13, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 24, lineHeight: 20 },
  googleBtn: { backgroundColor: '#1A1A22', borderWidth: 1, borderColor: '#2A2A36', borderRadius: 11, padding: 14, alignItems: 'center', marginBottom: 16 },
  googleBtnText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_700Bold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: '#1E1E26' },
  divTxt: { fontSize: 10, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular', letterSpacing: 1 },
  label: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 6 },
  inputSingle: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 14 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, overflow: 'hidden', marginBottom: 14 },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  passWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, overflow: 'hidden', marginBottom: 4 },
  passInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 13 },
  eyeTxt: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular' },
  passWeak: { fontSize: 11, color: '#EF4444', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 8 },
  passGood: { fontSize: 11, color: '#22C55E', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 8 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#55556A', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  checkboxActive: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  checkmark: { fontSize: 12, color: '#000', fontWeight: '700' },
  termsTxt: { flex: 1, fontSize: 13, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 20 },
  termsLink: { color: '#F5A623' },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  link: { alignItems: 'center', marginTop: 4 },
  linkText: { color: '#55556A', fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular' },
  linkHighlight: { color: '#F5A623' },
});
