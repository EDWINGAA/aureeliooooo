import { supabase } from './supabaseClient';

/**
 * Crear una nueva cita en Supabase
 * @param {Object} appointmentData - Datos de la cita
 * @returns {Promise} Resultado de la operación
 */
export const createAppointment = async (appointmentData) => {
  try {
    //hola
    // Validar campos requeridos
    const requiredFields = ['appointment_date', 'service_id'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos faltantes: ${missingFields.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          service_id: appointmentData.service_id,
          appointment_date: appointmentData.appointment_date,
          notes: appointmentData.notes || '',
          status: 'pending',
        },
      ])
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error al crear cita:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todas las citas (sin filtro de usuario)
 * @returns {Promise} Array de citas
 */
export const getAllAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        repair_services (id, name, description, estimated_price, estimated_duration)
      `)
      .order('appointment_date', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener citas:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todos los servicios de reparación
 * @returns {Promise} Array de servicios
 */
export const getRepairServices = async () => {
  try {
    const { data, error } = await supabase
      .from('repair_services')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener servicios:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar cita existente
 * @param {string} appointmentId - ID de la cita
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise} Resultado de la operación
 */
export const updateAppointment = async (appointmentId, updates) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId)
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error al actualizar cita:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Cancelar cita
 * @param {string} appointmentId - ID de la cita
 * @returns {Promise} Resultado de la operación
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const result = await updateAppointment(appointmentId, { status: 'cancelled' });
    return result;
  } catch (error) {
    console.error('Error al cancelar cita:', error.message);
    return { success: false, error: error.message };
  }
};
