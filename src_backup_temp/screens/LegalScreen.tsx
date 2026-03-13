import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect the following information to provide our services:

• Mobile number (for OTP-based login via Firebase Authentication)
• Name (provided during sign-up)
• Location data (only when you use Rides or Route Finder features — with your permission)
• Search queries (e.g., "milk", "Blinkit vs Zepto") stored locally on your device
• Subscription data (stored locally on your device)

We do NOT collect:
• Passwords (we use OTP-based authentication only)
• Payment details (UPI payments are processed directly via your UPI app)
• Browse history from other apps`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Your information is used solely to:

• Authenticate your identity via Firebase OTP
• Show personalised price comparisons based on your location
• Display your savings history
• Improve app performance and fix bugs

We do NOT:
• Sell your data to third parties
• Use your data for advertising
• Share your data with partner apps (Blinkit, Zepto, Uber etc.)`,
  },
  {
    title: '3. Location Data',
    body: `NammaDeal requests location permission ONLY when you use:
• Rides — to calculate route distance and compare prices
• Route Finder — to find transit routes near you

Location is:
• Never stored on our servers
• Never shared with third parties
• Only used in real-time for the comparison you requested
• Always requires your explicit permission (Android permission dialog)

You can revoke location permission at any time in your Android Settings.`,
  },
  {
    title: '4. Data Storage & Security',
    body: `• Your mobile number and name are stored in Firebase (Google's secure cloud)
• Your search history, basket items, savings, and subscription data are stored locally on your device using AsyncStorage
• Price comparisons are performed locally — your searches are NOT sent to any server
• Location data is never stored
• All Firebase data is encrypted at rest and in transit (TLS)`,
  },
  {
    title: '5. Subscriptions & Payments',
    body: `• NammaDeal offers an optional ₹5/month subscription (free until June 1, 2026)
• Payments are made directly via your UPI app (PhonePe, GPay, Paytm etc.)
• We do NOT have access to your bank account or UPI PIN
• Subscription status is stored locally on your device
• There is no auto-debit — renewal is always manual`,
  },
  {
    title: '6. Third-Party Apps & Deep Links',
    body: `NammaDeal compares prices shown by third-party apps including:
Blinkit, Zepto, Swiggy Instamart, BigBasket, JioMart, DMart, Uber, Ola, Rapido, Namma Yatri, 1mg, PharmEasy, Apollo 247, Netmeds, RedBus, AbhiBus, MakeMyTrip, Goibibo.

• Price data displayed is for comparison purposes and may vary
• We are not responsible for pricing errors by these platforms
• When you tap "Open App", you are redirected to the respective app
• We are not affiliated with any of these companies`,
  },
  {
    title: '7. Children\'s Privacy',
    body: `NammaDeal is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date below. Continued use of the app after changes constitutes acceptance of the new policy.`,
  },
  {
    title: '9. Contact Us',
    body: `For any questions or concerns about this Privacy Policy or our data practices:

📧 Email: support@nammadeal.com
📱 UPI/Support: janvel1996@ybl

NammaDeal is developed and operated by Muthuvels, Bengaluru, India.`,
  },
];

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By downloading, installing, or using NammaDeal ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree, please uninstall the app.`,
  },
  {
    title: '2. Description of Service',
    body: `NammaDeal is a price comparison app that helps users compare prices across delivery and ride platforms in India. We do not sell any products directly. All purchases happen on third-party platforms.`,
  },
  {
    title: '3. Price Accuracy',
    body: `• Prices shown are estimates based on publicly available data
• Actual prices on third-party apps may vary based on your location, time, and promotions
• NammaDeal is not liable for any price discrepancies
• Always verify the final price on the respective platform before purchasing`,
  },
  {
    title: '4. Subscription Terms',
    body: `• The ₹5/month subscription is optional
• No subscription is required until June 1, 2026
• After the free period, a 3-day free trial is available
• Subscriptions are renewed manually — there is no auto-debit
• No refunds on subscription payments (given the low price of ₹5)`,
  },
  {
    title: '5. Prohibited Use',
    body: `You may NOT:
• Reverse engineer, decompile, or disassemble the app
• Use the app for any unlawful purpose
• Attempt to gain unauthorised access to our systems
• Scrape or automate requests through the app`,
  },
  {
    title: '6. Limitation of Liability',
    body: `NammaDeal is provided "as is" without any warranties. We are not liable for:
• Any indirect, incidental, or consequential damages
• Loss of data or profit
• Decisions made based on price comparisons shown in the app
• Downtime or unavailability of the app`,
  },
  {
    title: '7. Governing Law',
    body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.`,
  },
];

type Tab = 'privacy' | 'terms';

export function LegalScreen({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('privacy');

  const sections = tab === 'privacy' ? SECTIONS : TERMS_SECTIONS;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backTxt}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'privacy' && styles.tabActive]}
          onPress={() => setTab('privacy')}
        >
          <Text style={[styles.tabTxt, tab === 'privacy' && styles.tabTxtActive]}>
            🔒 Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'terms' && styles.tabActive]}
          onPress={() => setTab('terms')}
        >
          <Text style={[styles.tabTxt, tab === 'terms' && styles.tabTxtActive]}>
            📋 Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            {tab === 'privacy' ? '🔒 Privacy Policy' : '📋 Terms & Conditions'}
          </Text>
          <Text style={styles.subtitle}>NammaDeal · Last updated: March 13, 2026</Text>
          {tab === 'privacy' && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📌 Quick Summary</Text>
              <Text style={styles.summaryText}>
                • We collect only your phone number and name{'\n'}
                • Location used only for rides/routes — never stored{'\n'}
                • We never sell your data{'\n'}
                • Payments go directly to your UPI app — we don't see them{'\n'}
                • All searches happen on your device
              </Text>
            </View>
          )}
        </View>

        {/* Sections */}
        {sections.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}

        {/* Contact */}
        <TouchableOpacity
          style={styles.emailBtn}
          onPress={() => Linking.openURL('mailto:support@nammadeal.com?subject=NammaDeal Privacy Query')}
        >
          <Text style={styles.emailBtnTxt}>📧 Contact Us</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          © 2026 NammaDeal · Bengaluru, India{'\n'}
          Built with ❤️ for saving money
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn:      { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center' },
  backTxt:      { color: Colors.muted2, fontSize: 18 },
  headerTitle:  { flex: 1, textAlign: 'center', fontFamily: Fonts.display, fontSize: 18, color: Colors.text, letterSpacing: 1 },

  tabRow:       { flexDirection: 'row', backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 8, gap: 6 },
  tab:          { flex: 1, padding: 9, borderRadius: 10, alignItems: 'center', backgroundColor: Colors.card2 },
  tabActive:    { backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: Colors.borderGold },
  tabTxt:       { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.semibold },
  tabTxtActive: { color: Colors.primary },

  scroll:       { padding: 16, paddingBottom: 50 },
  titleBlock:   { marginBottom: 20, gap: 6 },
  title:        { fontFamily: Fonts.display, fontSize: 26, color: Colors.text, letterSpacing: 1 },
  subtitle:     { fontSize: 12, color: Colors.muted, fontFamily: Fonts.body },

  summaryCard:  { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 12, padding: 14, marginTop: 10, gap: 6 },
  summaryTitle: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.primary },
  summaryText:  { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.body, lineHeight: 20 },

  section:      { marginBottom: 18, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 16 },
  sectionTitle: { fontSize: 14, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 8 },
  sectionBody:  { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body, lineHeight: 22 },

  emailBtn:     { backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: Colors.borderGold, borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 16 },
  emailBtnTxt:  { fontSize: 14, color: Colors.primary, fontFamily: Fonts.semibold },
  footer:       { textAlign: 'center', fontSize: 11, color: Colors.muted, fontFamily: Fonts.body, lineHeight: 18 },
});
