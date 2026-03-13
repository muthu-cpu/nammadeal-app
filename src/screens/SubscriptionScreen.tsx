import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Linking, Alert,
  AppState, AppStateStatus, Animated, Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useSubscription } from '../hooks/useSubscription';
import { useAppStore } from '../store/useAppStore';

// ── Your UPI Details ─────────────────────────────────────────
const UPI_ID   = 'janvel1996@ybl';
const UPI_NAME = 'NammaDeal';
const AMOUNT   = 5;

const UPI_LINK = (app?: string) =>
  `${app || 'upi'}://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent('NammaDeal 30-day Subscription')}`;

const FEATURES = [
  { icon: '🚗', label: 'Rides — Uber, Ola, Rapido, Namma Yatri' },
  { icon: '🛒', label: 'Grocery — Blinkit, Zepto, Swiggy, BigBasket' },
  { icon: '🍔', label: 'Food — Swiggy vs Zomato instant compare' },
  { icon: '🗺️', label: 'Route Finder — Bus, Metro, Auto & more' },
  { icon: '💊', label: 'Pharma — 1mg, PharmEasy, Apollo, Netmeds' },
  { icon: '✈️', label: 'Travels — Bus fares all operators' },
  { icon: '⛽', label: 'Fuel — Live prices by city' },
  { icon: '🏷️', label: 'Offers & savings tracker' },
];

const UPI_APPS = [
  { name: 'PhonePe', scheme: 'phonepe' },
  { name: 'GPay',    scheme: 'tez' },
  { name: 'Paytm',   scheme: 'paytmmp' },
  { name: 'BHIM',    scheme: 'upi' },
];

// ── Success Screen ────────────────────────────────────────────
function PaymentSuccess({ expiry, onContinue }: { expiry: string; onContinue: () => void }) {
  const scaleAnim  = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.successScreen, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.successTick}>✓</Text>
      </Animated.View>
      <Text style={styles.successTitle}>Payment Successful!</Text>
      <Text style={styles.successAmt}>₹{AMOUNT} paid</Text>
      <View style={styles.successCard}>
        <Text style={styles.successCardLabel}>SUBSCRIPTION ACTIVE UNTIL</Text>
        <Text style={styles.successCardDate}>{expiry}</Text>
        <Text style={styles.successCardDays}>30 days full access</Text>
      </View>
      <Text style={styles.successNote}>
        Enjoy all NammaDeal features!{'\n'}
        Compare rides, grocery, food & more.
      </Text>
      <TouchableOpacity style={styles.successBtn} onPress={onContinue}>
        <Text style={styles.successBtnTxt}>🚀  Start Saving Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const { activateSubscription, checkStatus, expiry } = useSubscription();
  const { showToast } = useAppStore();

  const [paid,       setPaid]       = useState(false);
  const [activating, setActivating] = useState(false);
  const [expiryStr,  setExpiryStr]  = useState('');
  const justOpenedUPI = useRef(false);

  // Today → +30 days for display
  const today   = new Date();
  const expDate = new Date(today); expDate.setDate(expDate.getDate() + 30);
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const validityStr = `${fmt(today)} → ${fmt(expDate)}`;

  // ── Detect app returning from UPI ─────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && justOpenedUPI.current) {
        justOpenedUPI.current = false;
        // Give a small delay then ask user to confirm
        setTimeout(() => {
          Alert.alert(
            '💳 Payment Complete?',
            `Did you pay ₹${AMOUNT} to ${UPI_ID}?\n\nTap "Yes" to activate your 30-day subscription.`,
            [
              { text: 'No', style: 'cancel' },
              {
                text: "Yes — Activate ✓",
                onPress: async () => {
                  setActivating(true);
                  await activateSubscription();
                  const exp = new Date(); exp.setDate(exp.getDate() + 30);
                  setExpiryStr(fmt(exp));
                  setPaid(true);
                  setActivating(false);
                },
              },
            ],
          );
        }, 600);
      }
    });
    return () => sub.remove();
  }, []);

  const openUPI = async (scheme?: string) => {
    const link = UPI_LINK(scheme);
    const canOpen = await Linking.canOpenURL(link).catch(() => false);
    if (canOpen) {
      justOpenedUPI.current = true;
      await Linking.openURL(link);
    } else {
      // Fallback — manual confirm
      showToast(`Pay ₹${AMOUNT} to UPI: ${UPI_ID}`);
      justOpenedUPI.current = false;
    }
  };

  const handleManualConfirm = () => {
    Alert.alert(
      '✅ Confirm Payment',
      `Have you paid ₹${AMOUNT} to\n${UPI_ID}?\n\nSubscription: ${validityStr}`,
      [
        { text: 'Not yet', style: 'cancel' },
        {
          text: "Yes — Activate 30 Days",
          onPress: async () => {
            setActivating(true);
            await activateSubscription();
            const exp = new Date(); exp.setDate(exp.getDate() + 30);
            setExpiryStr(fmt(exp));
            setPaid(true);
            setActivating(false);
          },
        },
      ],
    );
  };

  // ── Show success screen after payment ─────────────────────
  if (paid) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <PaymentSuccess
          expiry={expiryStr}
          onContinue={() => checkStatus()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>NammaDeal Pro</Text>
          <Text style={styles.heroSub}>3-day free trial • then ₹5 for 30 days</Text>
        </View>

        {/* Trial pill */}
        <View style={styles.trialPill}>
          <Text style={styles.trialPillTxt}>🎁  3 DAYS FREE  •  Then ₹5/30 days</Text>
        </View>

        {/* Validity box */}
        <View style={styles.validityCard}>
          <Text style={styles.validityLabel}>SUBSCRIPTION PERIOD (if paid today)</Text>
          <Text style={styles.validityDates}>{validityStr}</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>📲 Scan & Pay ₹5</Text>
          <Text style={styles.qrSub}>Open any UPI app → Scan this QR → Pay ₹5</Text>

          <View style={styles.qrWrap}>
            <QRCode
              value={UPI_LINK()}
              size={210}
              backgroundColor="#0D0D14"
              color="#F5A623"
              quietZone={12}
            />
            <View style={styles.qrBadge}>
              <Text style={styles.qrBadgeTxt}>₹5</Text>
            </View>
          </View>

          <Text style={styles.upiIdRow}>
            UPI: <Text style={styles.upiIdVal}>{UPI_ID}</Text>
          </Text>

          {/* One-tap UPI app buttons */}
          <View style={styles.upiApps}>
            {UPI_APPS.map(app => (
              <TouchableOpacity
                key={app.name}
                style={styles.upiAppBtn}
                onPress={() => openUPI(app.scheme)}
              >
                <Text style={styles.upiAppTxt}>{app.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmBtn, activating && styles.btnDisabled]}
          onPress={handleManualConfirm}
          disabled={activating}
        >
          {activating ? <ActivityIndicator color="#000" /> : (
            <>
              <Text style={styles.confirmTxt}>✅  I've Paid — Activate Now</Text>
              <Text style={styles.confirmSub}>{validityStr}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Features */}
        <Text style={styles.sectionLbl}>WHAT YOU GET</Text>
        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={[styles.featureRow, i === FEATURES.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureCheck}>✓</Text>
            </View>
          ))}
        </View>

        <Text style={styles.terms}>
          No auto-debit • Manual renewal every 30 days{'\n'}
          3-day free trial for all new users
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: Colors.bg },
  scroll:           { padding: 20, paddingBottom: 50 },

  // Hero
  hero:             { alignItems: 'center', marginBottom: 14, marginTop: 6 },
  heroTitle:        { fontFamily: Fonts.display, fontSize: 36, color: Colors.primary, letterSpacing: 2 },
  heroSub:          { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body, marginTop: 4, textAlign:'center' },

  // Trial pill
  trialPill:        { backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 30, paddingVertical: 9, paddingHorizontal: 18, alignItems: 'center', marginBottom: 14 },
  trialPillTxt:     { fontSize: 13, color: Colors.green, fontFamily: Fonts.bold, letterSpacing: 0.5 },

  // Validity
  validityCard:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 13, padding: 14, marginBottom: 14, alignItems: 'center', gap: 6 },
  validityLabel:    { fontSize: 9, color: Colors.muted, fontFamily: Fonts.semibold, letterSpacing: 1.5, textTransform: 'uppercase' },
  validityDates:    { fontSize: 15, color: Colors.text, fontFamily: Fonts.bold, textAlign: 'center' },

  // QR
  qrSection:        { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 14, gap: 10 },
  qrTitle:          { fontFamily: Fonts.bold, fontSize: 17, color: Colors.text },
  qrSub:            { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.body, textAlign: 'center' },
  qrWrap:           { position: 'relative', marginVertical: 8, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: Colors.borderGold, padding: 8, backgroundColor: '#0D0D14' },
  qrBadge:          { position: 'absolute', bottom: 12, right: 12, backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  qrBadgeTxt:       { fontSize: 14, fontFamily: Fonts.bold, color: '#000' },
  upiIdRow:         { fontSize: 12, color: Colors.muted, fontFamily: Fonts.body },
  upiIdVal:         { color: Colors.text, fontFamily: Fonts.bold },
  upiApps:          { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  upiAppBtn:        { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  upiAppTxt:        { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.semibold },

  // Confirm
  confirmBtn:       { backgroundColor: Colors.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 20 },
  confirmTxt:       { fontSize: 16, fontFamily: Fonts.bold, color: '#000' },
  confirmSub:       { fontSize: 11, color: '#00000066', fontFamily: Fonts.body, marginTop: 3 },
  btnDisabled:      { opacity: 0.5 },

  // Features
  sectionLbl:       { fontSize: 10, color: Colors.muted, fontFamily: Fonts.semibold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  featureList:      { backgroundColor: Colors.card, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 18 },
  featureRow:       { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  featureIcon:      { fontSize: 17, width: 30 },
  featureLabel:     { flex: 1, fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body },
  featureCheck:     { fontSize: 14, color: Colors.green, fontFamily: Fonts.bold },
  terms:            { textAlign: 'center', fontSize: 11, color: Colors.muted, fontFamily: Fonts.body, lineHeight: 18 },

  // ── Success screen ──────────────────────────────────────────
  successScreen:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 16 },
  successCircle:    { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTick:      { fontSize: 52, color: '#fff', fontFamily: Fonts.bold },
  successTitle:     { fontSize: 28, fontFamily: Fonts.display, color: Colors.text, letterSpacing: 1 },
  successAmt:       { fontSize: 16, color: Colors.green, fontFamily: Fonts.bold },
  successCard:      { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 14, padding: 18, alignItems: 'center', gap: 6, width: '100%' },
  successCardLabel: { fontSize: 9, color: Colors.muted, fontFamily: Fonts.semibold, letterSpacing: 1.5, textTransform: 'uppercase' },
  successCardDate:  { fontSize: 18, color: Colors.primary, fontFamily: Fonts.bold, textAlign: 'center' },
  successCardDays:  { fontSize: 13, color: Colors.green, fontFamily: Fonts.semibold },
  successNote:      { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 20 },
  successBtn:       { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, marginTop: 8 },
  successBtnTxt:    { fontSize: 16, fontFamily: Fonts.bold, color: '#000' },
});
