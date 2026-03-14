import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppStore } from '../store/useAppStore';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPinScreen from '../screens/auth/ForgotPinScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MapModal } from '../components/map/MapModal';

const Stack = createStackNavigator();

export function RootNavigator() {
  const { userId } = useAppStore();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userId ? (
          <>
            <Stack.Screen name="Login"     component={LoginScreen} />
            <Stack.Screen name="Register"  component={RegisterScreen} />
            <Stack.Screen name="ForgotPin" component={ForgotPinScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
      <MapModal />
    </>
  );
}
