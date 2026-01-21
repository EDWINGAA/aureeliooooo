import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { createOrder, addOrderItem } from '../services/orderService';
import { createNotification } from '../services/notificationService';

const CarritoScreen = () => {
  const [processing, setProcessing] = useState(false);
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal,
    getCartItemsCount 
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de finalizar la compra');
      return;
    }

    Alert.alert(
      'Finalizar Compra',
      `Total: $${getCartTotal().toFixed(2)}\n\n¿Deseas proceder con la compra?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setProcessing(true);
              const orderResult = await createOrder({ total_amount: getCartTotal() });
              if (!orderResult.success) {
                throw new Error(orderResult.error || 'No se pudo crear la orden');
              }

              const orderId = orderResult.data.id;
              const itemPromises = cartItems.map((item) =>
                addOrderItem({
                  order_id: orderId,
                  product_id: item.id,
                  quantity: item.quantity,
                  price_at_purchase: item.price,
                })
              );

              const itemResults = await Promise.all(itemPromises);
              const failed = itemResults.find((r) => !r.success);
              if (failed) {
                throw new Error(failed.error || 'No se pudieron registrar los items');
              }

              // Crear notificación en Supabase (best-effort)
              const itemsResumen = cartItems
                .map((item) => {
                  const label = item.nombre || item.name || 'Producto';
                  const price = (item.price ?? 0).toFixed(2);
                  return `${label} x${item.quantity} ($${price})`;
                })
                .join(', ');

              const notifResult = await createNotification({
                type: 'pedido',
                title: 'Compra de accesorios',
                message: `Compra confirmada. Artículos: ${itemsResumen}. Total pagado: $${getCartTotal().toFixed(2)}`,
              });

              if (!notifResult.success) {
                console.warn('No se pudo crear la notificación de pedido:', notifResult.error);
              }

              Alert.alert(
                '¡Pedido Confirmado!',
                'Gracias por tu compra. Te contactaremos pronto para coordinar la entrega.',
                [{ text: 'OK', onPress: () => clearCart() }]
              );
            } catch (error) {
              Alert.alert('Error', error.message || 'No se pudo procesar el pedido');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar Carrito',
      '¿Estás seguro de que deseas eliminar todos los productos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', onPress: () => clearCart(), style: 'destructive' },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Agrega productos desde la tienda de accesorios
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <Text style={styles.headerSubtitle}>
          {processing ? 'Procesando...' : `${getCartItemsCount()} ${getCartItemsCount() === 1 ? 'artículo' : 'artículos'}`}
        </Text>
      </View>

      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}

        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío:</Text>
          <Text style={styles.summaryValue}>Gratis</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${getCartTotal().toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={processing}>
          <Text style={styles.checkoutButtonText}>{processing ? 'Procesando...' : 'Finalizar Compra'}</Text>
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
  itemsList: {
    flex: 1,
    paddingTop: 12,
  },
  clearButton: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 15,
  },
  bottomSpacer: {
    height: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CarritoScreen;
