# 📚 Servicios CRUD - Documentación

## 🎯 Introducción

Este documento explica la arquitectura de servicios CRUD implementada para Old Texas BBQ CRM. Todos los servicios siguen un patrón consistente basado en una clase base genérica que proporciona operaciones comunes de Firestore.

---

## 🏗️ Arquitectura

### Estructura de Archivos

```
lib/
├── services/
│   ├── base.service.ts              # Clase base genérica
│   ├── usuarios.service.ts          # Servicio de usuarios
│   ├── pedidos.service.ts           # Servicio de pedidos
│   ├── productos.service.ts         # Servicio de productos
│   ├── categorias.service.ts        # Servicio de categorías
│   ├── repartidores.service.ts      # Servicio de repartidores
│   ├── turnos.service.ts            # Servicio de turnos
│   ├── notificaciones.service.ts    # Servicio de notificaciones
│   ├── configuracion.service.ts     # Servicio de configuración
│   └── index.ts                     # Exportación centralizada
├── hooks/
│   ├── usePedidos.ts                # React Query hooks para pedidos
│   ├── useProductos.ts              # React Query hooks para productos
│   └── index.ts                     # Exportación de hooks
└── types/
    └── firestore.ts                 # Tipos TypeScript
```

---

## 🔧 Servicio Base (BaseService)

### Características Principales

La clase `BaseService<T>` proporciona:

- ✅ **CRUD completo**: Create, Read, Update, Delete
- ✅ **Queries avanzadas**: Filtros, ordenamiento, paginación
- ✅ **Operaciones batch**: Actualización/eliminación múltiple
- ✅ **Tiempo real**: Listeners de Firestore
- ✅ **Type-safe**: Totalmente tipado con TypeScript

### Métodos Disponibles

#### Lectura

```typescript
// Obtener por ID
const pedido = await pedidosService.getById('pedido_123');

// Obtener todos
const pedidos = await pedidosService.getAll();

// Obtener con filtros y ordenamiento
const pedidosHoy = await pedidosService.getAll({
  filters: [
    { field: 'estado', operator: '==', value: 'pendiente' }
  ],
  orderByField: 'fechaCreacion',
  orderDirection: 'desc',
  limitCount: 10
});

// Búsqueda con filtros
const pedidosCancelados = await pedidosService.search([
  { field: 'cancelado', operator: '==', value: true }
]);

// Paginación
const { data, lastDoc, hasMore } = await pedidosService.getPaginated({
  limitCount: 20,
  orderByField: 'fechaCreacion',
  orderDirection: 'desc'
});

// Contar documentos
const total = await pedidosService.count();
```

#### Escritura

```typescript
// Crear
const pedidoId = await pedidosService.create({
  canal: 'whatsapp',
  estado: 'pendiente',
  // ... otros campos
});

// Actualizar
await pedidosService.update('pedido_123', {
  estado: 'en_preparacion'
});

// Eliminar
await pedidosService.delete('pedido_123');

// Batch update
await pedidosService.batchUpdate([
  { id: 'pedido_1', data: { estado: 'listo' } },
  { id: 'pedido_2', data: { estado: 'listo' } }
]);

// Batch delete
await pedidosService.batchDelete(['pedido_1', 'pedido_2']);
```

#### Tiempo Real

```typescript
// Escuchar cambios en un documento
const unsubscribe = pedidosService.onDocumentChange(
  'pedido_123',
  (pedido) => {
    console.log('Pedido actualizado:', pedido);
  },
  (error) => {
    console.error('Error:', error);
  }
);

// Escuchar cambios en colección con filtros
const unsubscribe = pedidosService.onCollectionChange(
  (pedidos) => {
    console.log('Pedidos actualizados:', pedidos);
  },
  {
    filters: [{ field: 'estado', operator: '==', value: 'pendiente' }],
    orderByField: 'fechaCreacion'
  }
);

// Siempre limpiar listeners
return () => unsubscribe();
```

---

## 📦 Servicios Específicos

### 1. **pedidosService**

Gestiona pedidos completos con items e historial.

```typescript
import { pedidosService } from '@/lib/services';

// Crear pedido completo con items
const pedidoId = await pedidosService.crearPedidoCompleto(
  {
    canal: 'whatsapp',
    estado: 'pendiente',
    cliente: { nombre: 'Juan', telefono: '555-1234' },
    totales: { subtotal: 200, envio: 50, total: 250 },
    // ...
  },
  [
    {
      productoId: 'prod_1',
      productoNombre: 'Brisket Sandwich',
      cantidad: 2,
      precioUnitario: 100,
      subtotal: 200
    }
  ]
);

// Actualizar estado
await pedidosService.actualizarEstado(
  'pedido_123',
  'en_preparacion',
  'user_id',
  'María González'
);

// Asignar repartidor
await pedidosService.asignarRepartidor(
  'pedido_123',
  'rep_id',
  'Carlos Ramos',
  30,
  'user_id',
  'María González'
);

// Obtener pedido con items
const pedidoCompleto = await pedidosService.getPedidoConItems('pedido_123');

// Obtener historial
const historial = await pedidosService.getHistorial('pedido_123');

// Estadísticas del día
const stats = await pedidosService.getEstadisticasHoy();
```

### 2. **productosService**

Gestiona productos y sus personalizaciones.

```typescript
import { productosService } from '@/lib/services';

// Productos por categoría
const sandwiches = await productosService.getByCategoria('cat_sandwiches');

// Productos disponibles
const disponibles = await productosService.getDisponiblesOrdenadosPorMenu();

// Toggle disponibilidad
await productosService.toggleDisponibilidad('prod_123', false);

// Agregar personalización
await productosService.addPersonalizacion('prod_123', {
  tipo: 'salsa',
  nombre: 'Tipo de salsa',
  opciones: [
    { valor: 'BBQ', precioAdicional: 0, disponible: true },
    { valor: 'Chipotle', precioAdicional: 10, disponible: true }
  ],
  obligatorio: true,
  multipleSeleccion: false
});

// Top productos
const topProducts = await productosService.getTopProductos(10);
```

### 3. **usuariosService**

Gestiona usuarios del sistema.

```typescript
import { usuariosService } from '@/lib/services';

// Usuarios por rol
const cajeras = await usuariosService.getByRol('cajera');

// Usuario por email
const usuario = await usuariosService.getByEmail('maria@oldtexas.com');

// Actualizar última conexión
await usuariosService.updateUltimaConexion('user_123');

// Gestionar FCM tokens
await usuariosService.addFCMToken('user_123', 'fcm_token_abc');

// Estadísticas
const stats = await usuariosService.getEstadisticas();
```

### 4. **turnosService**

Gestiona turnos y cortes de caja.

```typescript
import { turnosService } from '@/lib/services';

// Abrir turno
const turnoId = await turnosService.abrirTurno(
  'matutino',
  'user_123',
  'María González',
  500 // fondo inicial
);

// Obtener turno actual
const turnoActual = await turnosService.getTurnoActual();

// Cerrar turno
await turnosService.cerrarTurno(
  'turno_20251027_matutino',
  9380, // efectivo real
  'Faltante menor',
  'user_enc'
);

// Agregar transacción
await turnosService.addTransaccion('turno_id', {
  tipo: 'gasto',
  monto: 150,
  descripcion: 'Compra de insumos',
  usuarioId: 'user_123'
});
```

### 5. **repartidoresService**

Gestiona repartidores y liquidaciones.

```typescript
import { repartidoresService } from '@/lib/services';

// Repartidores disponibles
const disponibles = await repartidoresService.getDisponibles();

// Toggle disponibilidad
await repartidoresService.toggleDisponibilidad('rep_123', true);

// Incrementar saldo pendiente
await repartidoresService.incrementarSaldoPendiente('rep_123', 30);

// Liquidar
await repartidoresService.liquidarSaldo('rep_123');
```

### 6. **notificacionesService**

Sistema de notificaciones in-app.

```typescript
import { notificacionesService } from '@/lib/services';

// Crear notificación para usuario
await notificacionesService.crearParaUsuario(
  'user_123',
  'nuevo_pedido',
  'Nuevo Pedido #42',
  'Pedido desde WhatsApp',
  'alta',
  'pedido_123'
);

// Crear notificación para rol
await notificacionesService.crearParaRol(
  'cocina',
  'nuevo_pedido',
  'Nuevo Pedido',
  '3 items para preparar'
);

// Marcar como leída
await notificacionesService.marcarComoLeida('notif_123');

// Contar no leídas
const count = await notificacionesService.contarNoLeidas('user_123');
```

---

## ⚛️ React Query Hooks

### Uso con React Query

```typescript
import { usePedidos, useCrearPedido } from '@/lib/hooks';

function MiComponente() {
  // Query
  const { data: pedidos, isLoading, error } = usePedidos();

  // Mutation
  const crearPedido = useCrearPedido();

  const handleCrear = async () => {
    await crearPedido.mutateAsync({
      pedido: { /* ... */ },
      items: [ /* ... */ ]
    });
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {pedidos?.map(pedido => (
        <div key={pedido.id}>{pedido.numeroPedido}</div>
      ))}
    </div>
  );
}
```

### Hooks Tiempo Real

```typescript
import { usePedidosRealTime } from '@/lib/hooks';

function PedidosEnVivo() {
  const { pedidos, loading } = usePedidosRealTime('pendiente');

  return (
    <div>
      {pedidos.map(pedido => (
        <PedidoCard key={pedido.id} pedido={pedido} />
      ))}
    </div>
  );
}
```

---

## 🎨 Patrones de Uso Recomendados

### 1. **Usar servicios directamente para operaciones únicas**

```typescript
// En funciones del servidor, API routes, etc.
import { pedidosService } from '@/lib/services';

export async function crearPedido(data) {
  return await pedidosService.crearPedidoCompleto(data.pedido, data.items);
}
```

### 2. **Usar hooks en componentes React**

```typescript
// En componentes de UI
import { usePedidos } from '@/lib/hooks';

function ListaPedidos() {
  const { data, isLoading } = usePedidos();
  // ...
}
```

### 3. **Usar tiempo real para datos dinámicos**

```typescript
// Para pantallas que necesitan actualizaciones automáticas
import { usePedidosRealTime } from '@/lib/hooks';

function CocinaView() {
  const { pedidos } = usePedidosRealTime('en_preparacion');
  // Se actualiza automáticamente cuando cambian los datos
}
```

---

## 🔒 Seguridad

### Reglas de Firestore

Los servicios están diseñados para trabajar con las reglas de seguridad de Firestore:

```javascript
// Ejemplo de regla para pedidos
match /pedidos/{pedidoId} {
  // Cajeras pueden crear y leer
  allow create: if request.auth.token.rol in ['cajera', 'encargado', 'admin'];

  // Cocina solo puede leer
  allow read: if request.auth.token.rol == 'cocina';

  // Repartidores solo ven sus pedidos
  allow read: if request.auth.token.rol == 'repartidor'
    && resource.data.reparto.repartidorId == request.auth.uid;
}
```

### Validación en Cliente

```typescript
// Siempre validar datos antes de enviar
import { pedidoSchema } from '@/lib/validations';

const validatedData = pedidoSchema.parse(formData);
await pedidosService.create(validatedData);
```

---

## 📊 Performance

### Tips de Optimización

1. **Usa índices compuestos** para queries complejas
2. **Limita resultados** con `limitCount`
3. **Pagina datos grandes** con `getPaginated()`
4. **Cache con React Query** para reducir lecturas
5. **Batch operations** para múltiples updates

```typescript
// ❌ Malo: Múltiples writes individuales
for (const pedido of pedidos) {
  await pedidosService.update(pedido.id, { estado: 'listo' });
}

// ✅ Bueno: Batch update
await pedidosService.batchUpdate(
  pedidos.map(p => ({ id: p.id, data: { estado: 'listo' } }))
);
```

---

## 🧪 Testing

### Ejemplo de test unitario

```typescript
import { pedidosService } from '@/lib/services';

describe('PedidosService', () => {
  it('debe crear un pedido completo', async () => {
    const pedidoId = await pedidosService.crearPedidoCompleto(
      mockPedidoData,
      mockItems
    );

    expect(pedidoId).toBeDefined();

    const pedido = await pedidosService.getById(pedidoId);
    expect(pedido?.estado).toBe('pendiente');
  });
});
```

---

## 🚀 Próximos Pasos

1. ✅ Servicios CRUD implementados
2. ⏳ Crear hooks para servicios restantes
3. ⏳ Implementar reglas de seguridad Firestore
4. ⏳ Agregar tests unitarios
5. ⏳ Crear seed data para desarrollo

---

**Última actualización**: Octubre 27, 2025
**Versión**: 1.0
