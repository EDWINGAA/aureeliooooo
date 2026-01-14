import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { accesoriosData } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const AccesoriosScreen = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Fundas', 'Cristales', 'Cargadores', 'Cables', 'Audio', 'Accesorios'];

  const filteredProducts = selectedCategory === 'Todos'
    ? accesoriosData
    : accesoriosData.filter(product => product.categoria === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('¡Agregado!', `${product.nombre} se agregó al carrito`, [
      { text: 'OK' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tienda de Accesorios</Text>
        <Text style={styles.headerSubtitle}>Accesorios premium para tu iPhone</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categorySelector}
        contentContainerStyle={styles.categorySelectorContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.productsCount}>
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
        <View style={styles.bottomSpacer} />
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
  categorySelector: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 60,
  },
  categorySelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    width: 75,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  productsList: {
    flex: 1,
    paddingTop: 16,
  },
  productsCount: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AccesoriosScreen;
