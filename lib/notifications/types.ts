/**
 * Notification Types
 * Tipos TypeScript para el sistema de notificaciones in-app
 *
 * ALTERNATIVA GRATUITA A FIREBASE CLOUD MESSAGING (FCM)
 * Sistema basado en Firestore con listeners en tiempo real
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Tipos de notificacion
 */
export type NotificationType =
  | 'nuevo_pedido'
  | 'pedido_actualizado'
  | 'pedido_listo'
  | 'pedido_en_reparto'
  | 'pedido_entregado'
  | 'pedido_cancelado'
  | 'incidencia'
  | 'sistema'
  | 'alerta';

/**
 * Roles de usuario
 */
export type UserRole =
  | 'cajera'
  | 'cocina'
  | 'repartidor'
  | 'encargado'
  | 'admin';

/**
 * Prioridad de notificacion
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Notificacion in-app
 */
export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  prioridad: NotificationPriority;

  // Destinatarios
  rol_destino: UserRole[]; // Para notificaciones por rol
  usuario_destino?: string; // Para notificaciones especificas de usuario

  // Metadata
  pedido_id?: string;
  pedido_numero?: string;
  data?: Record<string, any>;

  // Estado
  leida: boolean;
  leida_por?: string[]; // IDs de usuarios que la leyeron

  // Timestamps
  created_at: Timestamp;
  expires_at?: Timestamp; // Opcional: fecha de expiracion

  // UI
  icono?: string; // Emoji o nombre de icono
  color?: string; // Color para el badge/toast
  accion?: NotificationAction;
}

/**
 * Accion que puede realizar una notificacion
 */
export interface NotificationAction {
  tipo: 'navegar' | 'modal' | 'callback';
  destino?: string; // URL para navegar
  label?: string; // Texto del boton
  data?: any;
}

/**
 * Configuracion de sonido
 */
export interface NotificationSound {
  enabled: boolean;
  volume: number; // 0-1
  sound: 'default' | 'alert' | 'success' | 'warning' | 'error';
}

/**
 * Configuracion de notificaciones del usuario
 */
export interface NotificationSettings {
  userId: string;
  enabled: boolean;
  sound: NotificationSound;
  roles: UserRole[]; // Roles del usuario para filtrar notificaciones
  mutedTypes: NotificationType[]; // Tipos de notificacion silenciados
  updatedAt: Timestamp;
}

/**
 * Opciones para crear notificacion
 */
export interface CreateNotificationOptions {
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  prioridad?: NotificationPriority;
  rol_destino?: UserRole[];
  usuario_destino?: string;
  pedido_id?: string;
  pedido_numero?: string;
  data?: Record<string, any>;
  icono?: string;
  color?: string;
  accion?: NotificationAction;
  expiresInMinutes?: number;
}

/**
 * Filtros para consultar notificaciones
 */
export interface NotificationFilters {
  userId?: string;
  roles?: UserRole[];
  tipo?: NotificationType;
  leida?: boolean;
  limit?: number;
  includeExpired?: boolean;
}

/**
 * Estadisticas de notificaciones
 */
export interface NotificationStats {
  total: number;
  noLeidas: number;
  porTipo: Record<NotificationType, number>;
  porPrioridad: Record<NotificationPriority, number>;
}

/**
 * Resultado de operacion de notificacion
 */
export interface NotificationResult {
  success: boolean;
  notification?: Notification;
  error?: Error;
  message?: string;
}

/**
 * Payload para listener de notificaciones
 */
export interface NotificationListener {
  userId: string;
  roles: UserRole[];
  onNotification: (notification: Notification) => void;
  onError?: (error: Error) => void;
}

/**
 * Configuracion de iconos por tipo
 */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  nuevo_pedido: '🛎️',
  pedido_actualizado: '📝',
  pedido_listo: '✅',
  pedido_en_reparto: '🚗',
  pedido_entregado: '🎉',
  pedido_cancelado: '❌',
  incidencia: '⚠️',
  sistema: 'ℹ️',
  alerta: '🔔',
};

/**
 * Configuracion de colores por tipo
 */
export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  nuevo_pedido: '#3b82f6', // blue
  pedido_actualizado: '#8b5cf6', // purple
  pedido_listo: '#10b981', // green
  pedido_en_reparto: '#f59e0b', // amber
  pedido_entregado: '#10b981', // green
  pedido_cancelado: '#ef4444', // red
  incidencia: '#f59e0b', // amber
  sistema: '#6b7280', // gray
  alerta: '#ef4444', // red
};

/**
 * Configuracion de sonidos por prioridad
 */
export const NOTIFICATION_SOUNDS: Record<NotificationPriority, string> = {
  low: '/sounds/notification-low.mp3',
  normal: '/sounds/notification-normal.mp3',
  high: '/sounds/notification-high.mp3',
  urgent: '/sounds/notification-urgent.mp3',
};

/**
 * Duracion de toast por prioridad (en ms)
 */
export const TOAST_DURATION: Record<NotificationPriority, number> = {
  low: 3000,
  normal: 5000,
  high: 7000,
  urgent: 0, // No se cierra automaticamente
};
