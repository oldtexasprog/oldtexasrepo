/**
 * Notifications - Barrel Export
 * Exporta todas las utilidades del sistema de notificaciones in-app
 *
 * ALTERNATIVA GRATUITA A FIREBASE CLOUD MESSAGING (FCM)
 * Sistema basado en Firestore con listeners en tiempo real
 */

// Core functions
export {
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  cleanOldNotifications,
  getNotificationStats,
  subscribeToNotifications,
  playNotificationSound,
  getNotificationSettings,
  saveNotificationSettings,
} from './in-app';

// Helper functions
export {
  notifyNewOrder,
  notifyOrderReady,
  notifyOrderDelivered,
  notifyIncident,
} from './in-app';

// React hooks
export { useNotifications, useUnreadCount } from './useNotifications';

// Types
export type {
  Notification,
  NotificationType,
  UserRole,
  NotificationPriority,
  NotificationAction,
  NotificationSound,
  NotificationSettings,
  CreateNotificationOptions,
  NotificationFilters,
  NotificationStats,
  NotificationResult,
  NotificationListener,
} from './types';

// Constants
export {
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  NOTIFICATION_SOUNDS,
  TOAST_DURATION,
} from './types';
