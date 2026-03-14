import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/firebase';
import { useAppStore } from '../../store/useAppStore';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';

export default function LoginScreen({ navigation }: any) {
  const { setUser } = useAppStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      const existing = await AsyncStorage.getItem('@user_profile');
      if (!existing) {
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
      }
      setUser(user.uid, '', user.displayName || '');
    } catch (e: any) {
      Alert.alert('Google Login Failed', e.message || 'Could not sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (phone.length < 10) { Alert.alert('Enter a valid 10-digit number'); return; }
    if (password.length < 6) { Alert.alert('Enter your password (minimum 6 characters)'); return; }
    setLoading(true);
    try {
      const emailByPhone = await AsyncStorage.getItem('@phone_' + phone);
      if (!emailByPhone) {
        Alert.alert('Account Not Found', 'No account found for this phone number. Please register first.');
        setLoading(false);
        return;
      }
      const result = await signInWithEmailAndPassword(auth, emailByPhone, password);
      const user = result.user;
      const profileStr = await AsyncStorage.getItem('@user_profile');
      const profile = profileStr ? JSON.parse(profileStr) : null;
      setUser(user.uid, phone, profile?.name || '');
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
        Alert.alert('Login Failed', 'Incorrect password. Please try again.');
      } else {
        Alert.alert('Error', e.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>NammaDeal</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.sub}>Login to compare and save on every trip</Text>

          <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync()} disabled={loading || !request}>
            <Text style={styles.googleBtnText}>G  Login with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divTxt}>OR LOGIN WITH PHONE</Text>
            <View style={styles.divLine} />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrap}>
            <View style={styles.prefix}><Text style={styles.prefixText}>+91</Text></View>
            <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#55556A" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.passWrap}>
            <TextInput style={styles.passInput} placeholder="Enter your password" placeholderTextColor="#55556A" secureTextEntry={!showPass} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}><Text style={styles.eyeTxt}>{showPass ? 'Hide' : 'Show'}</Text></TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPin')} style={styles.forgotRow}>
            <Text style={styles.forgotTxt}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={[styles.btn, loading && styles.btnDisabled]}>
            <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
            <Text style={styles.linkText}>New here? <Text style={styles.linkHighlight}>Create Account</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08080A' },
  container: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },
  logo: { fontSize: 40, color: '#F5A623', fontFamily: 'BebasNeue_400Regular', letterSpacing: 2, marginBottom: 24, textAlign: 'center' },
  title: { fontSize: 24, color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 6 },
  sub: { fontSize: 13, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 28, lineHeight: 20 },
  googleBtn: { backgroundColor: '#1A1A22', borderWidth: 1, borderColor: '#2A2A36', borderRadius: 11, padding: 14, alignItems: 'center', marginBottom: 16 },
  googleBtnText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_700Bold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: '#1E1E26' },
  divTxt: { fontSize: 10, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular', letterSpacing: 1 },
  label: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, overflow: 'hidden', marginBottom: 14 },
  prefix: { paddingHorizontal: 14, paddingVertical: 13, borderRightWidth: 1, borderRightColor: '#1E1E26' },
  prefixText: { color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  passWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, overflow: 'hidden', marginBottom: 8 },
  passInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, color: '#F0F0F5', fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 13 },
  eyeTxt: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular' },
  forgotRow: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotTxt: { fontSize: 13, color: '#F5A623', fontFamily: 'SpaceGrotesk_400Regular' },
  btn: { backgroundColor: '#F5A623', borderRadius: 11, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#55556A', fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular' },
  linkHighlight: { color: '#F5A623' },
});
