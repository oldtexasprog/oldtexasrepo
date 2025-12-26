# 🔔 Sistema de Notificaciones - Triggers Automáticos

## 📋 Descripción General

El sistema de notificaciones del CRM Old Texas BBQ incluye **5 triggers automáticos** que notifican a los roles apropiados en momentos clave del flujo de pedidos.

## ✅ Triggers Implementados

### 1️⃣ Nuevo Pedido → Notificar Cocina

**Cuándo:** Al crear un nuevo pedido
**Quién recibe:** Rol `cocina`
**Prioridad:** Alta
**Tipo:** `nuevo_pedido`

**Implementación:**
```typescript
// Automático al llamar:
await pedidosService.crearPedidoCompleto(pedidoData, items);
```

**Mensaje:**
- **Título:** "Nuevo Pedido"
- **Mensaje:** "Pedido #123 recibido y listo para preparar"

---

### 2️⃣ Pedido Listo → Notificar Repartidores

**Cuándo:** Al marcar un pedido como "listo"
**Quién recibe:** Rol `repartidor`
**Prioridad:** Normal
**Tipo:** `pedido_listo`

**Implementación:**
```typescript
// Automático al cambiar estado a 'listo':
await pedidosService.actualizarEstado(
  pedidoId,
  'listo',
  usuarioId,
  usuarioNombre
);
```

**Mensaje:**
- **Título:** "Pedido Listo para Recoger"
- **Mensaje:** "Pedido #123 está listo para entrega"

---

### 3️⃣ Pedido Entregado → Notificar Cajera

**Cuándo:** Al marcar un pedido como "entregado"
**Quién recibe:** Rol `cajera`
**Prioridad:** Normal
**Tipo:** `pedido_entregado`

**Implementación:**
```typescript
// Automático al cambiar estado a 'entregado':
await pedidosService.actualizarEstado(
  pedidoId,
  'entregado',
  usuarioId,
  usuarioNombre
);
```

**Mensaje:**
- **Título:** "Pedido Entregado"
- **Mensaje:** "Pedido #123 entregado a Juan Pérez"

---

### 4️⃣ Incidencia → Notificar Encargado

**Cuándo:** Al reportar una incidencia manualmente
**Quién recibe:** Rol `encargado`
**Prioridad:** Urgente
**Tipo:** `alerta`

**Implementación:**
```typescript
// Llamar manualmente cuando hay problema:
await pedidosService.reportarIncidencia(
  pedidoId,
  'Cliente no disponible',      // Tipo
  'Cliente no contesta llamadas', // Descripción
  usuarioId,
  usuarioNombre
);
```

**Mensaje:**
- **Título:** "Incidencia: Cliente no disponible"
- **Mensaje:** "Pedido #123 - Cliente no contesta llamadas"

---

### 5️⃣ Retraso (>30 min) → Notificar Encargado

**Cuándo:** Cada 10 minutos (automático en background)
**Quién recibe:** Rol `encargado`
**Prioridad:** Urgente
**Tipo:** `alerta`

**Implementación:**
```typescript
// En tu layout principal:
import { useMonitorRetrasos } from '@/lib/hooks/useMonitorRetrasos';

function MainLayout() {
  // Monitoreo automático cada 10 minutos
  useMonitorRetrasos({
    intervalo: 600000, // 10 minutos
    habilitado: true,
    onRetrasosDetectados: (cantidad) => {
      console.log(`${cantidad} pedidos retrasados`);
    }
  });

  return (
    // ...tu layout
  );
}
```

**Mensaje:**
- **Título:** "Pedido Retrasado"
- **Mensaje:** "Pedido #123 lleva 45 min en estado: en_preparacion"

---

## 🎯 Uso en Componentes

### Ejemplo: Botón de Reportar Incidencia

```tsx
'use client';

import { pedidosService } from '@/lib/services/pedidos.service';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ReportarIncidenciaButton({ pedidoId }: { pedidoId: string }) {
  const { user } = useAuth();

  const handleReportarIncidencia = async () => {
    try {
      await pedidosService.reportarIncidencia(
        pedidoId,
        'Pedido incompleto',
        'Falta producto en el pedido',
        user.uid,
        user.displayName || 'Usuario'
      );

      toast.success('Incidencia reportada al encargado');
    } catch (error) {
      toast.error('Error al reportar incidencia');
      console.error(error);
    }
  };

  return (
    <Button variant="destructive" onClick={handleReportarIncidencia}>
      Reportar Incidencia
    </Button>
  );
}
```

### Ejemplo: Integración en Layout Principal

```tsx
// app/(dashboard)/layout.tsx
'use client';

import { useMonitorRetrasos } from '@/lib/hooks/useMonitorRetrasos';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  // Activar monitoreo solo para encargados y admins
  const habilitarMonitoreo = ['encargado', 'admin'].includes(user?.rol || '');

  useMonitorRetrasos({
    intervalo: 600000, // 10 minutos
    habilitado: habilitarMonitoreo,
    onRetrasosDetectados: (cantidad) => {
      if (cantidad > 0) {
        console.log(`⚠️ ${cantidad} pedidos retrasados detectados`);
      }
    },
  });

  return <div>{children}</div>;
}
```

---

## 📊 Flujo Completo de Notificaciones

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE PEDIDO                          │
└─────────────────────────────────────────────────────────────┘

1. CAJERA crea pedido
   └─> 🔔 Notificación a COCINA (nuevo_pedido)

2. COCINA marca "en_preparacion"
   └─> Sin notificación

3. COCINA marca "listo"
   └─> 🔔 Notificación a REPARTIDORES (pedido_listo)

4. REPARTIDOR acepta y marca "en_reparto"
   └─> Sin notificación

5. REPARTIDOR marca "entregado"
   └─> 🔔 Notificación a CAJERA (pedido_entregado)

6. Si hay PROBLEMA en cualquier paso
   └─> 🔔 Notificación a ENCARGADO (alerta)

7. BACKGROUND: Cada 10 minutos
   └─> 🔔 Verifica si pedido > 30 min
       └─> Notifica a ENCARGADO (alerta)
```

---

## 🛠️ Configuración Adicional

### Cambiar Tiempo de Retraso

El tiempo límite está definido en `pedidos.service.ts`:

```typescript
const TIEMPO_LIMITE_MINUTOS = 30; // Modificar aquí
```

### Cambiar Intervalo de Verificación

En tu hook `useMonitorRetrasos`:

```typescript
useMonitorRetrasos({
  intervalo: 300000, // 5 minutos (en ms)
});
```

### Desactivar Monitoreo de Retrasos

```typescript
useMonitorRetrasos({
  habilitado: false, // Desactivar
});
```

---

## 🔍 Testing

### Probar Trigger 1: Nuevo Pedido
1. Crear un nuevo pedido desde `/pedidos/nuevo`
2. Usuario con rol `cocina` debe recibir notificación
3. Verificar en centro de notificaciones

### Probar Trigger 2: Pedido Listo
1. Desde cocina, marcar pedido como "listo"
2. Usuarios con rol `repartidor` deben recibir notificación

### Probar Trigger 3: Pedido Entregado
1. Desde reparto, marcar pedido como "entregado"
2. Usuarios con rol `cajera` deben recibir notificación

### Probar Trigger 4: Incidencia
1. Usar botón "Reportar Incidencia"
2. Usuario con rol `encargado` debe recibir notificación urgente

### Probar Trigger 5: Retraso
1. Crear un pedido
2. Esperar >30 minutos (o modificar el límite temporalmente)
3. Esperar verificación automática (cada 10 min)
4. Usuario con rol `encargado` debe recibir notificación urgente

---

## 📝 Notas Importantes

1. **No bloquean operaciones**: Si falla una notificación, el pedido se crea igual
2. **Duplicación evitada**: El sistema verifica antes de notificar retrasos
3. **Persistencia**: Las notificaciones se guardan en Firestore
4. **Tiempo real**: Los usuarios ven notificaciones instantáneamente
5. **Expiración**: Las notificaciones expiran después de 24 horas

---

## 🎯 Próximas Mejoras

- [ ] Sonido personalizado por tipo de notificación
- [ ] Vibración en dispositivos móviles
- [ ] Notificaciones push con FCM
- [ ] Panel de configuración de notificaciones
- [ ] Historial de notificaciones por usuario
- [ ] Estadísticas de notificaciones

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0
