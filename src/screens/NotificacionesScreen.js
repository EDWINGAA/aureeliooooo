// NotificacionesScreen.js - Pantalla opcional para mostrar notificaciones
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService';

const NotificacionesScreen = ({ navigation }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fromSupabase, setFromSupabase] = useState(false);

  // Evita que se muestren restos antiguos de "(ID: ...)" en mensajes guardados previamente
  const cleanMessage = (text) => {
    if (!text) return '';
    return text.replace(/\s*\(ID:.*?\)\s*/i, ' ').replace(/\s{2,}/g, ' ').trim();
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    const result = await getNotifications();
    if (result.success && result.data) {
      const mapped = result.data.map((n) => ({
        id: n.id,
        tipo: n.type || 'general',
        titulo: n.title,
        mensaje: cleanMessage(n.message),
        fecha: n.created_at,
        leido: !!n.read,
      }));
      setNotificaciones(mapped);
      setFromSupabase(true);
    } else {
      setNotificaciones([]);
      setFromSupabase(false);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getIconForType = (tipo) => {
    switch (tipo) {
      case 'reparacion': return '🔧';
      case 'pedido': return '📦';
      case 'cita': return '📅';
      case 'promo': return '🎉';
      default: return '🔔';
    }
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Hace menos de una hora';
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };


  const handleMarkAll = async () => {
    if (!fromSupabase) return;
    const res = await markAllNotificationsRead();
    if (!res.success) {
      Alert.alert('Error', res.error || 'No se pudieron marcar como leídas');
      return;
    }
    loadData();
  };

  const handlePress = async (notif) => {
    if (fromSupabase) {
      await markNotificationRead(notif.id);
    }
    setNotificaciones((prev) => prev.map((n) => (n.id === notif.id ? { ...n, leido: true } : n)));
    navigation.navigate('NotificationDetail', { notif: { ...notif, leido: true } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMarkAll}>
          <Text style={styles.markAllRead}>Marcar todas como leídas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => loadData(true)}>
          <Text style={styles.refresh}>Recargar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#007AFF" size="large" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
          }
        >
          {notificaciones.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notificationCard,
                !notif.leido && styles.notificationUnread,
              ]}
              onPress={() => handlePress(notif)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getIconForType(notif.tipo)}</Text>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.badgeRow}>
                  <Text style={styles.badge}>{notif.tipo?.toUpperCase() || 'GENERAL'}</Text>
                </View>
                <Text style={styles.titulo}>{notif.titulo}</Text>
                <Text style={styles.mensaje} numberOfLines={2}>
                  {notif.mensaje}
                </Text>
                <Text style={styles.fecha}>{formatFecha(notif.fecha)}</Text>
              </View>
              {!notif.leido && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  markAllRead: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
  refresh: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationUnread: {
    backgroundColor: '#f0f7ff',
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#E8F0FF',
    color: '#0050C8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  mensaje: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    alignSelf: 'center',
  },
  loader: {
    marginTop: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default NotificacionesScreen;
