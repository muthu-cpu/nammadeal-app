import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  Animated, Linking,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { getTips, OfferTip } from '../../data/offersDB';

interface Props {
  visible: boolean;
  platform: string;       // e.g. "Uber", "Blinkit"
  deepLink: string;       // deep link to open
  playStore?: string;     // fallback
  onClose: () => void;
}

export function OfferSheet({ visible, platform, deepLink, playStore, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const tips: OfferTip[] = getTips(platform);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0, useNativeDriver: true,
        tension: 65, friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300, duration: 200, useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const openApp = async () => {
    onClose();
    try {
      const canOpen = await Linking.canOpenURL(deepLink);
      if (canOpen) { Linking.openURL(deepLink); }
      else if (playStore) { Linking.openURL(playStore); }
    } catch { if (playStore) Linking.openURL(playStore); }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.platform}>{platform}</Text>
              <Text style={styles.subtitle}>
                {tips.length > 0 ? '💡 Tips before you book' : 'Ready to open'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={{ color: Colors.muted2, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tips */}
          {tips.length > 0 && (
            <View style={styles.tipsBox}>
              {tips.map((t, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipIcon}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipLabel}>{t.label}</Text>
                    <Text style={styles.tipText}>{t.tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tips.length === 0 && (
            <View style={styles.noTipBox}>
              <Text style={styles.noTipTxt}>
                Check the offers section inside {platform} for active deals.
              </Text>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity style={styles.openBtn} onPress={openApp}>
            <Text style={styles.openBtnTxt}>Open {platform} →</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Offers are subject to availability. Verify on {platform} before booking.
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, borderWidth: 1, borderColor: Colors.border },
  handle:      { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  platform:    { fontFamily: Fonts.display, fontSize: 22, color: Colors.text },
  subtitle:    { fontSize: 12, color: Colors.muted, fontFamily: Fonts.body, marginTop: 2 },
  closeBtn:    { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  tipsBox:     { backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, gap: 12, marginBottom: 16 },
  tipRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipIcon:     { fontSize: 18, width: 26 },
  tipLabel:    { fontSize: 11, fontFamily: Fonts.bold, color: Colors.primary, marginBottom: 2 },
  tipText:     { fontSize: 12, color: Colors.muted2, fontFamily: Fonts.body, lineHeight: 17 },
  noTipBox:    { backgroundColor: Colors.card2, borderRadius: 12, padding: 14, marginBottom: 16 },
  noTipTxt:    { fontSize: 13, color: Colors.muted2, fontFamily: Fonts.body, textAlign: 'center' },
  openBtn:     { backgroundColor: Colors.primary, borderRadius: 13, padding: 15, alignItems: 'center', marginBottom: 10 },
  openBtnTxt:  { fontSize: 15, fontFamily: Fonts.bold, color: '#000' },
  disclaimer:  { fontSize: 10, color: Colors.muted, fontFamily: Fonts.body, textAlign: 'center' },
});
