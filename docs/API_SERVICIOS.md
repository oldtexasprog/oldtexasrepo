# 📚 API de Servicios - Old Texas BBQ CRM

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [BaseService](#baseservice)
3. [PedidosService](#pedidosservice)
4. [ProductosService](#productosservice)
5. [UsuariosService](#usuariosservice)
6. [TurnosService](#turnosservice)
7. [RepartidoresService](#repartidoresservice)
8. [NotificacionesService](#notificacionesservice)
9. [ReportesService](#reportesservice)
10. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 Introducción

Todos los servicios del sistema siguen una arquitectura consistente basada en `BaseService`, que proporciona operaciones CRUD genéricas. Cada servicio especializado extiende `BaseService` y agrega métodos específicos de su dominio.

### Convenciones

- Todos los servicios son **singletons** exportados
- Métodos asíncronos retornan `Promise<T>`
- Errores se propagan para ser manejados en la UI
- Todos los servicios validan autenticación internamente

### Importación

```typescript
// Importar servicios
import { pedidosService } from '@/lib/services/pedidos.service';
import { productosService } from '@/lib/services/productos.service';
import { usuariosService } from '@/lib/services/usuarios.service';
// ... etc
```

---

## 🔨 BaseService

Clase base genérica que proporciona operaciones CRUD comunes.

### Tipo Genérico

```typescript
class BaseService<T extends { id: string }>
```

### Métodos CRUD

#### `create(data: Partial<T>): Promise<string>`

Crea un nuevo documento en Firestore.

```typescript
const pedidoId = await pedidosService.create(pedidoData);
```

#### `getById(id: string): Promise<T | null>`

Obtiene un documento por ID.

```typescript
const pedido = await pedidosService.getById('pedido-123');
if (!pedido) throw new Error('Pedido no encontrado');
```

#### `getAll(options?: QueryOptions): Promise<T[]>`

Obtiene todos los documentos con opciones de filtrado.

```typescript
const pedidos = await pedidosService.getAll({
  where: [['estado', '==', 'pendiente']],
  orderBy: [['fechaCreacion', 'desc']],
  limit: 50,
});
```

#### `update(id: string, data: Partial<T>): Promise<void>`

Actualiza un documento existente.

```typescript
await pedidosService.update('pedido-123', {
  estado: 'en_preparacion',
});
```

#### `delete(id: string): Promise<void>`

Elimina (soft delete) un documento.

```typescript
await pedidosService.delete('producto-123');
```

### Métodos de Realtime

#### `onCollectionChange(callback: (data: T[]) => void): Unsubscribe`

Escucha cambios en tiempo real de toda la colección.

```typescript
const unsubscribe = pedidosService.onCollectionChange((pedidos) => {
  console.log('Pedidos actualizados:', pedidos);
});

// Cancelar suscripción
unsubscribe();
```

#### `onDocumentChange(id: string, callback: (data: T | null) => void): Unsubscribe`

Escucha cambios en un documento específico.

```typescript
const unsubscribe = pedidosService.onDocumentChange('pedido-123', (pedido) => {
  if (pedido) {
    console.log('Pedido actualizado:', pedido);
  }
});
```

---

## 📦 PedidosService

Gestiona operaciones de pedidos.

**Ruta**: `/lib/services/pedidos.service.ts`

### Métodos Principales

#### `crearPedidoCompleto(pedido, items): Promise<string>`

Crea un pedido completo con items e historial inicial.

```typescript
const pedidoId = await pedidosService.crearPedidoCompleto(
  {
    canal: 'mostrador',
    cliente: {
      nombre: 'Juan Pérez',
      telefono: '4771234567',
    },
    estado: 'pendiente',
    totales: {
      subtotal: 250,
      envio: 0,
      descuento: 0,
      total: 250,
    },
    pago: {
      metodo: 'efectivo',
      requiereCambio: true,
      montoRecibido: 300,
      cambio: 50,
    },
    turnoId: 'turno-actual',
    creadoPor: 'user-123',
    fechaCreacion: Timestamp.now(),
    fechaActualizacion: Timestamp.now(),
  },
  [
    {
      productoId: 'prod-001',
      nombre: 'Costillas BBQ',
      cantidad: 2,
      precioUnitario: 125,
      subtotal: 250,
    },
  ]
);
```

#### `cambiarEstado(pedidoId, nuevoEstado): Promise<void>`

Cambia el estado de un pedido y registra en historial.

```typescript
await pedidosService.cambiarEstado('pedido-123', 'en_preparacion');
```

#### `asignarRepartidor(pedidoId, repartidorId, comision): Promise<void>`

Asigna un repartidor a un pedido.

```typescript
await pedidosService.asignarRepartidor('pedido-123', 'rep-001', 30);
```

#### `marcarComoEntregado(pedidoId): Promise<void>`

Marca un pedido como entregado.

```typescript
await pedidosService.marcarComoEntregado('pedido-123');
```

#### `cancelarPedido(pedidoId, motivo): Promise<void>`

Cancela un pedido con motivo.

```typescript
await pedidosService.cancelarPedido('pedido-123', 'Cliente canceló');
```

#### `getPedidosPorTurno(turnoId): Promise<Pedido[]>`

Obtiene todos los pedidos de un turno.

```typescript
const pedidos = await pedidosService.getPedidosPorTurno('turno-123');
```

#### `getPedidosPorRepartidor(repartidorId, liquidados?): Promise<Pedido[]>`

Obtiene pedidos asignados a un repartidor.

```typescript
// Pedidos pendientes de liquidar
const pendientes = await pedidosService.getPedidosPorRepartidor('rep-001', false);
```

#### `liquidarPedidos(pedidoIds): Promise<void>`

Marca múltiples pedidos como liquidados.

```typescript
await pedidosService.liquidarPedidos(['pedido-1', 'pedido-2', 'pedido-3']);
```

---

## 🍔 ProductosService

Gestiona el catálogo de productos.

**Ruta**: `/lib/services/productos.service.ts`

### Métodos Principales

#### `getDisponiblesOrdenadosPorMenu(): Promise<Producto[]>`

Obtiene productos disponibles ordenados para el menú.

```typescript
const productos = await productosService.getDisponiblesOrdenadosPorMenu();
```

#### `getPorCategoria(categoriaId): Promise<Producto[]>`

Obtiene productos de una categoría específica.

```typescript
const sandwiches = await productosService.getPorCategoria('cat-sandwiches');
```

#### `toggleDisponibilidad(productoId): Promise<void>`

Alterna la disponibilidad de un producto.

```typescript
await productosService.toggleDisponibilidad('prod-001');
```

#### `toggleDestacado(productoId): Promise<void>`

Marca/desmarca un producto como destacado.

```typescript
await productosService.toggleDestacado('prod-001');
```

#### `duplicarProducto(productoId): Promise<string>`

Duplica un producto para crear variante.

```typescript
const nuevoId = await productosService.duplicarProducto('prod-001');
```

#### `verificarProductoEnPedidosActivos(productoId): Promise<boolean>`

Verifica si un producto está en pedidos activos.

```typescript
const enUso = await productosService.verificarProductoEnPedidosActivos('prod-001');
if (enUso) {
  alert('No se puede eliminar, producto en uso');
}
```

#### `getTopProductos(limit, fechaInicio, fechaFin): Promise<TopProducto[]>`

Obtiene productos más vendidos.

```typescript
const top10 = await productosService.getTopProductos(
  10,
  new Date('2026-01-01'),
  new Date('2026-01-31')
);
```

#### `exportToCSV(productos): string`

Exporta productos a formato CSV.

```typescript
const productos = await productosService.getAll();
const csv = productosService.exportToCSV(productos);
// Descargar archivo
```

#### `importFromCSV(csvContent): Promise<void>`

Importa productos desde CSV.

```typescript
await productosService.importFromCSV(csvContent);
```

---

## 👥 UsuariosService

Gestiona usuarios del sistema.

**Ruta**: `/lib/services/usuarios.service.ts`

### Métodos Principales

#### `getByEmail(email): Promise<Usuario | null>`

Obtiene usuario por email.

```typescript
const usuario = await usuariosService.getByEmail('cajera@oldtexas.com');
```

#### `getByRol(rol): Promise<Usuario[]>`

Obtiene todos los usuarios de un rol.

```typescript
const cajeras = await usuariosService.getByRol('cajera');
```

#### `updateFCMToken(userId, token): Promise<void>`

Actualiza token FCM para notificaciones.

```typescript
await usuariosService.updateFCMToken('user-123', 'fcm-token-abc');
```

#### `removeFCMToken(userId, token): Promise<void>`

Elimina un token FCM.

```typescript
await usuariosService.removeFCMToken('user-123', 'fcm-token-abc');
```

#### `activarDesactivar(userId, activo): Promise<void>`

Activa o desactiva un usuario.

```typescript
await usuariosService.activarDesactivar('user-123', false);
```

---

## 💰 TurnosService

Gestiona turnos y cortes de caja.

**Ruta**: `/lib/services/turnos.service.ts`

### Métodos Principales

#### `getTurnoActual(): Promise<Turno | null>`

Obtiene el turno actualmente abierto.

```typescript
const turnoActual = await turnosService.getTurnoActual();
if (!turnoActual) {
  alert('No hay turno abierto');
}
```

#### `abrirTurno(tipo, cajeroId, fondoInicial): Promise<string>`

Abre un nuevo turno.

```typescript
const turnoId = await turnosService.abrirTurno(
  'matutino',
  'user-123',
  500 // Fondo inicial
);
```

#### `cerrarTurno(turnoId, efectivoReal, observaciones): Promise<void>`

Cierra un turno y genera corte.

```typescript
await turnosService.cerrarTurno('turno-123', 9380, 'Todo correcto');
```

#### `getTurnosPorFecha(fechaInicio, fechaFin): Promise<Turno[]>`

Obtiene turnos en un rango de fechas.

```typescript
const turnos = await turnosService.getTurnosPorFecha(
  new Date('2026-01-01'),
  new Date('2026-01-31')
);
```

#### `generarPDFCorte(turnoId): Promise<Blob>`

Genera PDF del corte de caja.

```typescript
const pdf = await turnosService.generarPDFCorte('turno-123');
// Descargar PDF
```

---

## 🛵 RepartidoresService

Gestiona repartidores.

**Ruta**: `/lib/services/repartidores.service.ts`

### Métodos Principales

#### `getActivos(): Promise<Repartidor[]>`

Obtiene repartidores activos.

```typescript
const repartidores = await repartidoresService.getActivos();
```

#### `getDisponibles(): Promise<Repartidor[]>`

Obtiene repartidores disponibles para asignar.

```typescript
const disponibles = await repartidoresService.getDisponibles();
```

#### `toggleDisponibilidad(repartidorId): Promise<void>`

Alterna disponibilidad de un repartidor.

```typescript
await repartidoresService.toggleDisponibilidad('rep-001');
```

#### `actualizarEstadisticas(repartidorId, completado, cancelado): Promise<void>`

Actualiza estadísticas de entregas.

```typescript
await repartidoresService.actualizarEstadisticas('rep-001', true, false);
```

---

## 🔔 NotificacionesService

Gestiona notificaciones del sistema.

**Ruta**: `/lib/services/notificaciones.service.ts`

### Métodos Principales

#### `notificarRoles(roles, titulo, mensaje, data): Promise<void>`

Envía notificación a usuarios con roles específicos.

```typescript
await notificacionesService.notificarRoles(
  ['cocina'],
  'Nuevo Pedido #42',
  'WhatsApp - 3 items',
  {
    tipo: 'nuevo_pedido',
    pedidoId: 'pedido-123',
    prioridad: 'alta',
  }
);
```

#### `notificarUsuario(userId, titulo, mensaje, data): Promise<void>`

Envía notificación a un usuario específico.

```typescript
await notificacionesService.notificarUsuario(
  'user-123',
  'Turno Cerrado',
  'Corte completado exitosamente',
  { tipo: 'info' }
);
```

#### `marcarComoLeida(notificacionId): Promise<void>`

Marca una notificación como leída.

```typescript
await notificacionesService.marcarComoLeida('notif-123');
```

#### `eliminarNotificacion(notificacionId): Promise<void>`

Elimina una notificación.

```typescript
await notificacionesService.eliminarNotificacion('notif-123');
```

#### `getNoLeidasPorUsuario(userId): Promise<Notificacion[]>`

Obtiene notificaciones no leídas de un usuario.

```typescript
const noLeidas = await notificacionesService.getNoLeidasPorUsuario('user-123');
```

---

## 📊 ReportesService

Genera reportes y estadísticas.

**Ruta**: `/lib/services/reportes.service.ts`

### Métodos Principales

#### `getResumenDiario(fecha): Promise<ResumenDiario>`

Obtiene resumen de ventas del día.

```typescript
const resumen = await reportesService.getResumenDiario(new Date());
```

#### `getVentasPorHora(fecha): Promise<VentasPorHora[]>`

Obtiene distribución de ventas por hora.

```typescript
const ventasPorHora = await reportesService.getVentasPorHora(new Date());
```

#### `getPedidosPorCanal(fechaInicio, fechaFin): Promise<PedidosPorCanal>`

Obtiene distribución de pedidos por canal.

```typescript
const porCanal = await reportesService.getPedidosPorCanal(
  new Date('2026-01-01'),
  new Date('2026-01-31')
);
```

#### `getDesempenoRepartidores(fechaInicio, fechaFin): Promise<DesempenoRepartidor[]>`

Obtiene métricas de repartidores.

```typescript
const desempeno = await reportesService.getDesempenoRepartidores(
  new Date('2026-01-01'),
  new Date('2026-01-31')
);
```

#### `exportarReporte(tipo, datos): Promise<Blob>`

Exporta reporte a Excel.

```typescript
const excel = await reportesService.exportarReporte('ventas-diarias', datos);
// Descargar Excel
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear un Pedido Completo

```typescript
import { pedidosService } from '@/lib/services/pedidos.service';
import { notificacionesService } from '@/lib/services/notificaciones.service';

async function crearPedido(formData: any) {
  try {
    // 1. Crear pedido
    const pedidoId = await pedidosService.crearPedidoCompleto(
      {
        canal: formData.canal,
        cliente: formData.cliente,
        estado: 'pendiente',
        totales: formData.totales,
        pago: formData.pago,
        turnoId: formData.turnoId,
        creadoPor: currentUser.id,
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now(),
      },
      formData.items
    );

    // 2. Notificar a cocina (automático en el servicio)

    // 3. Mostrar confirmación
    toast.success(`Pedido #${pedidoId} creado exitosamente`);

    return pedidoId;
  } catch (error) {
    console.error('Error creando pedido:', error);
    toast.error('Error al crear pedido');
    throw error;
  }
}
```

### Ejemplo 2: Flujo de Cocina

```typescript
import { pedidosService } from '@/lib/services/pedidos.service';
import { usePedidos } from '@/lib/hooks/usePedidos';

function TablroComandas() {
  // Suscripción en tiempo real
  const { pedidos, loading } = usePedidos({
    where: [['estado', 'in', ['pendiente', 'en_preparacion', 'listo']]],
  });

  const handleIniciarPreparacion = async (pedidoId: string) => {
    await pedidosService.cambiarEstado(pedidoId, 'en_preparacion');
    // UI se actualiza automáticamente por realtime
  };

  const handleMarcarListo = async (pedidoId: string) => {
    await pedidosService.cambiarEstado(pedidoId, 'listo');
    // Notifica automáticamente a repartidores
  };

  // ... render
}
```

### Ejemplo 3: Gestión de Productos

```typescript
import { productosService } from '@/lib/services/productos.service';
import { useProductos } from '@/lib/hooks/useProductos';

function GestionProductos() {
  const { productos, loading } = useProductos();

  const handleToggleDisponibilidad = async (productoId: string) => {
    // Verificar si está en pedidos activos
    const enUso = await productosService.verificarProductoEnPedidosActivos(productoId);

    if (enUso) {
      toast.warning('Producto en pedidos activos');
      return;
    }

    await productosService.toggleDisponibilidad(productoId);
    toast.success('Disponibilidad actualizada');
  };

  const handleExportar = async () => {
    const csv = productosService.exportToCSV(productos);
    downloadCSV(csv, 'productos.csv');
  };

  // ... render
}
```

### Ejemplo 4: Corte de Caja

```typescript
import { turnosService } from '@/lib/services/turnos.service';
import { pedidosService } from '@/lib/services/pedidos.service';

async function cerrarTurno(turnoId: string, efectivoReal: number) {
  try {
    // 1. Obtener turno actual
    const turno = await turnosService.getById(turnoId);
    if (!turno) throw new Error('Turno no encontrado');

    // 2. Verificar pedidos pendientes
    const pedidosPendientes = await pedidosService.getPedidosPorTurno(turnoId);
    const tienePendientes = pedidosPendientes.some(
      (p) => !['entregado', 'cancelado'].includes(p.estado)
    );

    if (tienePendientes) {
      throw new Error('Hay pedidos sin completar');
    }

    // 3. Cerrar turno
    await turnosService.cerrarTurno(turnoId, efectivoReal, 'Cierre normal');

    // 4. Generar PDF
    const pdf = await turnosService.generarPDFCorte(turnoId);

    // 5. Descargar
    downloadPDF(pdf, `corte-${turnoId}.pdf`);

    toast.success('Turno cerrado exitosamente');
  } catch (error) {
    toast.error(error.message);
  }
}
```

### Ejemplo 5: Monitoreo de Retrasos

```typescript
import { pedidosService } from '@/lib/services/pedidos.service';
import { notificacionesService } from '@/lib/services/notificaciones.service';

// Hook personalizado para monitorear retrasos
export function useMonitorRetrasos() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const pedidosPendientes = await pedidosService.getAll({
        where: [['estado', 'in', ['pendiente', 'en_preparacion']]],
      });

      const ahora = Date.now();
      const umbral = 30 * 60 * 1000; // 30 minutos

      for (const pedido of pedidosPendientes) {
        const tiempoTranscurrido =
          ahora - pedido.fechaCreacion.toDate().getTime();

        if (tiempoTranscurrido > umbral) {
          // Notificar encargado
          await notificacionesService.notificarRoles(
            ['encargado', 'admin'],
            `⚠️ Pedido #${pedido.numeroPedido} Retrasado`,
            `Lleva ${Math.floor(tiempoTranscurrido / 60000)} minutos`,
            {
              tipo: 'alerta',
              pedidoId: pedido.id,
              prioridad: 'urgente',
            }
          );
        }
      }
    }, 10 * 60 * 1000); // Cada 10 minutos

    return () => clearInterval(interval);
  }, []);
}
```

---

## 🔒 Consideraciones de Seguridad

### Validación de Autenticación

Todos los servicios validan automáticamente:

```typescript
// En BaseService
protected validateAuth(): void {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }
}
```

### Validación de Permisos

Algunos métodos validan permisos por rol:

```typescript
// Solo admin y encargado
if (!['admin', 'encargado'].includes(currentUser.rol)) {
  throw new Error('Permisos insuficientes');
}
```

### Sanitización de Datos

Todos los inputs se sanitizan antes de guardar:

```typescript
import { sanitizeString, sanitizeObject } from '@/lib/utils/validators';

const datosLimpios = sanitizeObject(datosUsuario);
```

---

## 🚀 Mejores Prácticas

### 1. Siempre manejar errores

```typescript
try {
  await pedidosService.create(data);
} catch (error) {
  console.error('Error:', error);
  toast.error('Algo salió mal');
}
```

### 2. Cancelar suscripciones realtime

```typescript
useEffect(() => {
  const unsubscribe = pedidosService.onCollectionChange(callback);
  return () => unsubscribe(); // Cleanup
}, []);
```

### 3. Usar custom hooks

```typescript
// ✅ Mejor
const { pedidos, loading } = usePedidos();

// ❌ Evitar
const [pedidos, setPedidos] = useState([]);
useEffect(() => {
  pedidosService.getAll().then(setPedidos);
}, []);
```

### 4. Optimizar queries

```typescript
// ✅ Con límite
pedidosService.getAll({ limit: 50 });

// ❌ Sin límite (puede ser lento)
pedidosService.getAll();
```

---

## 📖 Referencias

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Esquema de Firestore](./FIRESTORE_SCHEMA.md)

---

**Última actualización**: Enero 2026
**Versión**: 1.0
