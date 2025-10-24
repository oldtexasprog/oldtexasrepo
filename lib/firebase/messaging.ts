/**
 * Firebase Cloud Messaging Utilities
 * Utilidades para notificaciones push en Old Texas BBQ CRM
 *
 * Funcionalidades:
 * - Solicitar permisos de notificación
 * - Obtener token FCM
 * - Registrar token en Firestore
 * - Recibir notificaciones en foreground
 * - Manejar clics en notificaciones
 */

import { getMessagingInstance } from './config';
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { NotificationPayload, FCMToken } from './types';

/**
 * VAPID Key (debe estar en .env.local)
 * Obtener de Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
 */
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

/**
 * Verificar si el navegador soporta notificaciones
 */
export const isNotificationSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator
  );
};

/**
 * Verificar el estado de permisos de notificación
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  return Notification.permission;
};

/**
 * Solicitar permiso para enviar notificaciones
 */
export const requestNotificationPermission = async (): Promise<{
  granted: boolean;
  permission: NotificationPermission;
}> => {
  if (!isNotificationSupported()) {
    return {
      granted: false,
      permission: 'denied',
    };
  }

  try {
    const permission = await Notification.requestPermission();

    return {
      granted: permission === 'granted',
      permission,
    };
  } catch (error) {
    console.error('Error al solicitar permisos de notificación:', error);
    return {
      granted: false,
      permission: 'denied',
    };
  }
};

/**
 * Obtener token FCM del dispositivo
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Verificar soporte
    if (!isNotificationSupported()) {
      console.warn('Notificaciones no soportadas en este navegador');
      return null;
    }

    // Verificar VAPID key
    if (!VAPID_KEY) {
      console.error('VAPID key no configurada');
      return null;
    }

    // Solicitar permisos si no están concedidos
    const permission = getNotificationPermission();
    if (permission !== 'granted') {
      const result = await requestNotificationPermission();
      if (!result.granted) {
        console.warn('Permisos de notificación no concedidos');
        return null;
      }
    }

    // Registrar service worker si no está registrado
    await registerServiceWorker();

    // Obtener instancia de messaging
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn('Messaging no disponible');
      return null;
    }

    // Obtener token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log('Token FCM obtenido:', token);
      return token;
    } else {
      console.warn('No se pudo obtener token FCM');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener token FCM:', error);
    return null;
  }
};

/**
 * Registrar service worker para notificaciones
 */
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      console.log('Service Worker registrado:', registration);
      return registration;
    } catch (error) {
      console.error('Error al registrar Service Worker:', error);
      return null;
    }
  };

/**
 * Guardar token FCM en Firestore
 */
export const saveFCMToken = async (
  userId: string,
  token: string
): Promise<boolean> => {
  try {
    const device = getDeviceInfo();

    const tokenData: Partial<FCMToken> = {
      token,
      userId,
      device,
      createdAt: serverTimestamp() as any,
    };

    // Guardar en colección fcmTokens usando el token como ID
    // Esto previene duplicados del mismo dispositivo
    await setDoc(doc(db, 'fcmTokens', token), tokenData);

    console.log('Token FCM guardado en Firestore');
    return true;
  } catch (error) {
    console.error('Error al guardar token FCM:', error);
    return false;
  }
};

/**
 * Eliminar token FCM de Firestore
 */
export const deleteFCMToken = async (token: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'fcmTokens', token));
    console.log('Token FCM eliminado de Firestore');
    return true;
  } catch (error) {
    console.error('Error al eliminar token FCM:', error);
    return false;
  }
};

/**
 * Inicializar FCM para el usuario actual
 * Obtiene token y lo guarda en Firestore
 */
export const initializeFCM = async (userId: string): Promise<string | null> => {
  try {
    const token = await getFCMToken();

    if (token) {
      await saveFCMToken(userId, token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error al inicializar FCM:', error);
    return null;
  }
};

/**
 * Escuchar mensajes en foreground
 */
export const onForegroundMessage = async (
  callback: (payload: MessagePayload) => void
) => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn('Messaging no disponible para foreground messages');
      return () => {};
    }

    return onMessage(messaging, (payload) => {
      console.log('Mensaje recibido en foreground:', payload);
      callback(payload);

      // Mostrar notificación si el navegador lo permite
      if (payload.notification) {
        showNotification({
          title: payload.notification.title || 'Nueva notificación',
          body: payload.notification.body || '',
          icon: payload.notification.icon,
          image: payload.notification.image,
          data: payload.data,
        });
      }
    });
  } catch (error) {
    console.error('Error al configurar foreground messages:', error);
    return () => {};
  }
};

/**
 * Mostrar notificación local
 */
export const showNotification = async (
  notification: NotificationPayload
): Promise<void> => {
  if (!isNotificationSupported()) {
    console.warn('Notificaciones no soportadas');
    return;
  }

  if (getNotificationPermission() !== 'granted') {
    console.warn('Permisos de notificación no concedidos');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/icon-192x192.png',
      badge: notification.badge || '/badge-72x72.png',
      ...(notification.image && { image: notification.image }),
      data: notification.data,
      tag: notification.tag || 'default',
      requireInteraction: notification.requireInteraction || false,
    });
  } catch (error) {
    console.error('Error al mostrar notificación:', error);
  }
};

/**
 * Obtener información del dispositivo
 */
const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  let device = 'Unknown';

  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    if (/iPhone/.test(userAgent)) {
      device = 'iPhone';
    } else if (/iPad/.test(userAgent)) {
      device = 'iPad';
    } else if (/Android/.test(userAgent)) {
      device = 'Android';
    } else {
      device = 'Mobile';
    }
  } else {
    if (/Chrome/.test(userAgent)) {
      device = 'Chrome Desktop';
    } else if (/Firefox/.test(userAgent)) {
      device = 'Firefox Desktop';
    } else if (/Safari/.test(userAgent)) {
      device = 'Safari Desktop';
    } else if (/Edge/.test(userAgent)) {
      device = 'Edge Desktop';
    } else {
      device = 'Desktop';
    }
  }

  return device;
};

/**
 * Helper para notificaciones de pedidos
 */
export const notifyNewOrder = async (orderId: string, orderNumber: string) => {
  await showNotification({
    title: 'Nuevo Pedido',
    body: `Pedido #${orderNumber} recibido`,
    icon: '/icon-192x192.png',
    tag: `order-${orderId}`,
    data: {
      type: 'new-order',
      orderId,
    },
    requireInteraction: true,
  });
};

export const notifyOrderStatusChange = async (
  orderId: string,
  orderNumber: string,
  newStatus: string
) => {
  const statusMessages: Record<string, string> = {
    recibido: 'Pedido recibido',
    en_preparacion: 'Pedido en preparación',
    listo: 'Pedido listo para recoger/entregar',
    en_reparto: 'Pedido en camino',
    entregado: 'Pedido entregado',
    cancelado: 'Pedido cancelado',
  };

  await showNotification({
    title: `Pedido #${orderNumber}`,
    body: statusMessages[newStatus] || 'Estado actualizado',
    icon: '/icon-192x192.png',
    tag: `order-${orderId}`,
    data: {
      type: 'order-status',
      orderId,
      status: newStatus,
    },
  });
};

/**
 * Deshabilitar notificaciones para el usuario actual
 */
export const disableNotifications = async (
  userId: string
): Promise<boolean> => {
  try {
    const token = await getFCMToken();
    if (token) {
      await deleteFCMToken(token);
    }
    return true;
  } catch (error) {
    console.error('Error al deshabilitar notificaciones:', error);
    return false;
  }
};

/**
 * Verificar si las notificaciones están habilitadas
 */
export const areNotificationsEnabled = (): boolean => {
  return isNotificationSupported() && getNotificationPermission() === 'granted';
};
