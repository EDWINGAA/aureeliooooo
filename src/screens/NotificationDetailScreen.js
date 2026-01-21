import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { markNotificationRead } from '../services/notificationService';

const NotificationDetailScreen = ({ route }) => {
  const { notif } = route.params || {};
  const [notification, setNotification] = useState(notif);

  const cleanMessage = (text) => {
    if (!text) return '';
    return text.replace(/\s*\(ID:.*?\)\s*/i, ' ').replace(/\s{2,}/g, ' ').trim();
  };

  useEffect(() => {
    const markRead = async () => {
      if (notification && notification.id && !notification.leido) {
        await markNotificationRead(notification.id);
        setNotification({ ...notification, leido: true });
      }
    };
    markRead();
  }, [notification]);

  if (!notification) {
    return (
      <View style={styles.containerEmpty}>
        <Text style={styles.emptyText}>No se encontró la notificación.</Text>
      </View>
    );
  }

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>{(notification.tipo || 'GENERAL').toUpperCase()}</Text>
        {notification.leido ? <Text style={styles.read}>LEÍDA</Text> : <Text style={styles.unread}>NUEVA</Text>}
      </View>
      <Text style={styles.title}>{notification.titulo}</Text>
      <Text style={styles.date}>{formatFecha(notification.fecha)}</Text>
      <View style={styles.messageBox}>
        <Text style={styles.message}>{cleanMessage(notification.mensaje || notification.message)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    backgroundColor: '#E8F0FF',
    color: '#0050C8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  read: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '700',
  },
  unread: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  message: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationDetailScreen;
