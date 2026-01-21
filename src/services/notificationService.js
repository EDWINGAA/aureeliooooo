import { supabase } from './supabaseClient';

/**
 * Obtener notificaciones más recientes
 */
export const getNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, message, created_at, read')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener notificaciones:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Crear una notificación
 */
export const createNotification = async ({ type = 'general', title, message }) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ type, title, message }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al crear notificación:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Marcar una notificación como leída
 */
export const markNotificationRead = async (id) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error al marcar notificación:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllNotificationsRead = async () => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .not('id', 'is', null); // required filter to satisfy PostgREST

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error al marcar todas:', error.message);
    return { success: false, error: error.message };
  }
};
