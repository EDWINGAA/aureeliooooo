import { supabase } from './supabaseClient';

/**
 * Crear una nueva orden
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise} Resultado de la operación
 */
export const createOrder = async (orderData) => {
  try {
    const requiredFields = ['total_amount'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos faltantes: ${missingFields.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          total_amount: orderData.total_amount,
          status: 'cart',
        },
      ])
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error al crear orden:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Agregar producto a una orden
 * @param {Object} itemData - Datos del item
 * @returns {Promise} Resultado de la operación
 */
export const addOrderItem = async (itemData) => {
  try {
    const requiredFields = ['order_id', 'product_id', 'price_at_purchase'];
    const missingFields = requiredFields.filter(field => !itemData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos faltantes: ${missingFields.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('order_items')
      .insert([
        {
          order_id: itemData.order_id,
          product_id: itemData.product_id,
          quantity: itemData.quantity || 1,
          price_at_purchase: itemData.price_at_purchase,
        },
      ])
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error al agregar item a orden:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todas las órdenes
 * @returns {Promise} Array de órdenes
 */
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          products (id, name, price)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener órdenes:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar estado de orden
 * @param {string} orderId - ID de la orden
 * @param {string} status - Nuevo estado (cart, pending, completed, cancelled)
 * @returns {Promise} Resultado de la operación
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error al actualizar orden:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Eliminar item de una orden
 * @param {string} itemId - ID del item
 * @returns {Promise} Resultado de la operación
 */
export const removeOrderItem = async (itemId) => {
  try {
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar item:', error.message);
    return { success: false, error: error.message };
  }
};
