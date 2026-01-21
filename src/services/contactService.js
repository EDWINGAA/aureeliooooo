import { supabase } from './supabaseClient';

/**
 * Obtiene la información de contacto desde la tabla contact_info.
 * Se espera al menos un registro.
 */
export const getContactInfo = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('phone, whatsapp, address, schedule, email')
      .limit(1)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        telefono: data.phone || '',
        whatsapp: data.whatsapp || data.phone || '',
        direccion: data.address || '',
        horario: data.schedule || '',
        email: data.email || '',
      },
    };
  } catch (error) {
    console.error('Error al obtener contacto:', error.message);
    return { success: false, error: error.message };
  }
};
