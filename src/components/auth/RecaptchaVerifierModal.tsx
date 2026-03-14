import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Modal, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { FirebaseApp } from 'firebase/app';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  [key: string]: string | undefined;
}

interface Props {
  firebaseConfig: FirebaseConfig;
  attemptInvisibleVerification?: boolean;
  onVerify?: (token: string) => void;
}

export interface RecaptchaVerifierModalRef {
  verify: () => Promise<string>;
  _reset: () => void;
  /** Firebase compat: type identifier */
  type: 'recaptcha';
  /** Firebase compat: verify returns a token promise */
  verify_compat: () => Promise<string>;
}

const getHtml = (config: FirebaseConfig, invisible: boolean) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; background: #08080A; font-family: sans-serif; }
    #status { color: #F0F0F5; font-size: 14px; text-align: center; }
  </style>
</head>
<body>
  <div>
    <div id="recaptcha-container"></div>
    <p id="status">Verifying…</p>
  </div>
  <script>
    const config = ${JSON.stringify(config)};
    if (!firebase.apps.length) firebase.initializeApp(config);
    const auth = firebase.auth();
    auth.settings.appVerificationDisabledForTesting = false;

    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: ${invisible ? "'invisible'" : "'normal'"},
      callback: function(token) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'token', token }));
      },
      'expired-callback': function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'expired' }));
      }
    });

    verifier.render().then(function() {
      ${invisible ? 'verifier.verify();' : "document.getElementById('status').textContent = '';"}
    }).catch(function(err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
    });

    window._verifier = verifier;
  </script>
</body>
</html>
`;

/**
 * Drop-in replacement for FirebaseRecaptchaVerifierModal from expo-firebase-recaptcha.
 * Uses react-native-webview (already in project) instead of expo-firebase-core which
 * breaks Gradle on Expo SDK 52.
 *
 * Usage:
 *   const recaptchaVerifier = useRef<RecaptchaVerifierModalRef>(null);
 *   <RecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification />
 *   // pass recaptchaVerifier.current as the verifier argument to signInWithPhoneNumber
 */
export const RecaptchaVerifierModal = forwardRef<RecaptchaVerifierModalRef, Props>(
  ({ firebaseConfig, attemptInvisibleVerification = false }, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const resolveRef = useRef<((token: string) => void) | null>(null);
    const rejectRef = useRef<((err: Error) => void) | null>(null);

    const verify = (): Promise<string> =>
      new Promise((resolve, reject) => {
        resolveRef.current = resolve;
        rejectRef.current = reject;
        setVisible(true);
        setLoading(true);
      });

    const reset = () => {
      setVisible(false);
      resolveRef.current = null;
      rejectRef.current = null;
    };

    useImperativeHandle(ref, () => ({
      type: 'recaptcha' as const,
      verify,
      verify_compat: verify,
      _reset: reset,
    }));

    const onMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'token') {
          resolveRef.current?.(data.token);
          setVisible(false);
        } else if (data.type === 'expired') {
          rejectRef.current?.(new Error('reCAPTCHA expired'));
          setVisible(false);
        } else if (data.type === 'error') {
          rejectRef.current?.(new Error(data.message));
          setVisible(false);
        }
      } catch { /* ignore non-JSON messages */ }
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          rejectRef.current?.(new Error('Cancelled'));
          setVisible(false);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Security Check</Text>
            {loading && <ActivityIndicator color="#F5A623" style={styles.spinner} />}
            <WebView
              style={[styles.webview, loading && styles.hidden]}
              source={{ html: getHtml(firebaseConfig, attemptInvisibleVerification), baseUrl: `https://${firebaseConfig.authDomain}` }}
              onMessage={onMessage}
              onLoad={() => setLoading(false)}
              originWhitelist={['*']}
              javaScriptEnabled
              mixedContentMode="always"
            />
            <TouchableOpacity onPress={() => { rejectRef.current?.(new Error('Cancelled')); setVisible(false); }}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center' },
  card:    { width: '85%', backgroundColor: '#101014', borderRadius: 16, borderWidth: 1, borderColor: '#1E1E26', overflow: 'hidden', padding: 16 },
  title:   { color: '#F0F0F5', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  spinner: { marginVertical: 20 },
  webview: { width: '100%', height: 140, backgroundColor: '#101014' },
  hidden:  { height: 0 },
  cancel:  { color: '#F5A623', fontSize: 14, textAlign: 'center', marginTop: 12, paddingVertical: 8 },
});
