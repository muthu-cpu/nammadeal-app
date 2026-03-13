import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { FUEL_BY_CITY, FUEL_LOGOS, FUEL_TIPS, CITIES, FuelType } from '../data/fuelData';
import { SaveBar } from '../components/common/SaveBar';
import { useClipboard } from '../hooks/useClipboard';

const TYPES: { label: string; value: FuelType }[] = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'CNG',    value: 'cng' },
];

export function FuelScreen() {
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [city, setCity] = useState('Bengaluru');
  const { copyText, shareWhatsApp } = useClipboard();

  const cityData = FUEL_BY_CITY[city] || FUEL_BY_CITY['Bengaluru'];
  const stations = [...(cityData[fuelType] || [])].sort((a, b) => a.price - b.price);
  const diff = stations.length > 1 ? (stations[stations.length - 1].price - stations[0].price).toFixed(2) : '0';

  const getShareText = () =>
    city + ' Fuel (' + fuelType.toUpperCase() + '):\n' +
    stations.map((s, i) => (i === 0 ? 'CHEAPEST ' : '') + s.name + ': ' + s.price + '/L').join('\n') +
    '\nvia NammaDeal app';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* City selector */}
        <Text style={styles.sectionLabel}>SELECT CITY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityRow}>
          {CITIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => setCity(c)} style={[styles.cityChip, city === c && styles.cityChipActive]}>
              <Text style={[styles.cityChipText, city === c && styles.cityChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Fuel type toggle */}
        <View style={styles.toggle}>
          {TYPES.map((t) => (
            <TouchableOpacity key={t.value} onPress={() => setFuelType(t.value)} style={[styles.toggleBtn, fuelType === t.value && styles.toggleActive]}>
              <Text style={[styles.toggleText, fuelType === t.value && styles.toggleActiveText]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            Prices as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {city}
          </Text>
          <View style={styles.iconBtns}>
            <TouchableOpacity onPress={() => copyText(getShareText())} style={styles.iconBtn}>
              <MaterialIcons name="content-copy" size={14} color="#A0A0B8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareWhatsApp(getShareText())} style={[styles.iconBtn, styles.waBtn]}>
              <FontAwesome name="whatsapp" size={14} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tip}>
          <Text style={styles.tipTitle}>Tip</Text>
          <Text style={styles.tipText}>{FUEL_TIPS[fuelType]}</Text>
        </View>

        {stations.length > 0 && (
          <SaveBar label={'Save ₹' + diff + '/L in ' + city} savings={parseFloat(diff)} />
        )}

        {stations.map((s, i) => {
          const best = i === 0;
          const logoTxt = FUEL_LOGOS[s.logo] || s.logo.toUpperCase().slice(0, 3);
          return (
            <View key={s.name} style={[styles.card, best && styles.bestCard]}>
              <View style={[styles.logoBox, { backgroundColor: s.color }]}>
                <Text style={styles.logoText}>{logoTxt}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{s.name}</Text>
                  {best && <View style={styles.bestTag}><Text style={styles.bestTagTxt}>CHEAPEST</Text></View>}
                </View>
                <Text style={styles.loc}>{s.location}</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.price}>{'₹' + s.price}</Text>
                <Text style={styles.perL}>/litre</Text>
              </View>
            </View>
          );
        })}

        {stations.length === 0 && (
          <Text style={styles.noData}>CNG not available in {city}</Text>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080A' },
  content: { padding: 14, paddingBottom: 80 },
  sectionLabel: { fontSize: 10, color: '#55556A', fontFamily: 'SpaceGrotesk_600SemiBold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  cityRow: { gap: 8, marginBottom: 14 },
  cityChip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 20 },
  cityChipActive: { backgroundColor: 'rgba(245,166,35,0.12)', borderColor: '#F5A623' },
  cityChipText: { fontSize: 13, color: '#55556A', fontFamily: 'SpaceGrotesk_500Medium' },
  cityChipTextActive: { color: '#F5A623', fontFamily: 'SpaceGrotesk_700Bold' },
  toggle: { flexDirection: 'row', backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 11, padding: 4, marginBottom: 10 },
  toggleBtn: { flex: 1, padding: 7, borderRadius: 8, alignItems: 'center' },
  toggleActive: { backgroundColor: 'rgba(245,166,35,0.12)' },
  toggleText: { fontSize: 13, fontFamily: 'SpaceGrotesk_600SemiBold', color: '#55556A' },
  toggleActiveText: { color: '#F5A623' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  meta: { fontSize: 11, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular', flex: 1 },
  iconBtns: { flexDirection: 'row', gap: 6 },
  iconBtn: { width: 28, height: 28, borderRadius: 7, backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', alignItems: 'center', justifyContent: 'center' },
  waBtn: { borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.08)' },
  tip: { backgroundColor: 'rgba(245,166,35,0.06)', borderWidth: 1, borderColor: 'rgba(245,166,35,0.12)', borderRadius: 11, padding: 12, marginBottom: 12 },
  tipTitle: { fontSize: 10, color: '#F5A623', fontFamily: 'SpaceGrotesk_700Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  tipText: { fontSize: 12, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular', lineHeight: 18 },
  card: { backgroundColor: '#101014', borderWidth: 1, borderColor: '#1E1E26', borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 8 },
  bestCard: { borderColor: 'rgba(245,166,35,0.2)' },
  logoBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 12, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: '#F0F0F5', fontFamily: 'SpaceGrotesk_700Bold' },
  bestTag: { backgroundColor: 'rgba(245,166,35,0.12)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  bestTagTxt: { fontSize: 9, color: '#F5A623', fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
  loc: { fontSize: 11, color: '#7A7A95', fontFamily: 'SpaceGrotesk_400Regular' },
  priceCol: { alignItems: 'flex-end' },
  price: { fontSize: 22, color: '#F0F0F5', fontFamily: 'BebasNeue_400Regular' },
  perL: { fontSize: 9, color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular' },
  noData: { textAlign: 'center', color: '#55556A', fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, padding: 20 },
});
