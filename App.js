import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartProvider, useCart } from './src/context/CartContext';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ReparacionesScreen from './src/screens/ReparacionesScreen';
import AccesoriosScreen from './src/screens/AccesoriosScreen';
import CitasScreen from './src/screens/CitasScreen';
import CarritoScreen from './src/screens/CarritoScreen';
import NotificacionesScreen from './src/screens/NotificacionesScreen';
import NotificationDetailScreen from './src/screens/NotificationDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Header superior personalizado
const TopHeader = ({ navigation }) => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  return (
    <View style={styles.topHeader}>
      <View style={styles.topHeaderContent}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Notificaciones')}
        >
          <Ionicons name="notifications-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Carrito')}
        >
          <View>
            <Ionicons name="cart-outline" size={22} color="#007AFF" />
            {cartCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Tab Navigator
const TabNavigator = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <TopHeader navigation={navigation} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#F2F2F7',
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
            headerShown: false,
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
            headerShown: false,
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
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

// Main App Component
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="Notificaciones"
            component={NotificacionesScreen}
            options={{ headerShown: true, title: 'Notificaciones' }}
          />
          <Stack.Screen
            name="Carrito"
            component={CarritoScreen}
            options={{ headerShown: true, title: 'Mi Carrito' }}
          />
          <Stack.Screen
            name="NotificationDetail"
            component={NotificationDetailScreen}
            options={{ headerShown: true, title: 'Detalle de notificación' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
    paddingTop: 30,
  },
  topHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  headerButton: {
    padding: 3,
  },
  headerBadge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
