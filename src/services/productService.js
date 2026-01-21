import { supabase } from './supabaseClient';
import { accesoriosData } from '../data/mockData';

// Mapeo de categorías en inglés a español
const categoryMap = {
  'case': 'Fundas',
  'charger': 'Cargadores',
  'glass': 'Cristales',
  'cable': 'Cables',
  'audio': 'Audio',
  'accessory': 'Accesorios',
  'General': 'General',
};

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

    // Si hay datos válidos de Supabase con categorías, usarlos
    if (data && data.length > 0) {
      const mapped = data.map((p) => ({
        id: p.id,
        nombre: p.name,
        descripcion: p.description || '',
        precio: Number(p.price || 0),
        categoria: categoryMap[p.category] || p.category || 'General',
        imagen: p.image_url || '📦',
        stock: p.stock,
      }));

      console.log('Productos de Supabase cargados:', mapped.length);
      return { success: true, data: mapped };
    }

    // Si no hay datos, usar mockData
    console.log('Usando mockData para accesorios');
    return { success: true, data: accesoriosData };
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    console.log('Error - usando mockData como fallback');
    return { success: true, data: accesoriosData };
  }
};
