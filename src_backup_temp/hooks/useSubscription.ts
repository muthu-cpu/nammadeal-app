/**
 * useSubscription hook
 * ─────────────────────────────────────────────────────────────
 * LAUNCH POLICY:
 *   • Before June 1, 2026  → ALL users get full free access
 *   • After  June 1, 2026  → 3-day trial, then ₹5/month
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_TRIAL_START = '@nammadeal_trial_start';
const KEY_SUBSCRIBED  = '@nammadeal_subscribed';
const KEY_SUB_EXPIRY  = '@nammadeal_sub_expiry';

const TRIAL_DAYS     = 3;
const FREE_UNTIL     = new Date('2026-06-01T00:00:00+05:30'); // June 1, 2026 IST

export type SubStatus = 'loading' | 'free_launch' | 'trial' | 'active' | 'expired';

export function useSubscription() {
  const [status,   setStatus]   = useState<SubStatus>('loading');
  const [expiry,   setExpiry]   = useState<Date | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);

  const checkStatus = useCallback(async () => {
    try {
      // ── LAUNCH FREE PERIOD ────────────────────────────────
      if (new Date() < FREE_UNTIL) {
        const daysToFreeEnd = Math.ceil((FREE_UNTIL.getTime() - Date.now()) / 86400000);
        setStatus('free_launch');
        setExpiry(FREE_UNTIL);
        setDaysLeft(daysToFreeEnd);
        return;
      }

      // ── After June 1: check paid subscription ─────────────
      const isSubbed  = await AsyncStorage.getItem(KEY_SUBSCRIBED);
      const expiryStr = await AsyncStorage.getItem(KEY_SUB_EXPIRY);
      if (isSubbed === 'true' && expiryStr) {
        const exp = new Date(expiryStr);
        if (exp > new Date()) {
          setStatus('active');
          setExpiry(exp);
          setDaysLeft(Math.ceil((exp.getTime() - Date.now()) / 86400000));
          return;
        }
        await AsyncStorage.multiRemove([KEY_SUBSCRIBED, KEY_SUB_EXPIRY]);
      }

      // ── Check / start free trial ──────────────────────────
      let trialStart = await AsyncStorage.getItem(KEY_TRIAL_START);
      if (!trialStart) {
        trialStart = new Date().toISOString();
        await AsyncStorage.setItem(KEY_TRIAL_START, trialStart);
      }
      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

      if (new Date() < trialEnd) {
        setStatus('trial');
        setExpiry(trialEnd);
        setDaysLeft(Math.ceil((trialEnd.getTime() - Date.now()) / 86400000));
      } else {
        setStatus('expired');
        setExpiry(null);
        setDaysLeft(0);
      }
    } catch {
      // Fail open — give access rather than wrongly block a user
      setStatus('free_launch');
      setDaysLeft(0);
    }
  }, []);

  useEffect(() => { checkStatus(); }, []);

  const activateSubscription = useCallback(async () => {
    const exp = new Date();
    exp.setDate(exp.getDate() + 30);
    await AsyncStorage.setItem(KEY_SUBSCRIBED, 'true');
    await AsyncStorage.setItem(KEY_SUB_EXPIRY, exp.toISOString());
    setStatus('active');
    setExpiry(exp);
    setDaysLeft(30);
  }, []);

  const cancelSubscription = useCallback(async () => {
    await AsyncStorage.multiRemove([KEY_SUBSCRIBED, KEY_SUB_EXPIRY]);
    await checkStatus();
  }, [checkStatus]);

  // free_launch, trial, and active all allow full access
  const isAccessAllowed = status !== 'loading' && status !== 'expired';

  return {
    status,          // 'loading' | 'free_launch' | 'trial' | 'active' | 'expired'
    isAccessAllowed,
    expiry,
    daysLeft,
    freeUntil: FREE_UNTIL,
    activateSubscription,
    cancelSubscription,
    checkStatus,
  };
}
