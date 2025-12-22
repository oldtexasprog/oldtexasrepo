/**
 * NotificationCenter - Centro de Notificaciones
 * Old Texas BBQ - CRM
 *
 * Panel lateral que muestra todas las notificaciones del usuario
 */

'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { useAuth } from '@/lib/auth/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Bell,
  X,
  Check,
  Trash2,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Info,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { notificacionesService } from '@/lib/services/notificaciones.service';
import { TipoNotificacion } from '@/lib/types/firestore';

// Mapa de iconos según tipo
const ICON_MAP: Record<TipoNotificacion, any> = {
  nuevo_pedido: ShoppingCart,
  pedido_listo: CheckCircle,
  pedido_entregado: Package,
  pedido_cancelado: AlertCircle,
  alerta: AlertCircle,
  info: Info,
};

// Mapa de colores según prioridad
const PRIORITY_COLORS = {
  baja: 'bg-gray-100 dark:bg-gray-800',
  normal: 'bg-blue-50 dark:bg-blue-950',
  alta: 'bg-orange-50 dark:bg-orange-950',
  urgente: 'bg-red-50 dark:bg-red-950',
};

export function NotificationCenter() {
  const { user } = useAuth();
  const {
    notifications,
    isOpen,
    closePanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    unreadCount,
  } = useNotificationStore();

  // Listener para notificaciones en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = notificacionesService.onNotificacionesUsuarioChange(
      user.id,
      (notifs) => {
        useNotificationStore.getState().setNotifications(notifs);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={closePanel}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900',
          'shadow-2xl z-50 flex flex-col',
          'transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Notificaciones</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closePanel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 p-3 border-b bg-gray-50 dark:bg-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como leídas
            </Button>
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                No tienes notificaciones
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Te avisaremos cuando haya algo nuevo
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = ICON_MAP[notification.tipo] || Bell;
                const isUnread = !notification.leida;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                      isUnread && 'bg-blue-50/50 dark:bg-blue-950/20',
                      PRIORITY_COLORS[notification.prioridad]
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Icono */}
                      <div
                        className={cn(
                          'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
                          isUnread
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={cn(
                                'text-sm font-medium',
                                isUnread
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300'
                              )}
                            >
                              {notification.titulo}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.mensaje}
                            </p>
                          </div>

                          {/* Badge de no leída */}
                          {isUnread && (
                            <div className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-1" />
                          )}
                        </div>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {formatDistanceToNow(
                            notification.timestamp?.toDate() || new Date(),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </p>

                        {/* Acciones */}
                        <div className="flex items-center gap-2 mt-3">
                          {isUnread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-7 text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Marcar como leída
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
