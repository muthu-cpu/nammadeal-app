import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import RidesScreen from '../screens/RidesScreen';
import GroceryScreen from '../screens/GroceryScreen';
import { FoodScreen } from '../screens/FoodScreen';
import { PharmaScreen } from '../screens/PharmaScreen';
import TravelsScreen from '../screens/TravelsScreen';
import { FuelScreen } from '../screens/FuelScreen';
import { OffersScreen } from '../screens/OffersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RouteFinderScreen from '../screens/RouteFinderScreen';
import { AppHeader } from '../components/layout/AppHeader';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Rides',  label: 'Rides',  icon: '🚗', screen: RidesScreen },
  { name: 'Grocery',label: 'Grocery',icon: '🛒', screen: GroceryScreen },
  { name: 'Food',   label: 'Food',   icon: '🍔', screen: FoodScreen },
  { name: 'Routes', label: 'Routes', icon: '🗺️', screen: RouteFinderScreen },
  { name: 'Pharma', label: 'Pharma', icon: '💊', screen: PharmaScreen },
  { name: 'Travels',label: 'Travels',icon: '✈️', screen: TravelsScreen },
  { name: 'Offers', label: 'Offers', icon: '🏷️', screen: OffersScreen, badge: '14' },
  { name: 'Profile',label: 'Profile',icon: '👤', screen: ProfileScreen },
];

function TabIcon({ icon, focused, badge }: { icon: string; focused: boolean; badge?: string }) {
  return (
    <View style={[styles.iconWrap, focused && styles.activeWrap]}>
      <Text style={styles.iconEmoji}>{icon}</Text>
      {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
    </View>
  );
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <AppHeader />,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#55556A',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.screen}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={tab.icon} focused={focused} badge={tab.badge} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(8,8,10,0.97)',
    borderTopColor: '#1E1E26',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 16,
  },
  tabLabel: { fontSize: 9, fontFamily: 'SpaceGrotesk_400Regular' },
  iconWrap: {
    width: 34, height: 24, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  activeWrap: { backgroundColor: 'rgba(245,166,35,0.12)' },
  iconEmoji: { fontSize: 16 },
  badge: {
    position: 'absolute', top: -3, right: -4,
    backgroundColor: '#EF4444', borderRadius: 7,
    minWidth: 13, height: 13,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2,
  },
  badgeText: { color: '#fff', fontSize: 7, fontWeight: '800' },
});
