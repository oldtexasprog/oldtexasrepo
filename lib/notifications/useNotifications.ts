/**
 * useNotifications Hook
 * Hook de React para consumir notificaciones in-app en tiempo real
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  Notification,
  NotificationStats,
  UserRole,
  NotificationSettings,
} from './types';
import {
  subscribeToNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationStats,
  playNotificationSound,
  getNotificationSettings,
  saveNotificationSettings,
} from './in-app';
import { TOAST_DURATION } from './types';

/**
 * Opciones del hook
 */
interface UseNotificationsOptions {
  userId: string;
  roles: UserRole[];
  autoPlay?: boolean; // Reproducir sonido automaticamente
  showToast?: boolean; // Mostrar toast automaticamente
}

/**
 * Resultado del hook
 */
interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  settings: NotificationSettings | null;
  loading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshStats: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
}

/**
 * Hook para gestionar notificaciones
 */
export const useNotifications = (
  options: UseNotificationsOptions
): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Calcular contador de no leidas
  const unreadCount =
    stats?.noLeidas ||
    notifications.filter(
      (n) => !n.leida_por?.includes(options.userId)
    ).length;

  /**
   * Manejar nueva notificacion
   */
  const handleNewNotification = useCallback(
    (notification: Notification) => {
      // Agregar a la lista
      setNotifications((prev) => [notification, ...prev]);

      // Verificar si el tipo esta silenciado
      if (settings?.mutedTypes?.includes(notification.tipo)) {
        return;
      }

      // Reproducir sonido si esta habilitado
      if (
        options.autoPlay !== false &&
        settings?.sound?.enabled !== false
      ) {
        const volume = settings?.sound?.volume ?? 0.5;
        playNotificationSound(notification.prioridad, volume);
      }

      // Mostrar toast si esta habilitado
      if (options.showToast !== false) {
        const duration = TOAST_DURATION[notification.prioridad];

        toast(notification.titulo, {
          description: notification.mensaje,
          duration: duration || 5000,
          icon: notification.icono,
          action: notification.accion
            ? {
                label: notification.accion.label || 'Ver',
                onClick: () => {
                  if (notification.accion?.tipo === 'navegar') {
                    window.location.href = notification.accion.destino || '#';
                  }
                },
              }
            : undefined,
        });
      }

      // Refrescar estadisticas
      refreshStats();
    },
    [options.autoPlay, options.showToast, settings]
  );

  /**
   * Cargar configuracion del usuario
   */
  const loadSettings = useCallback(async () => {
    try {
      const userSettings = await getNotificationSettings(options.userId);
      setSettings(userSettings);
    } catch (err) {
      console.error('Error al cargar configuracion:', err);
    }
  }, [options.userId]);

  /**
   * Refrescar estadisticas
   */
  const refreshStats = useCallback(async () => {
    try {
      const newStats = await getNotificationStats(
        options.userId,
        options.roles
      );
      setStats(newStats);
    } catch (err) {
      console.error('Error al refrescar estadisticas:', err);
    }
  }, [options.userId, options.roles]);

  /**
   * Marcar como leida
   */
  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const result = await markAsRead(notificationId, options.userId);

        if (result.success) {
          // Actualizar estado local
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId
                ? {
                    ...n,
                    leida: true,
                    leida_por: [...(n.leida_por || []), options.userId],
                  }
                : n
            )
          );

          // Refrescar estadisticas
          await refreshStats();
        }
      } catch (err) {
        console.error('Error al marcar como leida:', err);
      }
    },
    [options.userId, refreshStats]
  );

  /**
   * Marcar todas como leidas
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const result = await markAllAsRead(options.userId, options.roles);

      if (result.success) {
        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            leida: true,
            leida_por: [...(n.leida_por || []), options.userId],
          }))
        );

        // Refrescar estadisticas
        await refreshStats();

        toast.success('Todas las notificaciones marcadas como leidas');
      }
    } catch (err) {
      console.error('Error al marcar todas como leidas:', err);
      toast.error('Error al marcar notificaciones');
    }
  }, [options.userId, options.roles, refreshStats]);

  /**
   * Actualizar configuracion
   */
  const handleUpdateSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      try {
        const updatedSettings: NotificationSettings = {
          ...settings!,
          ...newSettings,
          userId: options.userId,
          updatedAt: null as any, // Se establecera en el servidor
        };

        const result = await saveNotificationSettings(updatedSettings);

        if (result.success) {
          setSettings(updatedSettings);
          toast.success('Configuracion actualizada');
        }
      } catch (err) {
        console.error('Error al actualizar configuracion:', err);
        toast.error('Error al guardar configuracion');
      }
    },
    [settings, options.userId]
  );

  /**
   * Configurar listener de notificaciones
   */
  useEffect(() => {
    setLoading(true);

    // Cargar configuracion inicial
    loadSettings();

    // Cargar estadisticas iniciales
    refreshStats();

    // Configurar listener
    const unsubscribe = subscribeToNotifications({
      userId: options.userId,
      roles: options.roles,
      onNotification: handleNewNotification,
      onError: (err) => {
        console.error('Error en listener:', err);
        setError(err);
      },
    });

    setLoading(false);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [
    options.userId,
    options.roles,
    handleNewNotification,
    loadSettings,
    refreshStats,
  ]);

  return {
    notifications,
    unreadCount,
    stats,
    settings,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refreshStats,
    updateSettings: handleUpdateSettings,
  };
};

/**
 * Hook simplificado para solo obtener el contador de no leidas
 */
export const useUnreadCount = (
  userId: string,
  roles: UserRole[]
): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const stats = await getNotificationStats(userId, roles);
      setCount(stats.noLeidas);
    };

    fetchCount();

    // Refrescar cada 30 segundos
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, [userId, roles]);

  return count;
};
