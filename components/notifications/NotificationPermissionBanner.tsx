/**
 * NotificationPermissionBanner
 * Old Texas BBQ - CRM
 *
 * Banner que aparece cuando las notificaciones no están habilitadas
 * Permite al usuario activarlas fácilmente
 */

'use client';

import { useNotificationPermission } from '@/lib/hooks/useNotificationPermission';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, X, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NotificationPermissionBannerProps {
  /**
   * Si se debe mostrar el banner
   * Por defecto se muestra cuando las notificaciones no están habilitadas
   */
  show?: boolean;

  /**
   * Variante del banner
   * - 'banner': Banner fijo en la parte superior
   * - 'inline': Componente inline (sin posición fija)
   * - 'floating': Banner flotante en la esquina
   */
  variant?: 'banner' | 'inline' | 'floating';

  /**
   * Si el usuario puede cerrar el banner
   */
  dismissible?: boolean;

  /**
   * Callback cuando el usuario cierra el banner
   */
  onDismiss?: () => void;
}

export function NotificationPermissionBanner({
  show,
  variant = 'banner',
  dismissible = true,
  onDismiss,
}: NotificationPermissionBannerProps) {
  const { state, actions } = useNotificationPermission();
  const [dismissed, setDismissed] = useState(false);

  // Determinar si se debe mostrar el banner
  const shouldShow =
    show !== undefined
      ? show
      : state.supported && !state.enabled && !dismissed;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleEnable = async () => {
    const success = await actions.enableNotifications();
    if (success) {
      // Cerrar el banner automáticamente si se activó
      setDismissed(true);
    }
  };

  if (!shouldShow) {
    return null;
  }

  // Estilos según variante
  const containerStyles = {
    banner: 'fixed top-0 left-0 right-0 z-50 shadow-lg',
    inline: 'rounded-lg border',
    floating: 'fixed bottom-4 right-4 z-50 max-w-md shadow-2xl rounded-lg',
  };

  // Contenido según el estado del permiso
  const getContent = () => {
    if (state.permission === 'denied') {
      return {
        icon: <BellOff className="h-5 w-5 text-red-600" />,
        title: 'Notificaciones Bloqueadas',
        description:
          'Has bloqueado las notificaciones. Para activarlas, ve a la configuración de tu navegador.',
        actionText: 'Ver Cómo Activar',
        actionVariant: 'outline' as const,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        onAction: () => {
          window.open(
            'https://support.google.com/chrome/answer/3220216',
            '_blank'
          );
        },
      };
    }

    return {
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      title: 'Activa las Notificaciones',
      description:
        'Recibe alertas en tiempo real de nuevos pedidos, cambios de estado y más.',
      actionText: state.initializing
        ? 'Activando...'
        : state.requesting
          ? 'Solicitando...'
          : 'Activar Notificaciones',
      actionVariant: 'default' as const,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      onAction: handleEnable,
    };
  };

  const content = getContent();

  return (
    <div className={cn(containerStyles[variant])}>
      <div
        className={cn(
          'flex items-start gap-4 p-4',
          content.bgColor,
          content.borderColor,
          variant === 'inline' && 'border'
        )}
      >
        {/* Icono */}
        <div className="flex-shrink-0">{content.icon}</div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {content.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{content.description}</p>

          {/* Información adicional para permisos denegados */}
          {state.permission === 'denied' && (
            <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                1. Haz clic en el ícono de candado/información en la barra de
                direcciones
                <br />
                2. Encuentra &quot;Notificaciones&quot; y selecciona
                &quot;Permitir&quot;
                <br />
                3. Recarga la página
              </p>
            </div>
          )}

          {/* Error si existe */}
          {state.error && state.permission !== 'denied' && (
            <p className="mt-1 text-xs text-red-600">{state.error}</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={content.onAction}
            disabled={state.requesting || state.initializing}
            variant={content.actionVariant}
            size="sm"
          >
            {content.actionText}
          </Button>

          {dismissible && (
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
