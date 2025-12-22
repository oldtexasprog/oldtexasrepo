# 🔔 Sistema de Notificaciones - Old Texas BBQ CRM

## Descripción General

El sistema de notificaciones implementa dos tipos de notificaciones:

1. **Notificaciones In-App** - Notificaciones dentro de la aplicación usando Firestore
2. **Push Notifications** - Notificaciones push usando Firebase Cloud Messaging (FCM)

## 🔒 Seguridad

El sistema implementa **configuración dinámica de credenciales** para mejorar la seguridad:

- ✅ **Sin credenciales hardcodeadas** - El Service Worker obtiene la config desde un API endpoint
- ✅ **Validación automática** - Verifica que todas las credenciales sean válidas
- ✅ **Caché inteligente** - Reduce peticiones y mejora performance
- ✅ **Gestión de entornos** - Diferentes credenciales por entorno (dev/prod)

📖 **Para más detalles sobre seguridad, consulta**: [`SEGURIDAD_NOTIFICACIONES.md`](./SEGURIDAD_NOTIFICACIONES.md)

## Arquitectura

### Componentes Principales

```
lib/
├── notifications/
│   └── fcm.ts                    # Lógica de Firebase Cloud Messaging
├── services/
│   └── notificaciones.service.ts # CRUD de notificaciones Firestore
└── stores/
    └── notificationStore.ts      # Estado global (Zustand)

components/
└── notifications/
    ├── NotificationCenter.tsx    # Panel lateral de notificaciones
    ├── NotificationBadge.tsx     # Botón con contador
    └── notification-listener.tsx # Listener de tiempo real

public/
├── firebase-messaging-sw.js      # Service Worker de FCM
└── sounds/                       # Archivos de audio
    ├── notification.mp3
    ├── new-order.mp3
    ├── order-ready.mp3
    ├── success.mp3
    └── alert.mp3
```

## Funcionalidades

### ✅ Implementadas

- ✅ Notificaciones in-app con Firestore
- ✅ Listener en tiempo real con onSnapshot
- ✅ Store de notificaciones con Zustand
- ✅ NotificationCenter (panel lateral)
- ✅ NotificationBadge (botón con contador)
- ✅ Toast notifications con Sonner
- ✅ Sonidos personalizados por tipo
- ✅ Marcar como leída / Eliminar
- ✅ Service Worker para FCM (configurado)
- ✅ Integración en layout protegido

### ⚠️ Pendiente de Configuración

- ⚠️ **VAPID Key** - Necesitas generar la clave en Firebase Console
- ⚠️ **Archivos de sonido** - Agregar archivos MP3 reales
- ⚠️ **Cloud Functions** - Opcional para enviar notificaciones push desde el servidor

## Configuración

### 1. Configurar VAPID Key en Firebase

1. Ve a **Firebase Console** > **Project Settings** > **Cloud Messaging**
2. En la sección **Web Push certificates**, genera un par de claves
3. Copia la **VAPID key** (clave pública)
4. Agrégala a `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_VAPID_KEY=tu_vapid_key_aqui
```

### 2. Habilitar FCM en Firebase Console

1. Ve a **Firebase Console** > **Cloud Messaging**
2. Asegúrate de que el servicio esté habilitado
3. Verifica que tu plan de Firebase permita FCM (plan Blaze recomendado)

### 3. Agregar Archivos de Sonido

Descarga sonidos de notificación (MP3, 1-3 segundos) y colócalos en `public/sounds/`:

- `notification.mp3` - Sonido por defecto
- `new-order.mp3` - Nuevo pedido (cocina)
- `order-ready.mp3` - Pedido listo (repartidor)
- `success.mp3` - Pedido entregado
- `alert.mp3` - Alertas urgentes

**Recursos gratuitos**:
- https://freesound.org/
- https://notificationsounds.com/
- https://zapsplat.com/

### 4. Probar Service Worker

Verifica que el Service Worker se registre correctamente:

1. Abre Chrome DevTools > **Application** > **Service Workers**
2. Deberías ver `firebase-messaging-sw.js` registrado
3. Si no aparece, revisa la consola para errores

## Uso del Sistema

### Crear una Notificación In-App

```typescript
import { notificacionesService } from '@/lib/services/notificaciones.service';

// Para un usuario específico
await notificacionesService.crearParaUsuario(
  'user-id',
  'nuevo_pedido',
  'Nuevo pedido',
  'Tienes un nuevo pedido #123',
  'alta', // prioridad
  'pedido-id' // opcional
);

// Para un rol completo (ej: todos los cocineros)
await notificacionesService.crearParaRol(
  'cocina',
  'nuevo_pedido',
  'Nuevo pedido en cocina',
  'Pedido #123 recibido',
  'alta'
);
```

### Usar el Store

```typescript
import { useNotificationStore } from '@/lib/stores/notificationStore';

function MyComponent() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    openPanel
  } = useNotificationStore();

  return (
    <div>
      <p>Notificaciones no leídas: {unreadCount}</p>
      <button onClick={openPanel}>Ver notificaciones</button>
    </div>
  );
}
```

### Inicializar FCM

```typescript
import { initializeFCM } from '@/lib/notifications/fcm';

// En un useEffect o cuando el usuario inicie sesión
const token = await initializeFCM(userId);
if (token) {
  console.log('FCM inicializado:', token);
}
```

## Tipos de Notificaciones

| Tipo                 | Descripción                    | Icono          | Sonido              |
| -------------------- | ------------------------------ | -------------- | ------------------- |
| `nuevo_pedido`       | Nuevo pedido recibido          | ShoppingCart   | new-order.mp3       |
| `pedido_listo`       | Pedido listo para recoger      | CheckCircle    | order-ready.mp3     |
| `pedido_entregado`   | Pedido entregado exitosamente  | Package        | success.mp3         |
| `pedido_cancelado`   | Pedido cancelado               | AlertCircle    | alert.mp3           |
| `alerta`             | Alerta importante              | AlertCircle    | alert.mp3           |
| `info`               | Información general            | Info           | notification.mp3    |

## Prioridades

| Prioridad | Color de fondo | Uso                             |
| --------- | -------------- | ------------------------------- |
| `baja`    | Gris           | Información no urgente          |
| `normal`  | Azul           | Notificaciones estándar         |
| `alta`    | Naranja        | Pedidos nuevos, alertas         |
| `urgente` | Rojo           | Pedidos retrasados, emergencias |

## Flujos de Notificaciones

### 1. Nuevo Pedido → Cocina

```typescript
// Cuando se crea un pedido nuevo
await notificacionesService.crearParaRol(
  'cocina',
  'nuevo_pedido',
  'Nuevo pedido #' + pedidoNumero,
  `Mesa ${mesa} - ${itemsCount} items`,
  'alta',
  pedidoId
);
```

### 2. Pedido Listo → Repartidor

```typescript
// Cuando la cocina marca el pedido como listo
await notificacionesService.crearParaUsuario(
  repartidorId,
  'pedido_listo',
  'Pedido listo para recoger',
  `Pedido #${pedidoNumero} - ${direccion}`,
  'normal',
  pedidoId
);
```

### 3. Pedido Entregado → Cajera

```typescript
// Cuando el repartidor confirma la entrega
await notificacionesService.crearParaRol(
  'cajera',
  'pedido_entregado',
  'Pedido entregado',
  `Pedido #${pedidoNumero} entregado por ${repartidorNombre}`,
  'normal',
  pedidoId
);
```

## API de Notificaciones Service

### Métodos Principales

```typescript
// Crear notificación para usuario
crearParaUsuario(
  usuarioId: string,
  tipo: TipoNotificacion,
  titulo: string,
  mensaje: string,
  prioridad?: PrioridadNotificacion,
  pedidoId?: string,
  turnoId?: string
): Promise<string>

// Crear notificación para rol
crearParaRol(
  rol: Rol,
  tipo: TipoNotificacion,
  titulo: string,
  mensaje: string,
  prioridad?: PrioridadNotificacion,
  pedidoId?: string,
  turnoId?: string
): Promise<string>

// Obtener notificaciones de usuario
getByUsuario(usuarioId: string, soloNoLeidas?: boolean): Promise<Notificacion[]>

// Marcar como leída
marcarComoLeida(id: string): Promise<void>

// Marcar todas como leídas
marcarTodasComoLeidas(usuarioId: string): Promise<void>

// Listener en tiempo real
onNotificacionesUsuarioChange(
  usuarioId: string,
  callback: (notificaciones: Notificacion[]) => void,
  onError?: (error: Error) => void
): () => void
```

## Troubleshooting

### Las notificaciones no suenan

1. Verifica que los archivos MP3 existan en `public/sounds/`
2. El usuario debe haber interactuado con la página (por políticas del navegador)
3. Revisa la consola por errores de reproducción

### El Service Worker no se registra

1. Verifica que `firebase-messaging-sw.js` esté en `public/`
2. Asegúrate de que la configuración de Firebase sea correcta
3. Revisa en Chrome DevTools > Application > Service Workers

### No recibo notificaciones push

1. Verifica que el permiso esté concedido (Notification.permission === 'granted')
2. Asegúrate de haber configurado la VAPID key
3. Verifica que FCM esté habilitado en Firebase Console
4. Revisa los logs del Service Worker

### El contador no se actualiza

1. Verifica que el listener esté activo en el layout
2. Revisa que Firestore tenga las notificaciones guardadas
3. Checa las reglas de seguridad de Firestore

## Reglas de Firestore

Las notificaciones requieren reglas de seguridad en Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notificaciones/{notifId} {
      // Leer solo tus propias notificaciones
      allow read: if request.auth != null &&
        (resource.data.usuarioId == request.auth.uid ||
         resource.data.rol == get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol);

      // Solo el sistema puede crear notificaciones
      allow create: if request.auth != null;

      // Solo puedes actualizar tus propias notificaciones
      allow update: if request.auth != null &&
        resource.data.usuarioId == request.auth.uid;

      // Solo puedes eliminar tus propias notificaciones
      allow delete: if request.auth != null &&
        resource.data.usuarioId == request.auth.uid;
    }
  }
}
```

## Próximas Mejoras

- [ ] Cloud Functions para enviar push notifications automáticas
- [ ] Suscripción a tópicos por rol (server-side)
- [ ] Filtros avanzados en NotificationCenter
- [ ] Configuración de preferencias de notificaciones por usuario
- [ ] Analytics de notificaciones (tasa de apertura, etc.)
- [ ] Notificaciones programadas
- [ ] Rich notifications con acciones personalizadas

## Referencias

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Última actualización**: Diciembre 2024
**Responsable**: Pedro Duran
