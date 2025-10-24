# Sistema de Notificaciones In-App

## Alternativa 100% GRATUITA a Firebase Cloud Messaging

Sistema de notificaciones en tiempo real basado en Firestore, sin necesidad de plan Blaze de Firebase.

## Caracteristicas

- Notificaciones en tiempo real cuando la app esta abierta
- Persistencia en Firestore
- Filtrado por rol de usuario
- Sistema de sonidos personalizados
- Contador de no leidas
- Toasts visuales con Sonner
- Marcado de leidas/no leidas
- Expiracion automatica de notificaciones
- 100% GRATUITO (usa plan Spark de Firebase)

## Como Funciona

1. **Creacion**: Se crea una notificacion en Firestore (coleccion `notificaciones`)
2. **Listener**: Los usuarios suscritos reciben la notificacion en tiempo real
3. **Display**: Se muestra un toast y reproduce un sonido (configurable)
4. **Persistencia**: La notificacion se guarda para verla despues
5. **Marcado**: El usuario puede marcar como leida

## Arquitectura

```
Firebase Firestore
└── notificaciones/
    ├── notif-123 (Notificacion 1)
    │   ├── tipo: "nuevo_pedido"
    │   ├── titulo: "Nuevo Pedido"
    │   ├── mensaje: "Pedido #123"
    │   ├── rol_destino: ["cocina", "encargado"]
    │   ├── leida: false
    │   ├── created_at: Timestamp
    │   └── ...
    └── notif-456 (Notificacion 2)
```

## Setup

### 1. Configurar Reglas de Firestore

Agrega las siguientes reglas en `firestore.rules`:

```javascript
// Reglas para notificaciones
match /notificaciones/{notifId} {
  // Permitir leer notificaciones si el usuario pertenece al rol destino
  allow read: if request.auth != null &&
    request.auth.token.rol in resource.data.rol_destino;

  // Solo admins y encargados pueden crear notificaciones
  allow create: if request.auth != null &&
    (request.auth.token.rol == 'admin' || request.auth.token.rol == 'encargado');

  // Permitir actualizar solo el campo 'leida' y 'leida_por'
  allow update: if request.auth != null &&
    request.auth.token.rol in resource.data.rol_destino &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['leida', 'leida_por']);

  // Solo admins pueden eliminar
  allow delete: if request.auth != null &&
    request.auth.token.rol == 'admin';
}

// Configuracion de notificaciones por usuario
match /notificacion_settings/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### 2. Agregar Archivos de Sonido

Crea la carpeta `public/sounds/` y agrega archivos de sonido:

- `notification-low.mp3` (sonido suave)
- `notification-normal.mp3` (sonido medio)
- `notification-high.mp3` (sonido alto)
- `notification-urgent.mp3` (sonido urgente)

**Puedes usar sonidos de:**

- [Freesound](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- Crear los tuyos propios

## Uso

### Crear Notificacion

```typescript
import { createNotification } from '@/lib/notifications';

// Notificacion de nuevo pedido
await createNotification({
  tipo: 'nuevo_pedido',
  titulo: 'Nuevo Pedido',
  mensaje: 'Pedido #123 recibido',
  prioridad: 'high',
  rol_destino: ['cocina', 'encargado'],
  pedido_id: 'pedido-123',
  pedido_numero: '123',
  accion: {
    tipo: 'navegar',
    destino: '/pedidos/pedido-123',
    label: 'Ver pedido',
  },
});
```

### Helpers Predefinidos

```typescript
import {
  notifyNewOrder,
  notifyOrderReady,
  notifyOrderDelivered,
  notifyIncident,
} from '@/lib/notifications';

// Notificar nuevo pedido
await notifyNewOrder('pedido-123', '123');

// Notificar pedido listo
await notifyOrderReady('pedido-123', '123');

// Notificar pedido entregado
await notifyOrderDelivered('pedido-123', '123');

// Notificar incidencia
await notifyIncident(
  'Sistema de Pago Caido',
  'El sistema de pago esta presentando fallas',
  ['admin', 'encargado']
);
```

### Escuchar Notificaciones (Hook)

```typescript
'use client';

import { useNotifications } from '@/lib/notifications';
import { getCurrentUserData } from '@/lib/firebase';

export default function Dashboard() {
  const userData = getCurrentUserData();

  const {
    notifications,
    unreadCount,
    stats,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications({
    userId: userData.uid,
    roles: [userData.rol],
    autoPlay: true, // Reproducir sonido automaticamente
    showToast: true, // Mostrar toast automaticamente
  });

  return (
    <div>
      <h1>Notificaciones ({unreadCount})</h1>

      <button onClick={markAllAsRead}>Marcar todas como leidas</button>

      <ul>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
            className={notif.leida ? 'opacity-50' : ''}
          >
            <span>{notif.icono}</span>
            <h3>{notif.titulo}</h3>
            <p>{notif.mensaje}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Contador de No Leidas

```typescript
import { useUnreadCount } from '@/lib/notifications';

export function NotificationBadge() {
  const userData = getCurrentUserData();
  const unreadCount = useUnreadCount(userData.uid, [userData.rol]);

  return (
    <div className="relative">
      <BellIcon />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
```

### Marcar Como Leida

```typescript
import { markAsRead } from '@/lib/notifications';

const handleMarkAsRead = async (notificationId: string, userId: string) => {
  const result = await markAsRead(notificationId, userId);

  if (result.success) {
    console.log('Marcada como leida');
  }
};
```

### Marcar Todas Como Leidas

```typescript
import { markAllAsRead } from '@/lib/notifications';

const handleMarkAllAsRead = async (userId: string, roles: UserRole[]) => {
  const result = await markAllAsRead(userId, roles);

  if (result.success) {
    console.log('Todas marcadas como leidas');
  }
};
```

## Tipos de Notificacion

```typescript
type NotificationType =
  | 'nuevo_pedido' // Nuevo pedido recibido
  | 'pedido_actualizado' // Estado de pedido actualizado
  | 'pedido_listo' // Pedido listo para recoger/entregar
  | 'pedido_en_reparto' // Pedido en camino
  | 'pedido_entregado' // Pedido entregado
  | 'pedido_cancelado' // Pedido cancelado
  | 'incidencia' // Problema o incidencia
  | 'sistema' // Notificacion del sistema
  | 'alerta'; // Alerta importante
```

## Prioridades

```typescript
type NotificationPriority =
  | 'low' // Baja prioridad
  | 'normal' // Prioridad normal
  | 'high' // Alta prioridad
  | 'urgent'; // Urgente (no se cierra automaticamente)
```

## Configuracion de Usuario

Cada usuario puede configurar sus preferencias:

```typescript
import { saveNotificationSettings } from '@/lib/notifications';

await saveNotificationSettings({
  userId: 'user-123',
  enabled: true,
  sound: {
    enabled: true,
    volume: 0.7, // 0-1
    sound: 'default',
  },
  roles: ['cocina'],
  mutedTypes: ['pedido_entregado'], // Silenciar ciertos tipos
  updatedAt: Timestamp.now(),
});
```

## Limpiar Notificaciones Antiguas

```typescript
import { cleanOldNotifications } from '@/lib/notifications';

// Eliminar notificaciones de mas de 30 dias
await cleanOldNotifications(30);

// Ejecutar periodicamente (ej: Cloud Function programada)
```

## Estadisticas

```typescript
import { getNotificationStats } from '@/lib/notifications';

const stats = await getNotificationStats('user-123', ['cocina']);

console.log('Total:', stats.total);
console.log('No leidas:', stats.noLeidas);
console.log('Por tipo:', stats.porTipo);
console.log('Por prioridad:', stats.porPrioridad);
```

## Ejemplo Completo: Componente de Notificaciones

```typescript
'use client';

import { useNotifications } from '@/lib/notifications';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';

export function NotificationCenter({ userId, roles }: { userId: string; roles: string[] }) {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications({
    userId,
    roles,
    autoPlay: true,
    showToast: true,
  });

  return (
    <div className="relative">
      {/* Badge */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white shadow-lg rounded-lg border z-50">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-sm text-blue-500 hover:underline"
              >
                Marcar todas como leidas
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                No hay notificaciones
              </p>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.leida_por?.includes(userId);

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.accion?.tipo === 'navegar') {
                        window.location.href = notif.accion.destino || '#';
                      }
                    }}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      isUnread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{notif.icono}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{notif.titulo}</h4>
                        <p className="text-sm text-gray-600">{notif.mensaje}</p>
                        <span className="text-xs text-gray-400">
                          {notif.created_at.toDate().toLocaleString()}
                        </span>
                      </div>
                      {isUnread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Comparacion con FCM

| Caracteristica                              | FCM (Firebase Cloud Messaging) | Sistema In-App    |
| ------------------------------------------- | ------------------------------ | ----------------- |
| Costo                                       | Requiere plan Blaze (pago)     | 100% GRATUITO     |
| Push notifications (app cerrada)            | Si                             | No                |
| Notificaciones en tiempo real (app abierta) | Si                             | Si                |
| Persistencia                                | Limitada                       | Total (Firestore) |
| Historial                                   | No                             | Si                |
| Contador de no leidas                       | Manual                         | Integrado         |
| Filtrado por rol                            | Manual                         | Integrado         |
| Setup                                       | Complejo                       | Simple            |

## Limitaciones

1. **Solo funciona con la app abierta**: No envia notificaciones push cuando la app esta cerrada
2. **Requiere conexion a internet**: Las notificaciones se entregan via Firestore
3. **Limites de Firestore**: Plan Spark tiene limites de lecturas/escrituras diarias

## Mejores Practicas

1. **Limpia notificaciones antiguas regularmente:**

   ```typescript
   // Ejecutar semanalmente
   await cleanOldNotifications(30);
   ```

2. **Expira notificaciones temporales:**

   ```typescript
   await createNotification({
     // ...
     expiresInMinutes: 60, // Expira en 1 hora
   });
   ```

3. **Filtra notificaciones por rol correctamente:**

   ```typescript
   rol_destino: ['cocina', 'encargado'], // Solo estos roles
   ```

4. **Usa prioridades apropiadas:**
   - `low`: Informacion general
   - `normal`: Actualizaciones normales
   - `high`: Acciones importantes
   - `urgent`: Problemas criticos

5. **Permite al usuario silenciar tipos:**
   ```typescript
   mutedTypes: ['pedido_entregado'], // No molestar con estas
   ```

## Soporte

Para dudas o problemas:

- Revisa la documentacion de Firestore
- Consulta los ejemplos en `lib/notifications/`
- Lee la guia de migracion: [MIGRATION_FROM_FIREBASE.md](../MIGRATION_FROM_FIREBASE.md)
