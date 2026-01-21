import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import ServiceCard from '../components/ServiceCard';
import { getRepairServices } from '../services/appointmentService';

const ReparacionesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getRepairServices();
      if (result.success) {
        setServices(result.data || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servicios de Reparación</Text>
        <Text style={styles.headerSubtitle}>Servicios disponibles en tienda</Text>
      </View>

      <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.servicesTitle}>{loading ? 'Cargando servicios...' : 'Servicios disponibles'}</Text>
        {services.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No hay servicios disponibles.</Text>
        ) : (
          services.map((servicio) => (
            <ServiceCard
              key={servicio.id}
              servicio={servicio}
              onPress={() => navigation.navigate('Citas')}
            />
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Citas')}
        >
          <Text style={styles.ctaButtonText}>Agendar Cita de Reparación</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modelSelector: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 60,
  },
  modelSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  modelButton: {
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    width: 70,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelButtonActive: {
    backgroundColor: '#007AFF',
  },
  modelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  modelButtonTextActive: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenuModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: '80%',
    maxHeight: 300,
    overflow: 'hidden',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#e7f3ff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#007AFF',
    fontWeight: '700',
  },
  servicesList: {
    flex: 1,
    paddingTop: 16,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  bottomSpacer: {
    height: 20,
  },
  ctaContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReparacionesScreen;
