# 🔔 Sistema de Notificaciones - UI y Activación

**Última actualización:** Diciembre 2025

---

## 📋 Descripción

Sistema completo para solicitar y gestionar permisos de notificaciones push en el navegador. Incluye componentes UI listos para usar que facilitan la activación de notificaciones para los usuarios.

---

## 🎯 Componentes Disponibles

### 1️⃣ NotificationPermissionBanner

Banner que aparece cuando las notificaciones no están habilitadas.

**Variantes:**
- `banner`: Banner fijo en la parte superior (default)
- `inline`: Componente inline sin posición fija
- `floating`: Banner flotante en la esquina inferior derecha

**Uso básico:**
```tsx
import { NotificationPermissionBanner } from '@/components/notifications/NotificationPermissionBanner';

export default function Layout({ children }) {
  return (
    <>
      <NotificationPermissionBanner />
      {children}
    </>
  );
}
```

**Uso avanzado:**
```tsx
<NotificationPermissionBanner
  variant="floating"
  dismissible={true}
  onDismiss={() => console.log('Banner cerrado')}
/>
```

---

### 2️⃣ NotificationToggle

Botón/Toggle compacto para activar notificaciones.

**Variantes:**
- `button`: Botón completo con texto (default)
- `icon`: Solo icono
- `compact`: Botón compacto con icono y estado

**Uso en perfil de usuario:**
```tsx
import { NotificationToggle } from '@/components/notifications/NotificationToggle';

export function UserProfile() {
  return (
    <div className="space-y-4">
      <h2>Configuración de Notificaciones</h2>
      <NotificationToggle variant="button" size="default" />
    </div>
  );
}
```

**Uso en navbar:**
```tsx
<NotificationToggle variant="icon" />
```

---

### 3️⃣ useNotificationPermission Hook

Hook que gestiona el estado de permisos y proporciona funciones para activarlas.

**API:**

```typescript
const { state, actions } = useNotificationPermission();

// State
state.supported       // Si el navegador soporta notificaciones
state.permission      // 'granted', 'denied', 'default'
state.enabled         // Si están habilitadas (granted)
state.requesting      // Si se está solicitando permiso
state.initializing    // Si se está inicializando FCM
state.error           // Error si existe

// Actions
actions.requestPermission()      // Solicita permiso
actions.checkPermission()        // Verifica estado
actions.enableNotifications()    // Activa completo (permiso + FCM)
```

**Ejemplo custom:**
```tsx
import { useNotificationPermission } from '@/lib/hooks/useNotificationPermission';
import { Button } from '@/components/ui/button';

export function CustomNotificationButton() {
  const { state, actions } = useNotificationPermission();

  if (!state.supported) {
    return <p>Tu navegador no soporta notificaciones</p>;
  }

  if (state.enabled) {
    return <p>✅ Notificaciones activas</p>;
  }

  return (
    <Button
      onClick={actions.enableNotifications}
      disabled={state.initializing}
    >
      {state.initializing ? 'Activando...' : 'Activar Notificaciones'}
    </Button>
  );
}
```

---

## 🚀 Integración en Layout Principal

### Opción 1: Banner Fijo Superior

```tsx
// app/(dashboard)/layout.tsx
'use client';

import { NotificationPermissionBanner } from '@/components/notifications/NotificationPermissionBanner';
import { useMonitorRetrasos } from '@/lib/hooks/useMonitorRetrasos';

export default function DashboardLayout({ children }) {
  // Monitoreo de retrasos (si eres encargado/admin)
  useMonitorRetrasos({ habilitado: true });

  return (
    <div className="min-h-screen">
      {/* Banner de notificaciones */}
      <NotificationPermissionBanner variant="banner" />

      {/* Contenido principal */}
      <main className="pt-16"> {/* pt-16 para no cubrir el banner */}
        {children}
      </main>
    </div>
  );
}
```

### Opción 2: Banner Flotante (Menos intrusivo)

```tsx
// app/(dashboard)/layout.tsx
'use client';

import { NotificationPermissionBanner } from '@/components/notifications/NotificationPermissionBanner';

export default function DashboardLayout({ children }) {
  return (
    <div>
      {children}

      {/* Banner flotante en la esquina */}
      <NotificationPermissionBanner
        variant="floating"
        dismissible={true}
      />
    </div>
  );
}
```

### Opción 3: En la Página de Perfil

```tsx
// app/perfil/page.tsx
import { NotificationToggle } from '@/components/notifications/NotificationToggle';

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-4">Notificaciones</h2>
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notificaciones Push</h3>
              <p className="text-sm text-gray-600">
                Recibe alertas de pedidos y eventos importantes
              </p>
            </div>
            <NotificationToggle variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 🎨 Personalización

### Estilos del Banner

El componente usa Tailwind CSS. Puedes personalizar los colores:

```tsx
<NotificationPermissionBanner
  className="bg-gradient-to-r from-blue-500 to-blue-600"
/>
```

### Comportamiento Personalizado

```tsx
<NotificationPermissionBanner
  dismissible={true}
  onDismiss={() => {
    // Guardar en localStorage que el usuario cerró el banner
    localStorage.setItem('notification-banner-dismissed', 'true');
  }}
/>
```

---

## 🔄 Flujo Completo

```
┌─────────────────────────────────────────────────────────┐
│         FLUJO DE ACTIVACIÓN DE NOTIFICACIONES           │
└─────────────────────────────────────────────────────────┘

1. Usuario entra a la app
   └─> Hook verifica: ¿Notificaciones habilitadas?

2. NO habilitadas
   └─> Mostrar NotificationPermissionBanner

3. Usuario hace clic en "Activar Notificaciones"
   └─> actions.enableNotifications()
       ├─> Solicita permiso del navegador
       ├─> Obtiene token FCM
       ├─> Guarda token en Firestore
       └─> Configura listener de mensajes

4. SÍ habilitadas
   └─> Banner se oculta automáticamente
   └─> Usuario recibe notificaciones en tiempo real
```

---

## 📊 Estados del Permiso

| Estado | Descripción | UI a Mostrar |
|--------|-------------|--------------|
| `default` | No se ha solicitado permiso | Botón "Activar Notificaciones" |
| `granted` | Permiso concedido | Badge verde "Notificaciones activas" |
| `denied` | Permiso denegado | Instrucciones para activar manualmente |

---

## 🐛 Manejo de Errores

### Notificaciones Bloqueadas

```tsx
const { state } = useNotificationPermission();

if (state.permission === 'denied') {
  return (
    <Alert variant="destructive">
      <AlertTitle>Notificaciones Bloqueadas</AlertTitle>
      <AlertDescription>
        Has bloqueado las notificaciones. Para activarlas:
        <ol className="list-decimal ml-4 mt-2">
          <li>Haz clic en el ícono de candado en la barra de direcciones</li>
          <li>Encuentra "Notificaciones" y selecciona "Permitir"</li>
          <li>Recarga la página</li>
        </ol>
      </AlertDescription>
    </Alert>
  );
}
```

### Navegador No Soportado

```tsx
const { state } = useNotificationPermission();

if (!state.supported) {
  return (
    <Alert>
      <AlertTitle>Navegador No Compatible</AlertTitle>
      <AlertDescription>
        Tu navegador no soporta notificaciones push.
        Considera usar Chrome, Firefox, Edge o Safari actualizado.
      </AlertDescription>
    </Alert>
  );
}
```

---

## 🧪 Testing

### Probar Banner

1. Abre la app en un navegador
2. Si nunca has dado permiso, el banner debe aparecer
3. Haz clic en "Activar Notificaciones"
4. El navegador debe solicitar permiso
5. Si aceptas, el banner desaparece

### Probar Notificaciones Bloqueadas

1. Bloquea las notificaciones manualmente:
   - Chrome: Configuración > Privacidad > Notificaciones
2. Recarga la app
3. El banner debe mostrar instrucciones para desbloquear

### Probar Toggle

1. Agrega `<NotificationToggle />` en alguna página
2. El botón debe reflejar el estado actual
3. Al hacer clic, debe activar notificaciones

---

## 💡 Mejores Prácticas

### 1. No Solicitar Inmediatamente

❌ **Mal:**
```tsx
useEffect(() => {
  // Solicitar apenas carga la app
  actions.requestPermission();
}, []);
```

✅ **Bien:**
```tsx
// Mostrar banner y dejar que el usuario decida
<NotificationPermissionBanner />
```

### 2. Explicar el Beneficio

```tsx
<div>
  <h3>¿Por qué activar notificaciones?</h3>
  <ul>
    <li>✅ Recibe alertas de nuevos pedidos instantáneamente</li>
    <li>✅ Entérate cuando un pedido está listo</li>
    <li>✅ Alertas de pedidos retrasados</li>
  </ul>
  <NotificationToggle />
</div>
```

### 3. Respetar la Decisión del Usuario

```tsx
<NotificationPermissionBanner
  dismissible={true}
  onDismiss={() => {
    // Guardar preferencia
    localStorage.setItem('hide-notification-banner', 'true');
  }}
/>
```

---

## 🎯 Casos de Uso

### Dashboard de Cocina

```tsx
// Activar automáticamente para rol cocina
export function CocinaLayout() {
  const { user } = useAuth();
  const { actions } = useNotificationPermission();

  useEffect(() => {
    if (user?.rol === 'cocina') {
      // Sugerir activar notificaciones
      actions.enableNotifications();
    }
  }, [user]);

  return (
    <>
      <NotificationPermissionBanner variant="banner" />
      {/* Resto del dashboard */}
    </>
  );
}
```

### Panel de Repartidor

```tsx
export function RepartoPage() {
  return (
    <div>
      <h1>Mis Pedidos</h1>

      {/* Banner inline para repartidores */}
      <NotificationPermissionBanner variant="inline" />

      {/* Lista de pedidos */}
    </div>
  );
}
```

---

## 📝 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `lib/hooks/useNotificationPermission.ts` | Hook principal |
| `components/notifications/NotificationPermissionBanner.tsx` | Banner de activación |
| `components/notifications/NotificationToggle.tsx` | Botón/Toggle compacto |
| `docs/NOTIFICACIONES_UI.md` | Esta documentación |

---

## 🔗 Enlaces Relacionados

- [Documentación de Triggers](./NOTIFICACIONES_TRIGGERS.md)
- [Sistema FCM](../lib/notifications/fcm.ts)
- [Web Push Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

**¡Sistema completo de notificaciones listo para usar!** 🎉
