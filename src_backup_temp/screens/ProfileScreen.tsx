import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useAppStore } from '../store/useAppStore';
import { LegalScreen } from './LegalScreen';

interface UserProfile {
  phone: string; name?: string; gender?: string; age?: number;
  createdAt: string; totalSaved: number; recentSearches: string[];
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userId, userPhone, userName, totalSaved, recent, setUser, showToast } = useAppStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegal, setShowLegal] = useState(false);

  if (showLegal) return <LegalScreen onBack={() => setShowLegal(false)} />;

  useEffect(() => {
    AsyncStorage.getItem('@user_profile').then(raw => {
      if (raw) {
        const d = JSON.parse(raw);
        setProfile({
          phone: d.phone || userPhone || 'Unknown',
          name: d.name || undefined, gender: d.gender || undefined, age: d.age || undefined,
          createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown',
          totalSaved: d.totalSaved || 0, recentSearches: d.recentSearches || [],
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { signOut(auth).then(() => { setUser(null, null, null); showToast('Logged out successfully'); }); } },
    ]);
  };

  const displayName = userName || profile?.name;
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : (userPhone || 'U').slice(-2);
  const allRecent = [
    ...recent.grocery.map(q => ({ q, cat: 'Grocery' })),
    ...recent.food.map(q => ({ q, cat: 'Food' })),
    ...recent.pharma.map(q => ({ q, cat: 'Pharma' })),
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>My Account</Text>
      <View style={styles.avatarCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <View style={{ flex: 1 }}>
          {displayName ? <Text style={styles.nameText}>{displayName}</Text> : null}
          <Text style={styles.phoneText}>{userPhone ? '+91 ' + userPhone : 'Not logged in'}</Text>
          <Text style={styles.joinedText}>{profile ? 'Joined ' + profile.createdAt : loading ? 'Loading...' : 'Joined recently'}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCell}><Text style={styles.statValue}>Rs {Math.round(totalSaved || 0)}</Text><Text style={styles.statLabel}>Total Saved</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}><Text style={styles.statValue}>{allRecent.length}</Text><Text style={styles.statLabel}>Searches</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}><Text style={styles.statValue}>{userId ? 'Active' : 'Guest'}</Text><Text style={styles.statLabel}>Status</Text></View>
      </View>
      <Text style={styles.sectionLabel}>Account Details</Text>
      <View style={styles.detailCard}>
        {displayName ? <DetailRow label="Name" value={displayName} /> : null}
        <DetailRow label="Phone" value={userPhone ? '+91 ' + userPhone : 'N/A'} />
        {profile?.gender ? <DetailRow label="Gender" value={profile.gender} /> : null}
        {profile?.age ? <DetailRow label="Age" value={String(profile.age)} /> : null}
        <DetailRow label="Joined" value={profile?.createdAt || (loading ? 'Loading...' : 'N/A')} />
        <DetailRow label="Saved" value={'Rs ' + Math.round(totalSaved || 0)} last />
      </View>
      {allRecent.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Recent Searches</Text>
          <View style={styles.detailCard}>
            {allRecent.slice(0, 10).map((item, i) => (
              <View key={i} style={[styles.recentRow, i === Math.min(allRecent.length, 10) - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.catBadge, { backgroundColor: item.cat === 'Grocery' ? Colors.greenDim : item.cat === 'Food' ? Colors.redDim : Colors.blueDim }]}>
                  <Text style={[styles.catBadgeText, { color: item.cat === 'Grocery' ? Colors.green : item.cat === 'Food' ? Colors.red : Colors.blue }]}>{item.cat}</Text>
                </View>
                <Text style={styles.recentQuery}>{item.q}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      {userId && (<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>)}
      <TouchableOpacity style={styles.legalBtn} onPress={() => setShowLegal(true)}>
        <Text style={styles.legalTxt}>🔒 Privacy Policy &amp; Terms</Text>
        <Text style={{ color: Colors.muted }}>›</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 16, paddingBottom: 80 },
  pageTitle: { fontFamily: Fonts.display, fontSize: 26, color: Colors.text, letterSpacing: 1, marginBottom: 16 },
  avatarCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 16, marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryDim, borderWidth: 1, borderColor: Colors.borderGold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.display, fontSize: 22, color: Colors.primary },
  nameText: { fontSize: 17, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 2 },
  phoneText: { fontSize: 14, fontFamily: Fonts.medium, color: Colors.muted2, marginBottom: 3 },
  joinedText: { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.body },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, marginBottom: 16, overflow: 'hidden' },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: { fontFamily: Fonts.display, fontSize: 20, color: Colors.primary, letterSpacing: 0.5 },
  statLabel: { fontSize: 10, color: Colors.muted, fontFamily: Fonts.medium, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionLabel: { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, fontFamily: Fonts.semibold },
  detailCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, marginBottom: 16, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.medium },
  detailValue: { fontSize: 13, color: Colors.text, fontFamily: Fonts.semibold },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontFamily: Fonts.bold },
  recentQuery: { fontSize: 13, color: Colors.text, fontFamily: Fonts.medium, flex: 1 },
  logoutBtn: { width: '100%', padding: 14, backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 11, alignItems: 'center', marginTop: 4 },
  logoutText: { fontSize: 15, fontFamily: Fonts.bold, color: Colors.red },
  legalBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 11, marginTop: 8 },
  legalTxt: { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.semibold },
});
