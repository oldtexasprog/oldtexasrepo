/**
 * NotificationToggle
 * Old Texas BBQ - CRM
 *
 * Botón/Switch para activar/desactivar notificaciones
 * Versión compacta para usar en settings o perfil
 */

'use client';

import { useNotificationPermission } from '@/lib/hooks/useNotificationPermission';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationToggleProps {
  /**
   * Variante del componente
   * - 'button': Botón completo con texto
   * - 'icon': Solo icono
   * - 'compact': Botón compacto con icono y estado
   */
  variant?: 'button' | 'icon' | 'compact';

  /**
   * Tamaño del botón
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Clase CSS adicional
   */
  className?: string;
}

export function NotificationToggle({
  variant = 'button',
  size = 'default',
  className,
}: NotificationToggleProps) {
  const { state, actions } = useNotificationPermission();

  // Si no está soportado, no mostrar nada
  if (!state.supported) {
    return null;
  }

  const isLoading = state.requesting || state.initializing;
  const isEnabled = state.enabled;
  const isDenied = state.permission === 'denied';

  const handleClick = async () => {
    if (isDenied) {
      // Si está denegado, mostrar ayuda para activar
      window.open(
        'https://support.google.com/chrome/answer/3220216',
        '_blank'
      );
      return;
    }

    if (!isEnabled) {
      // Activar notificaciones
      await actions.enableNotifications();
    }
    // Nota: No permitimos desactivar desde aquí por ahora
  };

  // Variante de icono solo
  if (variant === 'icon') {
    return (
      <Button
        variant={isEnabled ? 'default' : 'outline'}
        size="icon"
        onClick={handleClick}
        disabled={isLoading}
        className={className}
        title={
          isDenied
            ? 'Notificaciones bloqueadas'
            : isEnabled
              ? 'Notificaciones activas'
              : 'Activar notificaciones'
        }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEnabled ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Variante compacta
  if (variant === 'compact') {
    return (
      <Button
        variant={isEnabled ? 'default' : 'outline'}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={cn('gap-2', className)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEnabled ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
        <span className="text-xs">
          {isDenied
            ? 'Bloqueadas'
            : isEnabled
              ? 'Activas'
              : 'Desactivadas'}
        </span>
      </Button>
    );
  }

  // Variante button completa (por defecto)
  return (
    <Button
      variant={isEnabled ? 'default' : 'outline'}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn('gap-2', className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Activando...</span>
        </>
      ) : isEnabled ? (
        <>
          <Bell className="h-4 w-4" />
          <span>Notificaciones Activas</span>
        </>
      ) : isDenied ? (
        <>
          <BellOff className="h-4 w-4" />
          <span>Notificaciones Bloqueadas</span>
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          <span>Activar Notificaciones</span>
        </>
      )}
    </Button>
  );
}
