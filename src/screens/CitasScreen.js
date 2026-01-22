import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getRepairServices } from '../services/appointmentService';
import { createAppointment } from '../services/appointmentService';
import { createNotification } from '../services/notificationService';

const CitasScreen = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    servicio_id: '',
    comentarios: '',
  });

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [showServicesPicker, setShowServicesPicker] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Cargar servicios al montar el componente
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        
        // Obtener servicios de reparación
        const servicesResult = await getRepairServices();
        if (servicesResult.success) {
          setServices(servicesResult.data);
        }
      } catch (error) {
        console.error('Error cargando servicios:', error);
        Alert.alert('Error', 'No se pudieron cargar los servicios disponibles');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

 const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      // Obtener el año actual
      const currentYear = new Date().getFullYear();
      const selectedYear = selectedDate.getFullYear();
      
      // Si la fecha seleccionada es del año actual, permitirla
      // Si es de otro año, forzar al año actual
      if (selectedYear === currentYear) {
        setDate(selectedDate);
      } else {
        // Crear una nueva fecha con el mismo día y mes pero del año actual
        const correctedDate = new Date(selectedDate);
        correctedDate.setFullYear(currentYear);
        setDate(correctedDate);
      }
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      // Validar que la hora esté entre 10 AM (10) y 6 PM (18)
      const hour = selectedTime.getHours();
      if (hour >= 10 && hour < 18) {
        // Establecer minutos en 0 (solo horas en punto)
        const adjustedTime = new Date(selectedTime);
        adjustedTime.setMinutes(0);
        adjustedTime.setSeconds(0);
        setTime(adjustedTime);
      } else {
        Alert.alert('Horario no disponible', 'Las citas deben ser entre las 10:00 AM y las 6:00 PM');
      }
    }
  };

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!formData.nombre || !formData.telefono || !formData.servicio_id) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      // Combinar fecha y hora
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(time.getHours());
      appointmentDateTime.setMinutes(time.getMinutes());

      // Crear cita en Supabase
      const result = await createAppointment({
        service_id: formData.servicio_id,
        appointment_date: appointmentDateTime.toISOString(),
        notes: `Cliente: ${formData.nombre}\nTeléfono: ${formData.telefono}\nEmail: ${formData.email || 'No proporcionado'}\n${formData.comentarios}`,
      });

      if (result.success) {
        // Notificación: cita agendada
        const fechaTexto = `${date.toLocaleDateString('es-ES')} ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const serviceName = selectedService?.name || 'Servicio de reparación';
        const notifResult = await createNotification({
          type: 'cita',
          title: 'Cita de reparación agendada',
          message: `Cita programada: ${serviceName} el ${fechaTexto}. Cliente: ${formData.nombre}, Tel: ${formData.telefono}. Te contactaremos para confirmar la disponibilidad.`,
        });

        if (!notifResult.success) {
          console.warn('No se pudo crear la notificación de cita:', notifResult.error);
        }

        Alert.alert(
          '¡Cita Agendada!',
          `Tu cita ha sido registrada para ${date.toLocaleDateString('es-ES')} a las ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.\n\nTe contactaremos pronto para confirmar.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  nombre: '',
                  telefono: '',
                  email: '',
                  servicio_id: '',
                  comentarios: '',
                });
                setSelectedService(null);
                setDate(new Date());
                setTime(new Date());
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo agendar la cita');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
        <Text style={styles.headerSubtitle}>Reserva tu hora de reparación</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Información Personal */}
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            editable={!loading}
          />

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 1234567890 (10 dígitos)"
            value={formData.telefono}
            onChangeText={(text) => {
              // Solo permitir números y máximo 10 dígitos
              const numericValue = text.replace(/[^0-9]/g, '');
              if (numericValue.length <= 10) {
                setFormData({ ...formData, telefono: numericValue });
              }
            }}
            keyboardType="number-pad"
            maxLength={10}
            editable={!loading}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Detalles del Servicio */}
          <Text style={styles.sectionTitle}>Detalles del Servicio</Text>

          <Text style={styles.label}>Servicio requerido *</Text>
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => setShowServicesPicker(true)}
            disabled={loading}
          >
            <Text style={styles.serviceButtonText}>
              {selectedService ? selectedService.name : '📋 Selecciona un servicio'}
            </Text>
          </TouchableOpacity>

          {selectedService && (
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceInfoText}>
                Precio estimado: ${selectedService.estimated_price}
              </Text>
              <Text style={styles.serviceInfoText}>
                Duración: {selectedService.estimated_duration}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Comentarios adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el problema o comentarios adicionales"
            value={formData.comentarios}
            onChangeText={(text) => setFormData({ ...formData, comentarios: text })}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          {/* Fecha y Hora */}
          <Text style={styles.sectionTitle}>Fecha y Hora</Text>

          <Text style={styles.label}>Fecha preferida</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
          >
            <Text style={styles.dateButtonText}>
              📅 {date.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
              maximumDate={new Date(new Date().getFullYear(), 11, 31)}
            />
          )}


          <Text style={styles.label}>Hora preferida</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
            disabled={loading}
          >
            <Text style={styles.dateButtonText}>
              ⏰ {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <Modal
              visible={showTimePicker}
              transparent
              animationType="fade"
            >
              <View style={styles.pickerContainer}>
                <View style={styles.pickerContent}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Selecciona una hora</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.pickerCloseButton}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={Array.from({ length: 8 }, (_, i) => ({ 
                      hour: 10 + i, 
                      id: String(10 + i) 
                    }))}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.timeOption,
                          time.getHours() === item.hour && styles.timeOptionActive
                        ]}
                        onPress={() => {
                          const newTime = new Date(time);
                          newTime.setHours(item.hour, 0, 0);
                          setTime(newTime);
                          setShowTimePicker(false);
                        }}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          time.getHours() === item.hour && styles.timeOptionTextActive
                        ]}>
                          {String(item.hour).padStart(2, '0')}:00
                        </Text>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                  />
                </View>
              </View>
            </Modal>
          )}

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Procesando...' : 'Confirmar Cita'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            * Campos obligatorios. Te contactaremos para confirmar la disponibilidad.
          </Text>
        </View>
      </ScrollView>

      {/* Modal de Servicios */}
      <Modal visible={showServicesPicker} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona un servicio</Text>
            <TouchableOpacity onPress={() => setShowServicesPicker(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceOption}
                onPress={() => {
                  setSelectedService(item);
                  setFormData({ ...formData, servicio_id: item.id });
                  setShowServicesPicker(false);
                }}
              >
                <Text style={styles.serviceOptionName}>{item.name}</Text>
                <Text style={styles.serviceOptionDesc}>{item.description}</Text>
                <View style={styles.serviceOptionFooter}>
                  <Text style={styles.serviceOptionPrice}>${item.estimated_price}</Text>
                  <Text style={styles.serviceOptionDuration}>{item.estimated_duration}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    zIndex: 999,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  serviceButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    justifyContent: 'center',
  },
  serviceButtonText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  serviceInfo: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  serviceInfoText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
  },
  dateButtonText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    paddingHorizontal: 12,
  },
  serviceOption: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 16,
  },
  serviceOptionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  serviceOptionDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  serviceOptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceOptionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  serviceOptionDuration: {
    fontSize: 12,
    color: '#999',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  status_pending: {
    backgroundColor: '#FFF3CD',
  },
  status_confirmed: {
    backgroundColor: '#D4EDDA',
  },
  status_completed: {
    backgroundColor: '#D1ECF1',
  },
  status_cancelled: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  appointmentNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  timePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  pickerCloseButton: {
    fontSize: 24,
    color: '#666',
  },
  pickerDoneButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  picker: {
    height: 200,
  },
  timeOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeOptionActive: {
    backgroundColor: '#f0f7ff',
  },
  timeOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  timeOptionTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
});

export default CitasScreen;
