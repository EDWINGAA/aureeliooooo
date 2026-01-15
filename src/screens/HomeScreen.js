import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
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

        {/* Sección integrada: Contacto + Imagen */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contáctanos</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{contactoData.direccion}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{contactoData.horario}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{contactoData.email}</Text>
            </View>
          </View>

          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" style={styles.iconButton} />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color="#fff" style={styles.iconButton} />
              <Text style={styles.contactButtonText}>Llamar</Text>
            </TouchableOpacity>
          </View>

          <Image source={require('../../assets/appleimg.jpg')} style={styles.image} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9b0b8',
  },
  header: {
    backgroundColor: '#666',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  contactSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#258ad3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  iconButton: {
    marginRight: 2,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    resizeMode: 'contain',
    borderRadius: 12,
  },
});

export default HomeScreen;
