# Firebase Setup - Old Texas BBQ CRM

Documentación completa de la configuración de Firebase para el proyecto.

## Índice

1. [Guía de Setup Inicial](#guía-de-setup-inicial)
2. [Arquitectura de Firebase](#arquitectura-de-firebase)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Colecciones de Firestore](#colecciones-de-firestore)
5. [Reglas de Seguridad](#reglas-de-seguridad)
6. [Uso de las Utilidades](#uso-de-las-utilidades)
7. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Guía de Setup Inicial

Sigue la guía completa en [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) para:

1. Crear proyecto en Firebase Console
2. Habilitar servicios (Auth, Firestore, Storage, FCM)
3. Configurar variables de entorno
4. Desplegar reglas de seguridad

**Tiempo estimado**: 15-20 minutos

---

## Arquitectura de Firebase

### Servicios Habilitados

```
Firebase Project: old-texas-bbq-crm
├── Authentication (Email/Password)
├── Cloud Firestore (NoSQL Database)
├── Cloud Storage (File Storage)
├── Cloud Messaging (Push Notifications)
└── Analytics (Opcional)
```

### Estructura de Datos

```
Firestore Collections:
├── usuarios/              # Perfiles de usuarios
├── pedidos/              # Pedidos del día
├── productos/            # Catálogo de productos
├── personalizaciones/    # Salsas, extras, etc.
├── repartidores/         # Info de repartidores
├── turnos/               # Turnos de cajeras
├── configuracion/        # Config general
└── fcmTokens/           # Tokens FCM de dispositivos

Storage Buckets:
├── productos/{id}/       # Fotos de productos
├── comprobantes/{id}/    # Comprobantes de pago
└── usuarios/{id}/        # Fotos de perfil
```

---

## Estructura de Archivos

### Archivos Creados

```
/lib/firebase/
├── config.ts              # Configuración e inicialización
├── auth.ts                # Utilidades de autenticación
├── firestore.ts           # Utilidades de Firestore
├── storage.ts             # Utilidades de Storage
├── messaging.ts           # Utilidades de FCM
├── types.ts               # Tipos TypeScript
└── index.ts               # Barrel exports

/public/
└── firebase-messaging-sw.js  # Service Worker para FCM

/ (raíz)
├── firestore.rules        # Reglas de seguridad Firestore
├── storage.rules          # Reglas de seguridad Storage
└── .env.example           # Template de variables de entorno
```

### Importaciones

```typescript
// Importar todo
import * as firebase from '@/lib/firebase';

// O importar selectivamente
import { login, logout, getCurrentUser } from '@/lib/firebase';
import { createDocument, getDocuments } from '@/lib/firebase';
import { uploadImage, deleteFile } from '@/lib/firebase';
```

---

## Colecciones de Firestore

### usuarios

```typescript
{
  id: string;
  nombre: string;
  email: string;
  rol: 'cajera' | 'cocina' | 'repartidor' | 'encargado' | 'admin';
  activo: boolean;
  createdAt: Timestamp;
}
```

### pedidos

```typescript
{
  id: string;
  fecha_hora: Timestamp;
  canal: 'whatsapp' | 'llamada' | 'mostrador' | 'uber' | 'didi' | 'web';
  cliente: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
  items: Array<{
    producto: string;
    cantidad: number;
    personalizacion?: string;
    precio_unitario: number;
  }>;
  totales: {
    subtotal: number;
    envio: number;
    total: number;
  };
  pago: {
    metodo: 'efectivo' | 'tarjeta' | 'transferencia' | 'app';
    requiere_cambio: boolean;
    monto_recibido: number;
  };
  reparto?: {
    repartidor?: string;
    estado: 'pendiente' | 'en_camino' | 'entregado';
    hora_salida?: Timestamp;
    hora_entrega?: Timestamp;
    pago_adelantado: boolean;
    comision?: number;
    liquidado: boolean;
  };
  estado_pedido: 'recibido' | 'en_preparacion' | 'listo' | 'en_reparto' | 'entregado' | 'cancelado';
  observaciones?: string;
  createdBy: string;
}
```

### productos

```typescript
{
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  foto?: string;
}
```

---

## Reglas de Seguridad

### Permisos por Rol

| Colección           | Admin | Encargado | Cajera | Cocina | Repartidor |
|---------------------|-------|-----------|--------|--------|------------|
| usuarios            | CRUD  | CR        | R      | R      | R          |
| pedidos             | CRUD  | CRUD      | CR     | RU*    | RU**       |
| productos           | CRUD  | CRUD      | R      | R      | R          |
| personalizaciones   | CRUD  | CRUD      | R      | R      | R          |
| repartidores        | CRUD  | CRUD      | R      | R      | RU***      |
| turnos              | CRUD  | CRUD      | CRU    | R      | R          |
| configuracion       | CRUD  | RU        | R      | R      | R          |

**Leyenda**: C=Create, R=Read, U=Update, D=Delete

**Restricciones**:
- `*` Cocina solo puede actualizar `estado_pedido` a 'en_preparacion' o 'listo'
- `**` Repartidor solo puede actualizar sus propios pedidos asignados
- `***` Repartidor solo puede actualizar su propio documento

---

## Uso de las Utilidades

### Autenticación

```typescript
import { login, logout, getCurrentUser } from '@/lib/firebase';

// Login
const result = await login({
  email: 'usuario@ejemplo.com',
  password: 'contraseña123'
});

if (result.success) {
  console.log('Usuario autenticado:', result.user);
} else {
  console.error('Error:', result.message);
}

// Logout
await logout();

// Usuario actual
const user = getCurrentUser();
```

### Firestore

```typescript
import {
  getDocuments,
  createDocument,
  updateDocument,
  COLLECTIONS
} from '@/lib/firebase';

// Obtener pedidos del día
const pedidos = await getDocuments(COLLECTIONS.PEDIDOS, {
  where: [
    {
      field: 'fecha_hora',
      operator: '>=',
      value: startOfDay(new Date())
    }
  ],
  orderBy: { field: 'fecha_hora', direction: 'desc' },
  limit: 50
});

// Crear pedido
const result = await createDocument(COLLECTIONS.PEDIDOS, {
  fecha_hora: new Date(),
  cliente: { nombre: 'Juan Pérez', ... },
  items: [...],
  totales: { ... },
  estado_pedido: 'recibido',
  createdBy: getCurrentUser()?.uid
});

// Actualizar pedido
await updateDocument(COLLECTIONS.PEDIDOS, pedidoId, {
  estado_pedido: 'en_preparacion'
});
```

### Storage

```typescript
import { uploadImage, deleteFile, getFileURL } from '@/lib/firebase';

// Subir foto de producto
const result = await uploadImage(file, {
  folder: 'productos',
  id: productoId,
  onProgress: (progress) => {
    console.log(`Subiendo: ${progress}%`);
  }
});

if (result.success) {
  console.log('URL:', result.url);
}

// Obtener URL de archivo
const url = await getFileURL('productos/123/foto.jpg');

// Eliminar archivo
await deleteFile('productos/123/foto.jpg');
```

### Notificaciones (FCM)

```typescript
import {
  initializeFCM,
  onForegroundMessage,
  notifyNewOrder
} from '@/lib/firebase';

// Inicializar FCM para usuario
const token = await initializeFCM(userId);

// Escuchar mensajes en foreground
onForegroundMessage((payload) => {
  console.log('Mensaje recibido:', payload);
  // Mostrar notificación local
});

// Enviar notificación local
await notifyNewOrder(pedidoId, '1234');
```

---

## Ejemplos Prácticos

### 1. Crear Pedido Completo

```typescript
import { createDocument, COLLECTIONS, getCurrentUser } from '@/lib/firebase';

async function crearPedido(data: PedidoData) {
  const result = await createDocument(COLLECTIONS.PEDIDOS, {
    fecha_hora: new Date(),
    canal: data.canal,
    cliente: {
      nombre: data.clienteNombre,
      telefono: data.clienteTelefono,
      direccion: data.clienteDireccion,
    },
    items: data.items,
    totales: calcularTotales(data.items),
    pago: data.pago,
    estado_pedido: 'recibido',
    createdBy: getCurrentUser()?.uid,
  });

  if (result.success) {
    // Notificar a cocina
    await notifyNewOrder(result.data.id, result.data.id);
  }

  return result;
}
```

### 2. Actualizar Estado de Pedido con Validación de Rol

```typescript
import {
  updateDocument,
  getCurrentUserData,
  COLLECTIONS
} from '@/lib/firebase';

async function actualizarEstadoPedido(
  pedidoId: string,
  nuevoEstado: EstadoPedido
) {
  const userData = await getCurrentUserData();

  // Validar permisos según rol
  if (userData.rol === 'cocina') {
    if (!['en_preparacion', 'listo'].includes(nuevoEstado)) {
      throw new Error('Cocina solo puede cambiar a en_preparacion o listo');
    }
  }

  const result = await updateDocument(COLLECTIONS.PEDIDOS, pedidoId, {
    estado_pedido: nuevoEstado
  });

  if (result.success) {
    // Notificar cambio de estado
    await notifyOrderStatusChange(pedidoId, pedidoId, nuevoEstado);
  }

  return result;
}
```

### 3. Subir Foto de Producto con Preview

```typescript
import { prepareImageForUpload, uploadProductImage } from '@/lib/firebase';
import { useState } from 'react';

function ProductImageUpload({ productId }) {
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar y crear preview
    const prepared = await prepareImageForUpload(file);

    if (!prepared.valid) {
      alert(prepared.error);
      return;
    }

    setPreview(prepared.preview);

    // Subir archivo
    setUploading(true);
    const result = await uploadProductImage(file, productId, (p) => {
      setProgress(p);
    });
    setUploading(false);

    if (result.success) {
      console.log('Foto subida:', result.url);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" />}
      {uploading && <progress value={progress} max="100" />}
    </div>
  );
}
```

### 4. Listener en Tiempo Real de Pedidos

```typescript
import { subscribeToCollection, COLLECTIONS } from '@/lib/firebase';
import { useEffect, useState } from 'react';

function usePedidosEnTiempoReal() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    // Suscribirse a cambios en pedidos del día
    const unsubscribe = subscribeToCollection<Pedido>(
      COLLECTIONS.PEDIDOS,
      {
        where: [
          {
            field: 'fecha_hora',
            operator: '>=',
            value: startOfDay(new Date())
          }
        ],
        orderBy: { field: 'fecha_hora', direction: 'desc' }
      },
      (data, error) => {
        if (error) {
          console.error('Error en listener:', error);
        } else {
          setPedidos(data);
        }
      }
    );

    // Cleanup: desuscribirse al desmontar
    return () => unsubscribe();
  }, []);

  return pedidos;
}
```

---

## Troubleshooting

### Error: "Permission denied"

**Causa**: Las reglas de Firestore están bloqueando la operación.

**Solución**:
1. Verifica que el usuario esté autenticado
2. Verifica el rol del usuario
3. Revisa las reglas en `firestore.rules`
4. Despliega las reglas: `firebase deploy --only firestore:rules`

### Error: "Storage bucket not configured"

**Causa**: Storage no está habilitado o la configuración es incorrecta.

**Solución**:
1. Habilita Storage en Firebase Console
2. Verifica `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` en `.env.local`

### Notificaciones no funcionan

**Causa**: Permisos no concedidos o VAPID key incorrecta.

**Solución**:
1. Verifica que `NEXT_PUBLIC_FIREBASE_VAPID_KEY` esté configurada
2. Solicita permisos de notificación
3. Verifica que el Service Worker esté registrado

---

## Recursos Adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Firebase con Next.js](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

---

**Última actualización**: 2025-10-22
**Versión**: 1.0.0
