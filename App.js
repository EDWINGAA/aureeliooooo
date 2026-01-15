import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartProvider, useCart } from './src/context/CartContext';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

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
          backgroundColor: '#F2F2F7',  // Fondo gris claro estilo Apple
          borderTopWidth: 0.5,
          borderTopColor: '#C6C6C8',
          height: 85,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: '#F2F2F7',
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: '#C6C6C8',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: '#1D1D1F',
        },
        headerTintColor: '#1D1D1F',
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Inicio',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Fixes"
        component={ReparacionesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Reparaciones',
        }}
      />
      <Tab.Screen
        name="Accesorios"
        component={AccesoriosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-handle-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Accesorios',
        }}
      />
      <Tab.Screen
        name="Citas"
        component={CitasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Citas',
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={CarritoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart-outline" size={size} color={color} />
              {cartCount > 0 && <TabBarBadge count={cartCount} />}
            </View>
          ),
          tabBarLabel: 'Carrito',
          tabBarBadgeStyle: {
            backgroundColor: '#FF3B30',
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: '700',
            color: '#fff',
            top: -5,
            right: -8,
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
    top: -3,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
