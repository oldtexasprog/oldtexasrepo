/**
 * EJEMPLO: Layout con Sistema de Notificaciones Integrado
 * Old Texas BBQ - CRM
 *
 * Este archivo muestra cómo integrar el sistema completo de notificaciones
 * en el layout principal de la aplicación.
 *
 * CÓMO USAR:
 * 1. Copia este código en tu archivo app/(dashboard)/layout.tsx
 * 2. Ajusta según tus necesidades
 * 3. El banner aparecerá automáticamente si las notificaciones no están activas
 */

'use client';

import { NotificationPermissionBanner } from '@/components/notifications/NotificationPermissionBanner';
import { useMonitorRetrasos } from '@/lib/hooks/useMonitorRetrasos';
import { useAuth } from '@/lib/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  // Activar monitoreo de retrasos solo para encargados y admins
  const habilitarMonitoreo = user?.rol
    ? ['encargado', 'admin'].includes(user.rol)
    : false;

  useMonitorRetrasos({
    intervalo: 600000, // 10 minutos
    habilitado: habilitarMonitoreo,
    onRetrasosDetectados: (cantidad) => {
      if (cantidad > 0) {
        console.log(`⚠️ ${cantidad} pedido(s) retrasado(s) detectado(s)`);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/*
        OPCIÓN 1: Banner Fijo Superior
        Aparece en la parte superior cuando las notificaciones no están activas
      */}
      <NotificationPermissionBanner variant="banner" dismissible={true} />

      {/*
        OPCIÓN 2: Banner Flotante (Comentado)
        Menos intrusivo, aparece en la esquina inferior derecha
      */}
      {/* <NotificationPermissionBanner variant="floating" dismissible={true} /> */}

      {/* Contenido principal */}
      <main className="pt-16">
        {/* pt-16 para no cubrir el banner fijo */}
        {children}
      </main>
    </div>
  );
}

/**
 * ALTERNATIVA: Layout Minimalista
 * Si prefieres una integración más sutil
 */
/*
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      {children}

      <NotificationPermissionBanner
        variant="floating"
        dismissible={true}
        onDismiss={() => {
          // Opcional: guardar preferencia del usuario
          localStorage.setItem('notification-banner-dismissed', 'true');
        }}
      />
    </>
  );
}
*/

/**
 * ALTERNATIVA: Layout con Condición por Rol
 * Solo mostrar el banner a ciertos roles
 */
/*
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  // Roles que deberían tener notificaciones activas
  const requiereNotificaciones = ['cocina', 'repartidor', 'encargado'];
  const mostrarBanner = user?.rol
    ? requiereNotificaciones.includes(user.rol)
    : false;

  return (
    <div>
      {mostrarBanner && (
        <NotificationPermissionBanner variant="banner" />
      )}

      <main>
        {children}
      </main>
    </div>
  );
}
*/
