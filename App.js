import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartProvider, useCart } from './src/context/CartContext';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ReparacionesScreen from './src/screens/ReparacionesScreen';
import AccesoriosScreen from './src/screens/AccesoriosScreen';
import CitasScreen from './src/screens/CitasScreen';
import CarritoScreen from './src/screens/CarritoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Badge Component
const TabBarBadge = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
};

// Tab Navigator
const TabNavigator = () => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          borderTopColor: '#e0e0e0',
          height: 80,
          paddingBottom: 16,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size }}>🏠</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Fixes"
        component={ReparacionesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size }}>🔧</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Accesorios"
        component={AccesoriosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size }}>🛍️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Citas"
        component={CitasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={CarritoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Text style={{ fontSize: size }}>🛒</Text>
              {cartCount > 0 && <TabBarBadge count={cartCount} />}
            </View>
          ),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FF3B30',
            color: '#fff',
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
