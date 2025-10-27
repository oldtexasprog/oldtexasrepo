# 🗄️ Esquema de Base de Datos Firestore - Old Texas BBQ CRM

## 📋 Índice

- [Colecciones Principales](#colecciones-principales)
- [Estructura de Datos](#estructura-de-datos)
- [Índices Compuestos](#índices-compuestos)
- [Reglas de Seguridad](#reglas-de-seguridad)
- [Relaciones entre Colecciones](#relaciones-entre-colecciones)

---

## 🎯 Colecciones Principales

### Jerarquía de Colecciones

```
/usuarios
/pedidos
  /pedidos/{pedidoId}/items (subcolección)
  /pedidos/{pedidoId}/historial (subcolección)
/productos
  /productos/{productoId}/personalizaciones (subcolección)
/categorias
/repartidores
/turnos
  /turnos/{turnoId}/transacciones (subcolección)
/notificaciones
/configuracion
```

---

## 📊 Estructura de Datos

### 1. Colección: `usuarios`

**Propósito**: Almacenar información de usuarios del sistema (personal del restaurante)

**Ruta**: `/usuarios/{userId}`

```typescript
interface Usuario {
  // Identificación
  id: string; // UID de Firebase Auth
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;

  // Rol y permisos
  rol: 'admin' | 'encargado' | 'cajera' | 'cocina' | 'repartidor';
  activo: boolean;

  // Turnos (solo para cajeras)
  turnoPreferido?: 'matutino' | 'vespertino';

  // Metadata
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  creadoPor: string; // userId del admin que lo creó
  ultimaConexion: Timestamp;

  // FCM para notificaciones
  fcmTokens: string[]; // Permite múltiples dispositivos
}
```

**Ejemplo de documento**:

```json
{
  "id": "user_abc123",
  "email": "maria.cajera@oldtexas.com",
  "nombre": "María",
  "apellido": "González",
  "telefono": "+52 555 123 4567",
  "rol": "cajera",
  "activo": true,
  "turnoPreferido": "matutino",
  "fechaCreacion": "2025-10-20T08:00:00Z",
  "fechaActualizacion": "2025-10-27T14:30:00Z",
  "creadoPor": "admin_xyz789",
  "ultimaConexion": "2025-10-27T14:30:00Z",
  "fcmTokens": ["token123abc", "token456def"]
}
```

---

### 2. Colección: `pedidos`

**Propósito**: Almacenar todos los pedidos del restaurante

**Ruta**: `/pedidos/{pedidoId}`

```typescript
interface Pedido {
  // Identificación
  id: string; // Auto-generado por Firestore
  numeroPedido: number; // Consecutivo diario (ej: 1, 2, 3...)

  // Origen del pedido
  canal: 'whatsapp' | 'mostrador' | 'uber' | 'didi' | 'llamada' | 'web';

  // Cliente
  cliente: {
    nombre: string;
    telefono: string; // Encriptado en producción
    direccion?: string;
    colonia?: string;
    referencia?: string;
  };

  // Estado del pedido
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'en_reparto' | 'entregado' | 'cancelado';

  // Items (referencia a subcolección)
  // Los items están en /pedidos/{pedidoId}/items

  // Totales
  totales: {
    subtotal: number;
    envio: number;
    descuento: number;
    total: number;
  };

  // Pago
  pago: {
    metodo: 'efectivo' | 'tarjeta' | 'transferencia' | 'uber' | 'didi';
    requiereCambio: boolean;
    montoRecibido?: number;
    cambio?: number;
    pagoAdelantado: boolean; // Para reparto
    comprobantePago?: string; // URL si es transferencia
  };

  // Reparto
  reparto?: {
    repartidorId: string;
    repartidorNombre: string;
    comisionRepartidor: number;
    estadoReparto: 'asignado' | 'recogido' | 'en_camino' | 'entregado';
    horaAsignacion: Timestamp;
    horaRecogida?: Timestamp;
    horaEntrega?: Timestamp;
    liquidado: boolean;
    fechaLiquidacion?: Timestamp;
  };

  // Observaciones
  observaciones?: string;
  observacionesInternas?: string;

  // Timestamps
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  horaRecepcion: Timestamp;
  horaInicioCocina?: Timestamp;
  horaListo?: Timestamp;
  horaEntrega?: Timestamp;

  // Metadata
  creadoPor: string; // userId de la cajera
  turnoId: string; // ID del turno en que se creó
  cancelado: boolean;
  motivoCancelacion?: string;
}
```

**Subcolección**: `/pedidos/{pedidoId}/items`

```typescript
interface ItemPedido {
  id: string; // Auto-generado
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;

  // Personalizaciones
  personalizaciones?: {
    salsa?: string[];
    presentacion?: string; // 'comer_aqui' | 'llevar'
    temperatura?: string; // 'caliente' | 'frio'
    extras?: string[];
    sinIngredientes?: string[];
  };

  notas?: string;
}
```

**Subcolección**: `/pedidos/{pedidoId}/historial`

```typescript
interface HistorialPedido {
  id: string;
  timestamp: Timestamp;
  accion: 'creado' | 'actualizado' | 'cambio_estado' | 'asignado' | 'cancelado';
  estadoAnterior?: string;
  estadoNuevo?: string;
  usuarioId: string;
  usuarioNombre: string;
  detalles?: string;
}
```

**Ejemplo de documento**:

```json
{
  "id": "pedido_20251027_001",
  "numeroPedido": 42,
  "canal": "whatsapp",
  "cliente": {
    "nombre": "Juan Pérez",
    "telefono": "+52 555 987 6543",
    "direccion": "Calle Reforma 123",
    "colonia": "Centro",
    "referencia": "Casa azul, portón negro"
  },
  "estado": "en_preparacion",
  "totales": {
    "subtotal": 350,
    "envio": 50,
    "descuento": 0,
    "total": 400
  },
  "pago": {
    "metodo": "efectivo",
    "requiereCambio": true,
    "montoRecibido": 500,
    "cambio": 100,
    "pagoAdelantado": false
  },
  "reparto": {
    "repartidorId": "rep_123",
    "repartidorNombre": "Carlos Ramos",
    "comisionRepartidor": 30,
    "estadoReparto": "asignado",
    "horaAsignacion": "2025-10-27T15:00:00Z",
    "liquidado": false
  },
  "observaciones": "Sin cebolla por favor",
  "fechaCreacion": "2025-10-27T14:45:00Z",
  "fechaActualizacion": "2025-10-27T15:00:00Z",
  "horaRecepcion": "2025-10-27T14:45:00Z",
  "horaInicioCocina": "2025-10-27T14:50:00Z",
  "creadoPor": "user_abc123",
  "turnoId": "turno_20251027_matutino",
  "cancelado": false
}
```

---

### 3. Colección: `productos`

**Propósito**: Catálogo de productos del restaurante

**Ruta**: `/productos/{productoId}`

```typescript
interface Producto {
  // Identificación
  id: string;
  sku?: string; // Código interno
  nombre: string;
  descripcion: string;

  // Categorización
  categoriaId: string;
  categoriaNombre: string;
  subcategoria?: string;

  // Precio
  precio: number;
  precioPromocion?: number;
  enPromocion: boolean;

  // Disponibilidad
  disponible: boolean;
  stock?: number; // Opcional, para control de inventario
  stockMinimo?: number;

  // Multimedia
  imagen?: string; // URL de Cloudinary
  imagenes?: string[]; // Múltiples ángulos

  // Personalizaciones disponibles
  permitePersonalizacion: boolean;
  // Las personalizaciones están en subcolección

  // Metadata
  popularidad: number; // Para ordenar en el menú
  orden: number; // Orden de visualización
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  creadoPor: string;

  // SEO (para formulario web)
  etiquetas?: string[];
  ingredientes?: string[];
}
```

**Subcolección**: `/productos/{productoId}/personalizaciones`

```typescript
interface PersonalizacionProducto {
  id: string;
  tipo: 'salsa' | 'extra' | 'presentacion' | 'temperatura' | 'modificador';
  nombre: string;
  opciones: {
    valor: string;
    precioAdicional: number;
    disponible: boolean;
  }[];
  obligatorio: boolean;
  multipleSeleccion: boolean;
  maximoSelecciones?: number;
}
```

**Ejemplo de documento**:

```json
{
  "id": "prod_brisket_sandwich",
  "sku": "BBQ-001",
  "nombre": "Brisket Sandwich",
  "descripcion": "Delicioso sándwich de brisket ahumado 12 horas con salsa BBQ",
  "categoriaId": "cat_sandwiches",
  "categoriaNombre": "Sándwiches",
  "precio": 180,
  "enPromocion": false,
  "disponible": true,
  "imagen": "https://res.cloudinary.com/oldtexas/brisket-sandwich.jpg",
  "permitePersonalizacion": true,
  "popularidad": 95,
  "orden": 1,
  "fechaCreacion": "2025-10-20T08:00:00Z",
  "fechaActualizacion": "2025-10-27T10:00:00Z",
  "creadoPor": "admin_xyz789",
  "etiquetas": ["bbq", "brisket", "popular", "especialidad"],
  "ingredientes": ["brisket", "pan brioche", "cebolla morada", "pepinillos"]
}
```

---

### 4. Colección: `categorias`

**Propósito**: Organizar productos por categorías

**Ruta**: `/categorias/{categoriaId}`

```typescript
interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string; // Nombre del icono de lucide-react
  color?: string; // Color hex para la UI
  orden: number;
  activa: boolean;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
}
```

**Ejemplo de documento**:

```json
{
  "id": "cat_sandwiches",
  "nombre": "Sándwiches",
  "descripcion": "Deliciosos sándwiches de carne ahumada",
  "icono": "Sandwich",
  "color": "#D97706",
  "orden": 1,
  "activa": true,
  "fechaCreacion": "2025-10-20T08:00:00Z",
  "fechaActualizacion": "2025-10-20T08:00:00Z"
}
```

---

### 5. Colección: `repartidores`

**Propósito**: Información de repartidores (pueden o no ser usuarios del sistema)

**Ruta**: `/repartidores/{repartidorId}`

```typescript
interface Repartidor {
  // Identificación
  id: string;
  usuarioId?: string; // Si tiene cuenta en el sistema
  nombre: string;
  apellido: string;
  telefono: string;

  // Estado
  activo: boolean;
  disponible: boolean; // Si está disponible para tomar pedidos

  // Comisiones
  comisionPorDefecto: number;
  tipoComision: 'fijo' | 'porcentaje';

  // Estadísticas
  pedidosCompletados: number;
  pedidosCancelados: number;
  calificacionPromedio?: number;

  // Liquidación
  saldoPendiente: number; // Monto que debe entregar
  ultimaLiquidacion?: Timestamp;

  // Metadata
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  creadoPor: string;
}
```

**Ejemplo de documento**:

```json
{
  "id": "rep_123",
  "usuarioId": "user_rep456",
  "nombre": "Carlos",
  "apellido": "Ramos",
  "telefono": "+52 555 111 2222",
  "activo": true,
  "disponible": true,
  "comisionPorDefecto": 30,
  "tipoComision": "fijo",
  "pedidosCompletados": 245,
  "pedidosCancelados": 3,
  "calificacionPromedio": 4.8,
  "saldoPendiente": 1250,
  "ultimaLiquidacion": "2025-10-26T20:00:00Z",
  "fechaCreacion": "2025-09-01T08:00:00Z",
  "fechaActualizacion": "2025-10-27T15:00:00Z",
  "creadoPor": "admin_xyz789"
}
```

---

### 6. Colección: `turnos`

**Propósito**: Registro de turnos y cortes de caja

**Ruta**: `/turnos/{turnoId}`

```typescript
interface Turno {
  // Identificación
  id: string; // ej: "turno_20251027_matutino"
  tipo: 'matutino' | 'vespertino';
  fecha: string; // "YYYY-MM-DD"

  // Responsables
  cajeroId: string;
  cajeroNombre: string;
  encargadoId?: string;
  encargadoNombre?: string;

  // Horarios
  horaInicio: Timestamp;
  horaFin?: Timestamp;

  // Estado
  estado: 'abierto' | 'cerrado';

  // Fondos
  fondoInicial: number;

  // Resumen de ventas
  resumen: {
    totalPedidos: number;
    totalVentas: number;

    // Por método de pago
    efectivo: number;
    tarjeta: number;
    transferencia: number;
    uber: number;
    didi: number;

    // Otros
    totalEnvios: number;
    totalDescuentos: number;
    totalComisionesRepartidores: number;
  };

  // Corte de caja
  corte?: {
    efectivoEsperado: number;
    efectivoReal: number;
    diferencia: number; // positivo = sobrante, negativo = faltante
    observaciones?: string;
    cerradoPor: string;
    horaCierre: Timestamp;
  };

  // Metadata
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
}
```

**Subcolección**: `/turnos/{turnoId}/transacciones`

```typescript
interface TransaccionTurno {
  id: string;
  tipo: 'venta' | 'gasto' | 'retiro' | 'ajuste';
  monto: number;
  metodoPago?: string;
  pedidoId?: string;
  descripcion: string;
  timestamp: Timestamp;
  usuarioId: string;
}
```

**Ejemplo de documento**:

```json
{
  "id": "turno_20251027_matutino",
  "tipo": "matutino",
  "fecha": "2025-10-27",
  "cajeroId": "user_abc123",
  "cajeroNombre": "María González",
  "encargadoId": "user_enc789",
  "encargadoNombre": "Roberto Martínez",
  "horaInicio": "2025-10-27T08:00:00Z",
  "horaFin": "2025-10-27T16:00:00Z",
  "estado": "cerrado",
  "fondoInicial": 500,
  "resumen": {
    "totalPedidos": 87,
    "totalVentas": 15840,
    "efectivo": 8900,
    "tarjeta": 4200,
    "transferencia": 1200,
    "uber": 980,
    "didi": 560,
    "totalEnvios": 2350,
    "totalDescuentos": 120,
    "totalComisionesRepartidores": 890
  },
  "corte": {
    "efectivoEsperado": 9400,
    "efectivoReal": 9380,
    "diferencia": -20,
    "observaciones": "Faltante menor, probablemente cambio mal dado",
    "cerradoPor": "user_enc789",
    "horaCierre": "2025-10-27T16:15:00Z"
  },
  "fechaCreacion": "2025-10-27T08:00:00Z",
  "fechaActualizacion": "2025-10-27T16:15:00Z"
}
```

---

### 7. Colección: `notificaciones`

**Propósito**: Sistema de notificaciones in-app

**Ruta**: `/notificaciones/{notificacionId}`

```typescript
interface Notificacion {
  // Identificación
  id: string;

  // Destinatario
  usuarioId?: string; // Si es para un usuario específico
  rol?: string; // Si es para todos de un rol (ej: "cocina")

  // Contenido
  tipo: 'nuevo_pedido' | 'pedido_listo' | 'pedido_entregado' | 'pedido_cancelado' | 'alerta' | 'info';
  titulo: string;
  mensaje: string;

  // Referencia
  pedidoId?: string;
  turnoId?: string;

  // Estado
  leida: boolean;
  fechaLeida?: Timestamp;

  // Prioridad
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente';

  // Metadata
  timestamp: Timestamp;
  expiraEn?: Timestamp; // Auto-eliminar después de X tiempo
}
```

**Ejemplo de documento**:

```json
{
  "id": "notif_abc123",
  "rol": "cocina",
  "tipo": "nuevo_pedido",
  "titulo": "Nuevo Pedido #42",
  "mensaje": "WhatsApp - 3 items - Mesa para llevar",
  "pedidoId": "pedido_20251027_001",
  "leida": false,
  "prioridad": "normal",
  "timestamp": "2025-10-27T14:45:00Z",
  "expiraEn": "2025-10-28T14:45:00Z"
}
```

---

### 8. Colección: `configuracion`

**Propósito**: Configuración global del sistema

**Ruta**: `/configuracion/{configId}`

```typescript
interface Configuracion {
  id: string; // Identificador del setting
  categoria: 'general' | 'pedidos' | 'reparto' | 'pagos' | 'notificaciones';

  // Valor (puede ser de cualquier tipo)
  valor: any;

  // Metadata
  descripcion: string;
  tipo: 'string' | 'number' | 'boolean' | 'array' | 'object';
  editable: boolean; // Si se puede editar desde la UI

  fechaActualizacion: Timestamp;
  actualizadoPor: string;
}
```

**Documentos de ejemplo**:

```json
// Configuración de comisión de reparto por defecto
{
  "id": "comision_reparto_default",
  "categoria": "reparto",
  "valor": 30,
  "descripcion": "Comisión por defecto para repartidores (en pesos)",
  "tipo": "number",
  "editable": true,
  "fechaActualizacion": "2025-10-20T08:00:00Z",
  "actualizadoPor": "admin_xyz789"
}

// Configuración de costo de envío por zona
{
  "id": "costo_envio_zonas",
  "categoria": "reparto",
  "valor": {
    "centro": 40,
    "norte": 50,
    "sur": 60,
    "fuera_zona": 80
  },
  "descripcion": "Costo de envío por zona geográfica",
  "tipo": "object",
  "editable": true,
  "fechaActualizacion": "2025-10-20T08:00:00Z",
  "actualizadoPor": "admin_xyz789"
}

// Horarios de operación
{
  "id": "horarios_operacion",
  "categoria": "general",
  "valor": {
    "matutino": { "inicio": "08:00", "fin": "16:00" },
    "vespertino": { "inicio": "16:00", "fin": "23:00" }
  },
  "descripcion": "Horarios de turnos del restaurante",
  "tipo": "object",
  "editable": true,
  "fechaActualizacion": "2025-10-20T08:00:00Z",
  "actualizadoPor": "admin_xyz789"
}
```

---

## 🔗 Relaciones entre Colecciones

```
usuarios (1) -----> (N) pedidos [creadoPor]
usuarios (1) -----> (N) turnos [cajeroId]
repartidores (1) --> (N) pedidos [repartidorId]
productos (1) -----> (N) items [productoId]
categorias (1) ----> (N) productos [categoriaId]
turnos (1) --------> (N) pedidos [turnoId]
pedidos (1) -------> (N) items [subcolección]
pedidos (1) -------> (N) historial [subcolección]
productos (1) -----> (N) personalizaciones [subcolección]
turnos (1) --------> (N) transacciones [subcolección]
```

---

## 📑 Índices Compuestos Necesarios

### Colección `pedidos`

```javascript
// Para filtrar pedidos por estado y fecha
{ estado: 'asc', fechaCreacion: 'desc' }

// Para filtrar pedidos de un turno
{ turnoId: 'asc', fechaCreacion: 'desc' }

// Para pedidos de un repartidor
{ 'reparto.repartidorId': 'asc', fechaCreacion: 'desc' }

// Para pedidos pendientes de liquidar
{ 'reparto.liquidado': 'asc', 'reparto.repartidorId': 'asc', fechaCreacion: 'desc' }

// Para búsqueda por fecha y canal
{ fecha: 'asc', canal: 'asc', fechaCreacion: 'desc' }
```

### Colección `productos`

```javascript
// Para listar productos por categoría y popularidad
{ categoriaId: 'asc', popularidad: 'desc' }

// Para productos disponibles ordenados
{ disponible: 'asc', orden: 'asc' }
```

### Colección `notificaciones`

```javascript
// Para notificaciones de un usuario
{ usuarioId: 'asc', timestamp: 'desc' }

// Para notificaciones por rol
{ rol: 'asc', leida: 'asc', timestamp: 'desc' }
```

---

## 🔒 Consideraciones de Seguridad

### Datos Sensibles

Los siguientes datos deben ser encriptados o protegidos:

- `cliente.telefono` - Encriptar en producción
- `cliente.direccion` - Solo visible para roles autorizados
- `pago.montoRecibido` - Solo visible para cajera/encargado/admin

### Reglas de Acceso por Rol

| Colección | Admin | Encargado | Cajera | Cocina | Repartidor |
|-----------|-------|-----------|--------|--------|------------|
| usuarios | R/W | R | R (limitado) | R (limitado) | R (limitado) |
| pedidos | R/W | R/W | R/W | R (estado) | R (asignados) |
| productos | R/W | R/W | R | R | - |
| categorias | R/W | R | R | R | - |
| repartidores | R/W | R/W | R | - | R (propio) |
| turnos | R/W | R/W | R/W (propio) | - | - |
| notificaciones | R/W | R/W | R/W (propias) | R/W (propias) | R/W (propias) |
| configuracion | R/W | R | R | R | - |

---

## 📈 Optimizaciones y Mejores Prácticas

### 1. Desnormalización Estratégica

Para mejorar el rendimiento, algunos datos se duplican intencionalmente:

- `repartidorNombre` en `pedidos` (evita join con `repartidores`)
- `categoriaNombre` en `productos` (evita join con `categorias`)
- `cajeroNombre` en `turnos` (evita join con `usuarios`)

### 2. Uso de Subcolecciones

Las subcolecciones se usan para:

- **Items de pedido**: Evitar documentos muy grandes
- **Historial**: Crecer ilimitadamente sin afectar el documento principal
- **Personalizaciones**: Organizar mejor las opciones por producto

### 3. Contadores y Agregaciones

Para evitar recalcular:

- `pedidosCompletados` en `repartidores`
- `totalPedidos` en `turnos.resumen`

### 4. Timestamps

Todos los documentos incluyen:

- `fechaCreacion`: Para auditoría
- `fechaActualizacion`: Para tracking de cambios

---

## 🚀 Próximos Pasos

1. Crear tipos TypeScript (`lib/types/firestore.ts`)
2. Implementar servicios CRUD (`lib/services/`)
3. Configurar reglas de seguridad (`firestore.rules`)
4. Crear datos de prueba (seed)
5. Implementar índices en Firebase Console

---

**Última actualización**: Octubre 27, 2025
**Versión**: 1.0
**Responsable**: Pedro Duran
