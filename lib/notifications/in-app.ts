/**
 * In-App Notification System
 * Sistema de notificaciones basado en Firestore con listeners en tiempo real
 *
 * ALTERNATIVA GRATUITA A FIREBASE CLOUD MESSAGING (FCM)
 * - Notificaciones en tiempo real cuando la app esta abierta
 * - Persistencia en Firestore
 * - Sonido de alerta personalizado
 * - Sin necesidad de plan Blaze
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type {
  Notification,
  CreateNotificationOptions,
  NotificationFilters,
  NotificationStats,
  NotificationResult,
  NotificationListener,
  NotificationSettings,
  UserRole,
  NotificationType,
} from './types';
import {
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  NOTIFICATION_SOUNDS,
} from './types';

/**
 * Nombre de colecciones
 */
const COLLECTIONS = {
  NOTIFICATIONS: 'notificaciones',
  SETTINGS: 'notificacion_settings',
} as const;

/**
 * Asegura que Firebase esté configurado
 */
const ensureFirebase = () => {
  if (!db) {
    throw new Error('Firebase no está configurado');
  }
  return db;
};

/**
 * Crear notificacion
 */
export const createNotification = async (
  options: CreateNotificationOptions
): Promise<NotificationResult> => {
  if (!db) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado',
    };
  }

  try {
    // Validar que tenga al menos un destinatario
    if (!options.rol_destino && !options.usuario_destino) {
      return {
        success: false,
        error: new Error('Debe especificar rol_destino o usuario_destino'),
        message: 'Debe especificar al menos un destinatario',
      };
    }

    // Calcular fecha de expiracion si se proporciona
    let expiresAt: Timestamp | undefined;
    if (options.expiresInMinutes) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + options.expiresInMinutes);
      expiresAt = Timestamp.fromDate(now);
    }

    // Construir notificacion
    const notification: Omit<Notification, 'id'> = {
      tipo: options.tipo,
      titulo: options.titulo,
      mensaje: options.mensaje,
      prioridad: options.prioridad || 'normal',
      rol_destino: options.rol_destino || [],
      usuario_destino: options.usuario_destino,
      pedido_id: options.pedido_id,
      pedido_numero: options.pedido_numero,
      data: options.data,
      leida: false,
      leida_por: [],
      created_at: serverTimestamp() as Timestamp,
      expires_at: expiresAt,
      icono: options.icono || NOTIFICATION_ICONS[options.tipo],
      color: options.color || NOTIFICATION_COLORS[options.tipo],
      accion: options.accion,
    };

    // Guardar en Firestore
    const docRef = await addDoc(
      collection(ensureFirebase(), COLLECTIONS.NOTIFICATIONS),
      notification
    );

    return {
      success: true,
      notification: {
        ...notification,
        id: docRef.id,
        created_at: Timestamp.now(),
      } as Notification,
      message: 'Notificacion creada correctamente',
    };
  } catch (error: any) {
    console.error('Error al crear notificacion:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al crear notificacion',
    };
  }
};

/**
 * Marcar notificacion como leida
 */
export const markAsRead = async (
  notificationId: string,
  userId: string
): Promise<NotificationResult> => {
  try {
    const notificationRef = doc(ensureFirebase(), COLLECTIONS.NOTIFICATIONS, notificationId);

    // Obtener notificacion actual
    const notificationSnap = await getDoc(notificationRef);
    if (!notificationSnap.exists()) {
      return {
        success: false,
        error: new Error('Notificacion no encontrada'),
        message: 'Notificacion no encontrada',
      };
    }

    const notification = notificationSnap.data() as Notification;
    const leidaPor = notification.leida_por || [];

    // Verificar si ya esta marcada como leida por este usuario
    if (leidaPor.includes(userId)) {
      return {
        success: true,
        message: 'Notificacion ya estaba marcada como leida',
      };
    }

    // Actualizar
    await updateDoc(notificationRef, {
      leida: true,
      leida_por: [...leidaPor, userId],
    });

    return {
      success: true,
      message: 'Notificacion marcada como leida',
    };
  } catch (error: any) {
    console.error('Error al marcar notificacion como leida:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al marcar notificacion',
    };
  }
};

/**
 * Marcar todas las notificaciones como leidas para un usuario
 */
export const markAllAsRead = async (
  userId: string,
  roles: UserRole[]
): Promise<NotificationResult> => {
  try {
    // Obtener notificaciones no leidas del usuario
    const q = query(
      collection(ensureFirebase(), COLLECTIONS.NOTIFICATIONS),
      where('rol_destino', 'array-contains-any', roles),
      where('leida', '==', false)
    );

    const snapshot = await getDocs(q);

    // Marcar cada una como leida
    const promises = snapshot.docs.map(async (docSnap) => {
      const notification = docSnap.data() as Notification;
      const leidaPor = notification.leida_por || [];

      if (!leidaPor.includes(userId)) {
        await updateDoc(doc(ensureFirebase(), COLLECTIONS.NOTIFICATIONS, docSnap.id), {
          leida: true,
          leida_por: [...leidaPor, userId],
        });
      }
    });

    await Promise.all(promises);

    return {
      success: true,
      message: `${snapshot.docs.length} notificaciones marcadas como leidas`,
    };
  } catch (error: any) {
    console.error('Error al marcar todas como leidas:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al marcar notificaciones',
    };
  }
};

/**
 * Eliminar notificacion
 */
export const deleteNotification = async (
  notificationId: string
): Promise<NotificationResult> => {
  try {
    await deleteDoc(doc(ensureFirebase(), COLLECTIONS.NOTIFICATIONS, notificationId));

    return {
      success: true,
      message: 'Notificacion eliminada correctamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar notificacion:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al eliminar notificacion',
    };
  }
};

/**
 * Limpiar notificaciones antiguas (mas de X dias)
 */
export const cleanOldNotifications = async (
  daysOld: number = 30
): Promise<NotificationResult> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

    // Obtener notificaciones antiguas
    const q = query(
      collection(ensureFirebase(), COLLECTIONS.NOTIFICATIONS),
      where('created_at', '<', cutoffTimestamp)
    );

    const snapshot = await getDocs(q);

    // Eliminar cada una
    const promises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(ensureFirebase(), COLLECTIONS.NOTIFICATIONS, docSnap.id))
    );

    await Promise.all(promises);

    return {
      success: true,
      message: `${snapshot.docs.length} notificaciones antiguas eliminadas`,
    };
  } catch (error: any) {
    console.error('Error al limpiar notificaciones antiguas:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al limpiar notificaciones',
    };
  }
};

/**
 * Obtener estadisticas de notificaciones
 */
export const getNotificationStats = async (
  userId: string,
  roles: UserRole[]
): Promise<NotificationStats> => {
  try {
    // Obtener todas las notificaciones del usuario
    const q = query(
      collection(ensureFirebase(), COLLECTIONS.NOTIFICATIONS),
      where('rol_destino', 'array-contains-any', roles)
    );

    const snapshot = await getDocs(q);

    const stats: NotificationStats = {
      total: snapshot.docs.length,
      noLeidas: 0,
      porTipo: {} as Record<NotificationType, number>,
      porPrioridad: {} as Record<string, number>,
    };

    snapshot.docs.forEach((docSnap) => {
      const notification = docSnap.data() as Notification;

      // Verificar si esta leida por este usuario
      const leidaPor = notification.leida_por || [];
      if (!leidaPor.includes(userId)) {
        stats.noLeidas++;
      }

      // Contar por tipo
      stats.porTipo[notification.tipo] =
        (stats.porTipo[notification.tipo] || 0) + 1;

      // Contar por prioridad
      stats.porPrioridad[notification.prioridad] =
        (stats.porPrioridad[notification.prioridad] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error al obtener estadisticas:', error);
    return {
      total: 0,
      noLeidas: 0,
      porTipo: {} as Record<NotificationType, number>,
      porPrioridad: {} as Record<string, number>,
    };
  }
};

/**
 * Listener de notificaciones en tiempo real
 */
export const subscribeToNotifications = (
  listener: NotificationListener
): Unsubscribe => {
  try {
    // Construir query para notificaciones del usuario
    const q = query(
      collection(ensureFirebase(), COLLECTIONS.NOTIFICATIONS),
      where('rol_destino', 'array-contains-any', listener.roles),
      orderBy('created_at', 'desc'),
      limit(50)
    );

    // Escuchar cambios en tiempo real
    return onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const notification = {
              ...change.doc.data(),
              id: change.doc.id,
            } as Notification;

            // Verificar si el usuario ya la leyo
            const leidaPor = notification.leida_por || [];
            if (!leidaPor.includes(listener.userId)) {
              // Notificacion nueva no leida
              listener.onNotification(notification);
            }
          }
        });
      },
      (error) => {
        console.error('Error en listener de notificaciones:', error);
        listener.onError?.(error as Error);
      }
    );
  } catch (error) {
    console.error('Error al configurar listener:', error);
    listener.onError?.(error as Error);
    return () => {}; // Retornar funcion vacia
  }
};

/**
 * Reproducir sonido de notificacion
 */
export const playNotificationSound = (
  prioridad: Notification['prioridad'] = 'normal',
  volume: number = 0.5
): void => {
  try {
    const soundUrl = NOTIFICATION_SOUNDS[prioridad];
    const audio = new Audio(soundUrl);
    audio.volume = Math.max(0, Math.min(1, volume)); // Asegurar 0-1
    audio.play().catch((error) => {
      console.warn('No se pudo reproducir sonido:', error);
    });
  } catch (error) {
    console.error('Error al reproducir sonido:', error);
  }
};

/**
 * Helpers para crear notificaciones especificas
 */

export const notifyNewOrder = (
  pedidoId: string,
  pedidoNumero: string
): Promise<NotificationResult> => {
  return createNotification({
    tipo: 'nuevo_pedido',
    titulo: 'Nuevo Pedido',
    mensaje: `Pedido #${pedidoNumero} recibido`,
    prioridad: 'high',
    rol_destino: ['cocina', 'encargado'],
    pedido_id: pedidoId,
    pedido_numero: pedidoNumero,
    accion: {
      tipo: 'navegar',
      destino: `/pedidos/${pedidoId}`,
      label: 'Ver pedido',
    },
  });
};

export const notifyOrderReady = (
  pedidoId: string,
  pedidoNumero: string
): Promise<NotificationResult> => {
  return createNotification({
    tipo: 'pedido_listo',
    titulo: 'Pedido Listo',
    mensaje: `Pedido #${pedidoNumero} esta listo`,
    prioridad: 'high',
    rol_destino: ['repartidor', 'cajera'],
    pedido_id: pedidoId,
    pedido_numero: pedidoNumero,
    accion: {
      tipo: 'navegar',
      destino: `/pedidos/${pedidoId}`,
      label: 'Ver pedido',
    },
  });
};

export const notifyOrderDelivered = (
  pedidoId: string,
  pedidoNumero: string
): Promise<NotificationResult> => {
  return createNotification({
    tipo: 'pedido_entregado',
    titulo: 'Pedido Entregado',
    mensaje: `Pedido #${pedidoNumero} fue entregado`,
    prioridad: 'normal',
    rol_destino: ['cajera', 'encargado'],
    pedido_id: pedidoId,
    pedido_numero: pedidoNumero,
  });
};

export const notifyIncident = (
  titulo: string,
  mensaje: string,
  roles: UserRole[]
): Promise<NotificationResult> => {
  return createNotification({
    tipo: 'incidencia',
    titulo,
    mensaje,
    prioridad: 'urgent',
    rol_destino: roles,
  });
};

/**
 * Configuracion de notificaciones del usuario
 */
export const getNotificationSettings = async (
  userId: string
): Promise<NotificationSettings | null> => {
  try {
    const settingsRef = doc(ensureFirebase(), COLLECTIONS.SETTINGS, userId);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      return null;
    }

    return settingsSnap.data() as NotificationSettings;
  } catch (error) {
    console.error('Error al obtener configuracion:', error);
    return null;
  }
};

export const saveNotificationSettings = async (
  settings: NotificationSettings
): Promise<NotificationResult> => {
  try {
    const settingsRef = doc(ensureFirebase(), COLLECTIONS.SETTINGS, settings.userId);

    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Configuracion guardada correctamente',
    };
  } catch (error: any) {
    console.error('Error al guardar configuracion:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al guardar configuracion',
    };
  }
};
