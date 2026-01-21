import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ServiceCard = ({ servicio, modelo, onPress }) => {
  const name = servicio.nombre || servicio.name;
  const price = servicio.precio ?? servicio.estimated_price ?? 0;
  const time = servicio.tiempo || servicio.estimated_duration || 'Tiempo estimado no disponible';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{name}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.time}>⏱️ {time}</Text>
        {modelo ? <Text style={styles.model}>📱 {modelo}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34C759',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 13,
    color: '#666',
  },
  model: {
    fontSize: 13,
    color: '#888',
  },
});

export default ServiceCard;
