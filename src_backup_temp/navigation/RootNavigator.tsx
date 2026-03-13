import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppStore } from '../store/useAppStore';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { PhoneScreen } from '../screens/auth/PhoneScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MapModal } from '../components/map/MapModal';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { useSubscription } from '../hooks/useSubscription';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';

const Stack = createStackNavigator();

export function RootNavigator() {
  const { userId } = useAppStore();
  const { status, isAccessAllowed } = useSubscription();

  // While checking subscription status — show spinner
  if (userId && status === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userId ? (
          // Not logged in → Auth screens
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Phone"   component={PhoneScreen} />
            <Stack.Screen name="Signup"  component={SignupScreen} />
            <Stack.Screen name="Otp"     component={OtpScreen} />
          </>
        ) : isAccessAllowed ? (
          // Logged in + active trial or subscription → Main app
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        ) : (
          // Logged in but trial expired & no subscription → Paywall
          <Stack.Screen name="Subscribe" component={SubscriptionScreen} />
        )}
      </Stack.Navigator>
      <MapModal />
    </>
  );
}
