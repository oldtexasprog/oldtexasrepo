/**
 * Store de Notificaciones
 * Old Texas BBQ - CRM
 *
 * Gestiona el estado global de notificaciones
 */

import { create } from 'zustand';
import { Notificacion } from '@/lib/types/firestore';
import { notificacionesService } from '@/lib/services/notificaciones.service';

interface NotificationState {
  // Estado
  notifications: Notificacion[];
  unreadCount: number;
  isLoading: boolean;
  isOpen: boolean; // Panel de notificaciones abierto/cerrado

  // Acciones
  setNotifications: (notifications: Notificacion[]) => void;
  addNotification: (notification: Notificacion) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  getUnreadNotifications: () => Notificacion[];
  getNotificationById: (id: string) => Notificacion | undefined;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Estado inicial
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isOpen: false,

  // Acciones
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.leida).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) => {
    set((state) => {
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) return state;

      const newNotifications = [notification, ...state.notifications];
      const unreadCount = newNotifications.filter((n) => !n.leida).length;

      return {
        notifications: newNotifications,
        unreadCount,
      };
    });
  },

  markAsRead: async (id) => {
    try {
      // Optimistic update
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, leida: true } : n
        );
        const unreadCount = notifications.filter((n) => !n.leida).length;
        return { notifications, unreadCount };
      });

      // Update en Firestore
      await notificacionesService.marcarComoLeida(id);
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      // TODO: Revertir optimistic update si falla
    }
  },

  markAllAsRead: async () => {
    const state = get();
    const userId = state.notifications[0]?.usuarioId;

    if (!userId) return;

    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, leida: true })),
        unreadCount: 0,
      }));

      // Update en Firestore
      await notificacionesService.marcarTodasComoLeidas(userId);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  },

  removeNotification: async (id) => {
    try {
      // Optimistic update
      set((state) => {
        const notifications = state.notifications.filter((n) => n.id !== id);
        const unreadCount = notifications.filter((n) => !n.leida).length;
        return { notifications, unreadCount };
      });

      // Delete en Firestore
      await notificacionesService.delete(id);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  },

  clearAll: async () => {
    const state = get();
    const notificationIds = state.notifications.map((n) => n.id);

    try {
      // Optimistic update
      set({ notifications: [], unreadCount: 0 });

      // Batch delete en Firestore
      await notificacionesService.batchDelete(notificationIds);
    } catch (error) {
      console.error('Error al limpiar todas las notificaciones:', error);
    }
  },

  togglePanel: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  openPanel: () => {
    set({ isOpen: true });
  },

  closePanel: () => {
    set({ isOpen: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Helpers
  getUnreadNotifications: () => {
    return get().notifications.filter((n) => !n.leida);
  },

  getNotificationById: (id) => {
    return get().notifications.find((n) => n.id === id);
  },
}));

/**
 * Hook para inicializar el listener de notificaciones
 * Debe llamarse en el layout principal o en un provider
 */
export function useNotificationListener(userId: string) {
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const setLoading = useNotificationStore((state) => state.setLoading);

  // Suscribirse a cambios en tiempo real
  const unsubscribe = notificacionesService.onNotificacionesUsuarioChange(
    userId,
    (notifications) => {
      setNotifications(notifications);
      setLoading(false);
    },
    (error) => {
      console.error('Error en listener de notificaciones:', error);
      setLoading(false);
    }
  );

  return unsubscribe;
}
