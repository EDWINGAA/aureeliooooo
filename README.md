# 🍎 Tienda de Reparación de iPhone - App Móvil

Aplicación móvil multiplataforma desarrollada con React Native y Expo para una tienda especializada en reparación de iPhone y venta de accesorios.

## 📋 Características

- **Catálogo de Reparaciones**: Visualiza servicios de reparación disponibles para diferentes modelos de iPhone con precios y tiempos estimados
- **Tienda de Accesorios**: Catálogo completo de productos (fundas, cargadores, cristales templados, etc.) con sistema de filtrado por categorías
- **Carrito de Compras**: Gestión completa de productos con contador de items y cálculo de totales
- **Sistema de Citas**: Formulario para agendar reparaciones con selección de fecha y hora
- **Contacto Directo**: Botones funcionales para contactar vía WhatsApp y llamadas telefónicas
- **Interfaz Moderna**: Diseño limpio y profesional con navegación por tabs

## 🛠️ Stack Tecnológico

- **React Native** con Expo (Managed Workflow)
- **React Navigation** (Stack & Bottom Tabs)
- **Context API** para gestión de estado
- **React Hooks** para lógica de componentes
- **StyleSheet** para estilos nativos

## 📁 Estructura del Proyecto

```
aureeliooooo/
├── App.js                          # Punto de entrada y configuración de navegación
├── package.json                    # Dependencias del proyecto
├── app.json                        # Configuración de Expo
├── babel.config.js                 # Configuración de Babel
├── assets/                         # Recursos (iconos, splash screen)
└── src/
    ├── components/                 # Componentes reutilizables
    │   ├── CartItem.js            # Item del carrito
    │   ├── ProductCard.js         # Tarjeta de producto
    │   └── ServiceCard.js         # Tarjeta de servicio
    ├── context/                    # Context API
    │   └── CartContext.js         # Contexto del carrito de compras
    ├── data/                       # Datos mock
    │   └── mockData.js            # Catálogos y datos de ejemplo
    └── screens/                    # Pantallas principales
        ├── HomeScreen.js          # Pantalla de inicio
        ├── ReparacionesScreen.js  # Catálogo de reparaciones
        ├── AccesoriosScreen.js    # Tienda de accesorios
        ├── CitasScreen.js         # Agendamiento de citas
        └── CarritoScreen.js       # Carrito de compras
```

## 🚀 Instalación y Configuración

### Variables de entorno (Supabase)
- Copia `.env.example` a `.env` y define `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Tablas esperadas: `products`, `orders`, `order_items`, `repair_services`, `appointments`, `notifications`.
- La app consume datos de Supabase para productos, servicios, pedidos, citas y notificaciones; el contacto se mantiene en el frontend.

### Prerrequisitos

1. **Node.js** (v14 o superior)
2. **npm** o **yarn**
3. **Expo CLI** instalado globalmente:
   ```bash
   npm install -g expo-cli
   ```
4. **Expo Go** app en tu dispositivo móvil:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Pasos de Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   # o
   expo start
   ```

3. **Ejecutar en tu dispositivo**:
   - Escanea el código QR con la app **Expo Go**
   - En iOS: usa la cámara del iPhone
   - En Android: usa el lector QR de Expo Go

### Comandos Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run android    # Abre en emulador Android
npm run ios        # Abre en simulador iOS (solo Mac)
npm run web        # Abre en navegador web
```

## 📱 Funcionalidades por Pantalla

### 🏠 Inicio (HomeScreen)
- Botones de acceso rápido a todas las secciones
- Información sobre la tienda
- Ventajas y características del servicio
- Datos de contacto
- Botones funcionales de WhatsApp y llamadas

### 🔧 Reparaciones (ReparacionesScreen)
- Selector de modelos de iPhone
- Lista de servicios disponibles por modelo
- Precios y tiempos estimados
- Acceso directo al agendamiento de citas

### 🛍️ Accesorios (AccesoriosScreen)
- Catálogo completo de productos
- Filtros por categoría (Fundas, Cristales, Cargadores, etc.)
- Botón "Agregar al carrito" en cada producto
- Contador de productos en la vista

### 📅 Citas (CitasScreen)
- Formulario completo de contacto
- Selector de fecha con calendario
- Selector de hora
- Campos para especificar modelo y servicio
- Validación de campos obligatorios

### 🛒 Carrito (CarritoScreen)
- Lista de productos agregados
- Control de cantidad (+/-)
- Eliminación de items
- Cálculo automático de totales
- Botón de finalizar compra
- Vista de carrito vacío

## 🎨 Personalización

### Modificar Datos Mock

Edita `src/data/mockData.js` para cambiar:
- Modelos de iPhone disponibles
- Servicios de reparación y precios
- Catálogo de accesorios
- Información de contacto

### Cambiar Colores

Los colores principales están definidos en los StyleSheet de cada componente:
- **Primario**: `#007AFF` (azul iOS)
- **Éxito**: `#34C759` (verde)
- **Peligro**: `#FF3B30` (rojo)
- **Advertencia**: `#FF9500` (naranja)

### Agregar Nuevas Pantallas

1. Crea un nuevo archivo en `src/screens/`
2. Impórtalo en `App.js`
3. Agrégalo al Stack o Tab Navigator

## 📞 Configuración de Contacto

Para que funcionen los botones de contacto, modifica en `src/data/mockData.js`:

```javascript
export const contactoData = {
  telefono: '+1234567890',      // Tu número de teléfono
  whatsapp: '+1234567890',      // Tu WhatsApp (con código de país)
  direccion: 'Tu dirección',
  horario: 'Tu horario',
  email: 'tu@email.com'
};
```

## 🔧 Solución de Problemas

### Error al escanear el código QR
- Asegúrate de que tu dispositivo y computadora estén en la misma red WiFi
- Intenta usar el modo Tunnel: `expo start --tunnel`

### Errores de dependencias
```bash
# Limpiar cache y reinstalar
rm -rf node_modules
npm install
expo start -c
```

### Problemas con DateTimePicker
El componente está instalado pero requiere permisos en dispositivos reales. Asegúrate de aceptar los permisos cuando se soliciten.

## 📝 Próximas Mejoras

- [ ] Integración con backend real
- [ ] Autenticación de usuarios
- [ ] Pasarela de pago
- [ ] Notificaciones push
- [ ] Sistema de tracking de reparaciones
- [ ] Chat en vivo
- [ ] Galería de imágenes reales de productos
- [ ] Sistema de valoraciones y reseñas

## 🤝 Contribuir

Este es un proyecto de demostración. Para uso en producción, considera:
- Implementar un backend con API REST
- Agregar manejo de errores robusto
- Implementar tests unitarios y de integración
- Optimizar imágenes y recursos
- Agregar analytics

## 📄 Licencia

Proyecto de demostración - Libre para uso educativo

## 👨‍💻 Desarrollado con

- React Native
- Expo SDK 50
- React Navigation 6
- JavaScript ES6+

---

**Nota**: Esta aplicación utiliza datos mock para demostración. Para producción, integra con un backend real y servicios de pago.
