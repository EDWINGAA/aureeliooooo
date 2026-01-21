import { supabase } from './supabaseClient';

/**
 * Obtener productos desde Supabase
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, category, image_url, stock')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (data || []).map((p) => ({
      id: p.id,
      nombre: p.name,
      descripcion: p.description || '',
      precio: Number(p.price || 0),
      categoria: p.category || 'General',
      imagen: p.image_url || '📦',
      stock: p.stock,
    }));

    return { success: true, data: mapped };
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    return { success: false, error: error.message };
  }
};
