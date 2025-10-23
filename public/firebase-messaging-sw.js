/**
 * Firebase Cloud Messaging Service Worker
 * Maneja las notificaciones push en background
 *
 * Este archivo debe estar en la carpeta /public para que sea accesible
 * desde la raíz del sitio (requerido por Firebase)
 */

// Importar Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con la del cliente)
// NOTA: Esta configuración es pública y no contiene información sensible
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener instancia de Messaging
const messaging = firebase.messaging();

/**
 * Manejar notificaciones en background
 * Se ejecuta cuando la app no está en foreground
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  // Extraer datos de la notificación
  const notificationTitle = payload.notification?.title || 'Old Texas BBQ';
  const notificationOptions = {
    body: payload.notification?.body || 'Nueva notificación',
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.type || 'default',
    data: payload.data,
    requireInteraction: payload.data?.requireInteraction === 'true',
    vibrate: [200, 100, 200],
    actions: getNotificationActions(payload.data?.type),
  };

  // Mostrar notificación
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Obtener acciones según el tipo de notificación
 */
function getNotificationActions(type) {
  switch (type) {
    case 'new-order':
      return [
        { action: 'view', title: 'Ver Pedido' },
        { action: 'dismiss', title: 'Descartar' },
      ];
    case 'order-status':
      return [
        { action: 'view', title: 'Ver Detalles' },
      ];
    default:
      return [];
  }
}

/**
 * Manejar clics en notificaciones
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);

  event.notification.close();

  // Obtener datos de la notificación
  const data = event.notification.data || {};
  const action = event.action;

  // Determinar URL de destino
  let urlToOpen = '/';

  if (action === 'view') {
    if (data.type === 'new-order' || data.type === 'order-status') {
      urlToOpen = `/pedidos/${data.orderId}`;
    }
  } else if (action === 'dismiss') {
    // Solo cerrar la notificación (ya se cerró arriba)
    return;
  } else {
    // Clic en el cuerpo de la notificación (no en una acción)
    if (data.type === 'new-order' || data.type === 'order-status') {
      urlToOpen = `/pedidos/${data.orderId}`;
    } else if (data.url) {
      urlToOpen = data.url;
    }
  }

  // Abrir o enfocar ventana
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Buscar si ya hay una ventana abierta
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

/**
 * Manejar cierre de notificaciones
 */
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event);

  // Aquí puedes enviar analytics si lo necesitas
  const data = event.notification.data || {};

  // Ejemplo: tracking de notificaciones cerradas
  // fetch('/api/analytics/notification-closed', {
  //   method: 'POST',
  //   body: JSON.stringify({ type: data.type, id: data.orderId }),
  // });
});

/**
 * Manejar instalación del Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing');
  self.skipWaiting();
});

/**
 * Manejar activación del Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating');
  event.waitUntil(clients.claim());
});

/**
 * Log de versión
 */
console.log('[firebase-messaging-sw.js] Service Worker loaded - Version 1.0.0');
