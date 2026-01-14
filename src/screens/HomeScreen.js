import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { contactoData } from '../data/mockData';

const HomeScreen = ({ navigation }) => {
  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${contactoData.whatsapp}`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${contactoData.telefono}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>iPhone Repair Center</Text>
          <Text style={styles.headerSubtitle}>Especialistas en iPhone y Accesorios</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#34C759' }]}
            onPress={() => navigation.navigate('Fixes')}
          >
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={styles.actionTitle}>Fixes</Text>
            <Text style={styles.actionSubtitle}>Ver servicios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#007AFF' }]}
            onPress={() => navigation.navigate('Accesorios')}
          >
            <Text style={styles.actionIcon}>🛍️</Text>
            <Text style={styles.actionTitle}>Accesorios</Text>
            <Text style={styles.actionSubtitle}>Catálogo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FF9500' }]}
            onPress={() => navigation.navigate('Citas')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionTitle}>Agendar Cita</Text>
            <Text style={styles.actionSubtitle}>Reserva tu hora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FF3B30' }]}
            onPress={() => navigation.navigate('Carrito')}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionTitle}>Mi Carrito</Text>
            <Text style={styles.actionSubtitle}>Ver compras</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>¿Por qué elegirnos?</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Repuestos originales y garantizados</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Reparación rápida (mayoría en el día)</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Garantía de 90 días</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👨‍🔧</Text>
            <Text style={styles.featureText}>Técnicos certificados</Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contáctanos</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>📍 {contactoData.direccion}</Text>
            <Text style={styles.contactText}>⏰ {contactoData.horario}</Text>
            <Text style={styles.contactText}>📧 {contactoData.email}</Text>
          </View>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.contactButtonText}>📞 Llamar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
  },
  contactSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default HomeScreen;
