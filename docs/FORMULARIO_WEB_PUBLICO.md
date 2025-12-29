# 🌐 Formulario Web Público - Documentación

## 📋 Descripción General

El **Formulario Web Público** es una interfaz pública (sin autenticación) que permite a los clientes realizar pedidos directamente desde cualquier navegador sin necesidad de crear cuenta o iniciar sesión.

**URL:** `/pedir`

---

## 🎯 Características Principales

### 1. Acceso Público

- ✅ **Sin autenticación** - Los clientes no necesitan cuenta
- ✅ **Responsive** - Funciona en móviles, tablets y desktop
- ✅ **SEO optimizado** - Metadata configurada para búsquedas

### 2. Flujo de Pedido en 4 Pasos

```
PASO 1: Catálogo
   ↓
PASO 2: Carrito
   ↓
PASO 3: Datos y Pago
   ↓
PASO 4: Confirmación
```

### 3. Notificaciones Automáticas

- 🔔 **Cajera:** Recibe notificación de nuevo pedido web
- 🔔 **Cocina:** Recibe orden para preparar
- 🔔 **Prioridad:** Alta para ambos roles

---

## 🏗️ Arquitectura

### Componentes Principales

```
app/pedir/page.tsx
└── FormularioPedidoPublico.tsx (contenedor principal)
    ├── CatalogoProductos.tsx (paso 1)
    ├── CarritoPedidoPublico.tsx (paso 2)
    ├── DatosClientePublico.tsx (paso 3)
    │   └── SelectorColoniaPublico.tsx
    └── ConfirmacionPedido.tsx (paso 4)
```

### Servicio Especializado

- **`pedidosPublicos.service.ts`**
  - Crea pedidos sin autenticación
  - Usa 'sistema-web' como creador
  - Notifica automáticamente a cajera y cocina
  - Maneja errores con mensajes amigables

---

## 📱 PASO 1: Catálogo de Productos

### Características

- **Búsqueda:** Buscar productos por nombre o descripción
- **Filtros:** Filtrar por categoría
- **Cards atractivas:** Con fotos, precio, promociones
- **Badges visuales:**
  - 🔥 Promoción (rojo)
  - ⭐ Destacado (amarillo)

### Funcionalidad

- Clic en "Agregar" → Producto se agrega al carrito
- Toast de confirmación al agregar
- Contador de productos en carrito (badge)
- Botón flotante en móvil para ver carrito

### Código de Ejemplo

```tsx
// Agregar producto al carrito
const handleAgregarProducto = (producto: Producto) => {
  setCarrito((prev) => {
    const existente = prev.find((item) => item.productoId === producto.id);

    if (existente) {
      // Incrementar cantidad si ya existe
      return prev.map((item) =>
        item.productoId === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: item.precio * (item.cantidad + 1),
            }
          : item
      );
    }

    // Agregar nuevo producto
    return [
      ...prev,
      {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        foto: producto.foto,
        subtotal: producto.precio,
      },
    ];
  });
};
```

---

## 🛒 PASO 2: Carrito de Compras

### Características

- **Editar cantidad:** Botones +/- o input directo
- **Eliminar productos:** Botón de basura
- **Ver personalizaciones:** Si existen
- **Resumen:** Subtotal actualizado en tiempo real

### Validaciones

- Cantidad mínima: 1
- Subtotal calculado automáticamente
- Botón "Continuar" solo habilitado si hay productos

---

## 📝 PASO 3: Datos del Cliente y Pago

### Secciones

#### 3.1 Datos de Contacto

- **Nombre completo** (requerido)
- **Teléfono** (requerido, formato: 878-123-4567)

#### 3.2 Dirección de Entrega

- **Calle y número** (requerido)
- **Colonia** (selector con colonias activas, requerido)
  - Muestra costo de envío de cada colonia
  - Al seleccionar, actualiza automáticamente el costo de envío
- **Referencias** (opcional)

#### 3.3 Método de Pago

Opciones:

1. **Efectivo** 💵
   - Campo adicional: "¿Con cuánto vas a pagar?"
   - Calcula y muestra el cambio automáticamente
   - Validación: monto >= total

2. **Tarjeta** 💳
   - Paga con tarjeta al recibir

3. **Transferencia** 📱
   - Transferencia bancaria

### Cálculos Automáticos

```tsx
const total = subtotal + costoEnvio;

const cambio =
  metodoPago === 'efectivo' && montoPagado > total
    ? montoPagado - total
    : 0;
```

### Validaciones del Formulario

```tsx
const puedeEnviar =
  datosCliente.nombre &&
  datosCliente.telefono &&
  datosCliente.direccion &&
  datosCliente.coloniaId &&
  datosCliente.metodoPago &&
  carrito.length > 0 &&
  (metodoPago !== 'efectivo' || montoPagado >= total);
```

---

## ✅ PASO 4: Confirmación

### Información Mostrada

- ✅ **Número de pedido** (grande y destacado)
- ✅ **Referencia** (últimos 8 caracteres del ID)
- ✅ **Tiempo estimado** (45-60 min)
- ✅ **Total del pedido**
- ✅ **Teléfono de contacto**

### Instrucciones

1. Cocina está preparando tu pedido
2. Repartidor recogerá y entregará
3. Te contactamos si necesitamos confirmar algo
4. ¡Disfruta tu BBQ!

### Acciones

- **Hacer Otro Pedido** → Reinicia el formulario
- **Imprimir Confirmación** → window.print()

---

## 🔧 Servicio de Pedidos Públicos

### Funcionalidades

```typescript
// lib/services/pedidosPublicos.service.ts

class PedidosPublicosService {
  /**
   * Crea un pedido desde el formulario web público
   */
  async crearPedidoPublico(
    pedidoData: Omit<NuevoPedido, 'numeroPedido' | 'turnoId'>,
    items: Omit<ItemPedido, 'id'>[]
  ): Promise<{ pedidoId: string; numeroPedido: number }> {
    // 1. Obtener siguiente número de pedido
    const numeroPedido = await this.getNextNumeroPedido();

    // 2. Obtener turno activo (si existe)
    let turnoId = 'sin-turno';
    // ... buscar turno activo

    // 3. Crear pedido principal
    const pedidoId = await addDoc(pedidosRef, {
      ...pedidoData,
      numeroPedido,
      turnoId,
      creadoPor: 'sistema-web',
    });

    // 4. Agregar items en subcolección
    // ... batch write de items

    // 5. Agregar historial
    // ... entrada de historial

    // 6. 🔔 Notificar a cajera y cocina
    await notificacionesService.crearParaRol('cajera', ...);
    await notificacionesService.crearParaRol('cocina', ...);

    return { pedidoId, numeroPedido };
  }
}
```

### Seguridad

- ✅ Elimina campos `undefined` (Firebase no los acepta)
- ✅ Validación de teléfono
- ✅ Sanitización de nombre y dirección
- ✅ Manejo de errores con mensajes amigables

---

## 🎨 Diseño UI/UX

### Paleta de Colores

- **Primario:** Rojo (BBQ branding) `bg-red-600`
- **Secundario:** Naranja/Dorado (acentos)
- **Fondo:** Gradiente suave `from-orange-50 via-white to-red-50`
- **Texto:** Gris oscuro `text-gray-900`

### Componentes Visuales

#### Header

```tsx
<header className="bg-gradient-to-r from-red-900 to-red-700 text-white">
  <h1 className="text-4xl font-bold">🍖 Old Texas BBQ</h1>
  <p>Auténtico sabor del sur de Texas</p>
</header>
```

#### Indicador de Pasos

- Círculos numerados (1, 2, 3)
- Color rojo cuando activo
- Verde cuando completado
- Gris cuando pendiente

#### Cards de Producto

- Imagen grande (h-48)
- Hover con escala 110%
- Badges flotantes (promoción, destacado)
- Botón "Agregar" prominente

---

## 📊 Métricas y Analytics

### Eventos a Trackear

1. **Inicio de pedido:** Usuario llega a `/pedir`
2. **Producto agregado:** Cada vez que agregan un producto
3. **Paso completado:** Cada vez que avanzan de paso
4. **Pedido enviado:** Al finalizar exitosamente
5. **Error en formulario:** Cuando hay validaciones fallidas

### KPIs Importantes

- **Tasa de conversión:** Visitantes → Pedidos completados
- **Productos promedio por pedido**
- **Tiempo promedio en completar pedido**
- **Tasa de abandono por paso**

---

## 🐛 Manejo de Errores

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "No se pudo crear pedido" | Firebase sin conexión | Verificar internet |
| "Selecciona una colonia" | Falta seleccionar colonia | Validación visual |
| "Monto insuficiente" | Efectivo < total | Indicar monto mínimo |
| "Productos no disponibles" | Firestore vacío | Seed data de productos |

### Estrategia de Errores

```tsx
try {
  await pedidosPublicosService.crearPedidoPublico(...);
  toast.success('¡Pedido recibido con éxito!');
} catch (error: any) {
  console.error('Error enviando pedido:', error);
  toast.error(
    error?.message ||
      'Error al enviar el pedido. Llámanos al 878-XXX-XXXX'
  );
}
```

---

## 🧪 Testing

### Testing Manual

1. **Flujo completo:**
   - Agregar 3 productos
   - Editar cantidades
   - Eliminar 1 producto
   - Completar datos
   - Enviar pedido
   - Verificar confirmación

2. **Validaciones:**
   - Intentar enviar sin datos
   - Efectivo con monto menor al total
   - Dirección sin colonia

3. **Responsive:**
   - Probar en móvil (iPhone, Android)
   - Probar en tablet
   - Probar en desktop

### Testing con Cypress (Futuro)

```javascript
describe('Formulario Pedido Público', () => {
  it('debe completar pedido exitosamente', () => {
    cy.visit('/pedir');

    // Agregar productos
    cy.get('[data-testid="producto-card"]').first().click();
    cy.get('[data-testid="btn-agregar"]').click();

    // Ir al carrito
    cy.get('[data-testid="btn-carrito"]').click();

    // Continuar a datos
    cy.get('[data-testid="btn-continuar"]').click();

    // Llenar formulario
    cy.get('[data-testid="input-nombre"]').type('Juan Pérez');
    cy.get('[data-testid="input-telefono"]').type('878-123-4567');
    // ...

    // Enviar pedido
    cy.get('[data-testid="btn-enviar"]').click();

    // Verificar confirmación
    cy.contains('Pedido Confirmado').should('be.visible');
  });
});
```

---

## 🚀 Deploy y Configuración

### Variables de Entorno Necesarias

```env
# Firebase (ya configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Rutas Públicas

Asegúrate de que `/pedir` NO esté protegida por middleware:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const publicPaths = ['/login', '/pedir', '/', '/recuperar-password'];

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // ... autenticación
}
```

---

## 📚 Documentos Relacionados

- `docs/TODO.md` - Estado general del proyecto
- `docs/NOTIFICACIONES_TRIGGERS.md` - Sistema de notificaciones
- `lib/types/firestore.ts` - Tipos de datos
- `lib/services/pedidos.service.ts` - Servicio principal de pedidos

---

## 🎯 Próximos Pasos Sugeridos

1. **Agregar personalización de productos**
   - Modal para salsas, extras, presentación

2. **Implementar tracking en tiempo real**
   - Cliente puede ver estado de su pedido

3. **Sistema de cupones/descuentos**
   - Códigos promocionales en formulario

4. **Integración con WhatsApp**
   - Confirmar pedido vía WhatsApp automáticamente

5. **App móvil (PWA)**
   - Instalar como app en móvil
   - Notificaciones push del estado

---

**Fecha de implementación:** Diciembre 2025
**Desarrollado por:** Jarvis (Agent Manager) + Claude Code
**Versión:** 1.0
