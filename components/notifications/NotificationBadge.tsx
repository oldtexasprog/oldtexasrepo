/**
 * NotificationBadge - Botón de Notificaciones
 * Old Texas BBQ - CRM
 *
 * Muestra un icono de campana con badge de contador
 * Al hacer clic, abre el NotificationCenter
 */

'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function NotificationBadge({
  className,
  showLabel = false,
}: NotificationBadgeProps) {
  const { unreadCount, isOpen, togglePanel } = useNotificationStore();

  return (
    <Button
      variant={isOpen ? 'default' : 'ghost'}
      size={showLabel ? 'default' : 'icon'}
      onClick={togglePanel}
      className={cn('relative', className)}
      aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} nuevas)` : ''}`}
    >
      <Bell className="h-5 w-5" />

      {/* Contador de notificaciones no leídas */}
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className={cn(
            'absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0',
            'text-[10px] font-bold',
            'animate-pulse'
          )}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}

      {showLabel && <span className="ml-2">Notificaciones</span>}
    </Button>
  );
}
