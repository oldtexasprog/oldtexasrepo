/**
 * Firebase Cloud Messaging (FCM) - Notificaciones Push
 * Old Texas BBQ - CRM
 *
 * Este módulo maneja:
 * - Solicitud de permisos de notificaciones
 * - Registro de tokens FCM
 * - Suscripción a tópicos por rol
 * - Manejo de mensajes en foreground
 */

'use client';

import { getMessagingInstance } from '@/lib/firebase/config';
import { getToken, onMessage, type Messaging } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

// VAPID Key (se obtiene de Firebase Console > Project Settings > Cloud Messaging)
// TODO: Reemplazar con tu VAPID key real
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';

/**
 * Tipos de notificaciones
 */
export type NotificationType =
  | 'new-order'
  | 'order-ready'
  | 'order-delivered'
  | 'order-assigned'
  | 'shift-alert'
  | 'system';

/**
 * Solicita permiso para mostrar notificaciones push
 * @returns true si se concedió el permiso, false en caso contrario
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    // Verificar si las notificaciones están soportadas
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    // Si ya se concedió el permiso, retornar true
    if (Notification.permission === 'granted') {
      console.log('✅ Permiso de notificaciones ya concedido');
      return true;
    }

    // Si ya se denegó el permiso, retornar false
    if (Notification.permission === 'denied') {
      console.warn('❌ Permiso de notificaciones denegado por el usuario');
      toast.error(
        'Notificaciones bloqueadas',
        {
          description: 'Por favor, habilita las notificaciones en la configuración de tu navegador',
        }
      );
      return false;
    }

    // Solicitar permiso
    console.log('🔔 Solicitando permiso de notificaciones...');
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('✅ Permiso de notificaciones concedido');
      toast.success('Notificaciones activadas', {
        description: 'Ahora recibirás notificaciones de pedidos y alertas',
      });
      return true;
    } else {
      console.warn('❌ Permiso de notificaciones denegado');
      return false;
    }
  } catch (error) {
    console.error('Error al solicitar permiso de notificaciones:', error);
    return false;
  }
}

/**
 * Obtiene el token FCM del dispositivo actual
 * @returns Token FCM o null si no se pudo obtener
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    // Verificar si tenemos permiso
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    // Obtener instancia de messaging
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn('Firebase Messaging no está disponible');
      return null;
    }

    // Registrar service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        {
          scope: '/',
        }
      );
      console.log('✅ Service Worker registrado:', registration);

      // Esperar a que esté activo
      await navigator.serviceWorker.ready;
    }

    // Obtener token
    console.log('🔑 Obteniendo token FCM...');
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY || undefined,
    });

    if (token) {
      console.log('✅ Token FCM obtenido:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('No se pudo obtener el token FCM');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener token FCM:', error);
    return null;
  }
}

/**
 * Guarda el token FCM del usuario en Firestore
 * @param userId ID del usuario
 * @param token Token FCM
 */
export async function saveFCMToken(
  userId: string,
  token: string
): Promise<void> {
  try {
    const tokenRef = doc(db, 'usuarios', userId, 'tokens', token);
    await setDoc(
      tokenRef,
      {
        token,
        createdAt: serverTimestamp(),
        lastUsed: serverTimestamp(),
        platform: navigator.userAgent,
      },
      { merge: true }
    );
    console.log('✅ Token FCM guardado en Firestore');
  } catch (error) {
    console.error('Error al guardar token FCM:', error);
  }
}

/**
 * Inicializa FCM para el usuario actual
 * - Solicita permisos
 * - Obtiene token
 * - Guarda token en Firestore
 * - Configura listener para mensajes en foreground
 *
 * @param userId ID del usuario
 * @returns Token FCM o null
 */
export async function initializeFCM(userId: string): Promise<string | null> {
  try {
    console.log('🚀 Inicializando FCM para usuario:', userId);

    // Obtener token
    const token = await getFCMToken();
    if (!token) {
      console.warn('No se pudo inicializar FCM (sin token)');
      return null;
    }

    // Guardar token en Firestore
    await saveFCMToken(userId, token);

    // Configurar listener para mensajes en foreground
    const messaging = await getMessagingInstance();
    if (messaging) {
      setupForegroundMessageListener(messaging);
    }

    console.log('✅ FCM inicializado correctamente');
    return token;
  } catch (error) {
    console.error('Error al inicializar FCM:', error);
    return null;
  }
}

/**
 * Configura el listener para recibir mensajes en foreground
 * (cuando la app está abierta)
 */
function setupForegroundMessageListener(messaging: Messaging): void {
  onMessage(messaging, (payload) => {
    console.log('📨 Mensaje recibido en foreground:', payload);

    const { notification, data } = payload;

    if (notification) {
      // Mostrar notificación como toast
      toast(notification.title || 'Nueva notificación', {
        description: notification.body,
        duration: 5000,
      });

      // Reproducir sonido
      playNotificationSound(data?.type as NotificationType);
    }
  });
}

/**
 * Reproduce un sonido de notificación según el tipo
 */
function playNotificationSound(type?: NotificationType): void {
  try {
    let soundFile = '/sounds/notification.mp3'; // Sonido por defecto

    // Seleccionar sonido según tipo
    switch (type) {
      case 'new-order':
        soundFile = '/sounds/new-order.mp3';
        break;
      case 'order-ready':
        soundFile = '/sounds/order-ready.mp3';
        break;
      case 'order-delivered':
        soundFile = '/sounds/success.mp3';
        break;
      case 'shift-alert':
        soundFile = '/sounds/alert.mp3';
        break;
    }

    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // Ignorar errores (puede fallar si el usuario no ha interactuado)
      console.log('No se pudo reproducir sonido:', err.message);
    });
  } catch (error) {
    // Ignorar errores de reproducción
  }
}

/**
 * Suscribe al usuario a un tópico de FCM
 * Los tópicos permiten enviar notificaciones a grupos de usuarios
 * Por ejemplo: 'cocina', 'repartidores', 'cajeras'
 *
 * NOTA: La suscripción a tópicos debe hacerse desde el servidor
 * usando Firebase Admin SDK. Esta función es un placeholder.
 *
 * @param userId ID del usuario
 * @param topic Nombre del tópico (rol)
 */
export async function subscribeToTopic(
  userId: string,
  topic: string
): Promise<void> {
  try {
    console.log(`📢 Suscribiendo usuario ${userId} al tópico: ${topic}`);

    // TODO: Implementar endpoint en API route para suscribir a tópico
    // usando Firebase Admin SDK desde el servidor

    // Por ahora, solo guardamos la intención en Firestore
    const userRef = doc(db, 'usuarios', userId);
    await setDoc(
      userRef,
      {
        fcmTopics: [topic],
        fcmTopicsUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log('✅ Usuario registrado en tópico (pending server subscription)');
  } catch (error) {
    console.error('Error al suscribir a tópico:', error);
  }
}

/**
 * Verifica si el navegador soporta notificaciones push
 */
export function isNotificationSupported(): boolean {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Obtiene el estado actual del permiso de notificaciones
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Hook helper para verificar si las notificaciones están habilitadas
 */
export function areNotificationsEnabled(): boolean {
  return (
    isNotificationSupported() &&
    getNotificationPermissionStatus() === 'granted'
  );
}
