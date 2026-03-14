import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppStore } from '../store/useAppStore';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPinScreen from '../screens/auth/ForgotPinScreen';
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
            <Stack.Screen name="Login"      component={LoginScreen} />
            <Stack.Screen name="Register"   component={RegisterScreen} />
            <Stack.Screen name="ForgotPin"  component={ForgotPinScreen} />
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
