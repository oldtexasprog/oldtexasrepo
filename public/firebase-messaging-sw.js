/**
 * Firebase Cloud Messaging Service Worker
 * Old Texas BBQ - CRM
 *
 * SEGURIDAD MEJORADA:
 * - Obtiene la configuración de Firebase de forma dinámica desde un API endpoint
 * - No hardcodea credenciales en el código
 * - Implementa caché para evitar múltiples peticiones
 * - Valida la configuración antes de inicializar
 *
 * Este archivo debe estar en la carpeta /public para que sea accesible
 * desde la raíz del sitio (requerido por Firebase)
 */

// Versión del Service Worker (cambiar para forzar actualización)
const SW_VERSION = '2.0.0';

// Importar Firebase scripts
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
);

// Variable global para almacenar la configuración
let firebaseApp = null;
let messaging = null;

/**
 * Obtiene la configuración de Firebase desde el API endpoint
 * Incluye caché para evitar múltiples peticiones
 */
async function getFirebaseConfig() {
  const CACHE_KEY = 'firebase-config';
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

  try {
    // Intentar obtener de cache primero
    const cache = await caches.open('firebase-config-cache');
    const cachedResponse = await cache.match(CACHE_KEY);

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      const cacheTime = cachedData.timestamp || 0;
      const now = Date.now();

      // Si el cache es válido (menos de 1 hora), usarlo
      if (now - cacheTime < CACHE_DURATION) {
        console.log('[SW] Usando configuración de Firebase desde caché');
        return cachedData.config;
      }
    }

    // Si no hay cache válido, obtener desde el API
    console.log('[SW] Obteniendo configuración de Firebase desde API...');
    const response = await fetch('/api/firebase-config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Firebase config: ${response.status} ${response.statusText}`
      );
    }

    const config = await response.json();

    // Validar que la configuración tenga los campos necesarios
    if (
      !config.apiKey ||
      !config.authDomain ||
      !config.projectId ||
      !config.messagingSenderId ||
      !config.appId
    ) {
      throw new Error('Invalid Firebase configuration received');
    }

    // Guardar en cache
    const cacheData = {
      config,
      timestamp: Date.now(),
    };

    await cache.put(
      CACHE_KEY,
      new Response(JSON.stringify(cacheData), {
        headers: { 'Content-Type': 'application/json' },
      })
    );

    console.log('[SW] ✅ Configuración de Firebase obtenida y cacheada');
    return config;
  } catch (error) {
    console.error('[SW] ❌ Error al obtener configuración de Firebase:', error);

    // Como fallback, intentar usar configuración hardcodeada (solo para desarrollo)
    // IMPORTANTE: Esto solo se usa si el endpoint falla
    console.warn('[SW] ⚠️ Usando configuración de fallback');
    return null;
  }
}

/**
 * Inicializa Firebase con la configuración obtenida
 */
async function initializeFirebase() {
  if (firebaseApp && messaging) {
    console.log('[SW] Firebase ya está inicializado');
    return messaging;
  }

  try {
    const config = await getFirebaseConfig();

    if (!config) {
      throw new Error('No se pudo obtener la configuración de Firebase');
    }

    // Inicializar Firebase
    firebaseApp = firebase.initializeApp(config);
    messaging = firebase.messaging();

    console.log('[SW] ✅ Firebase inicializado correctamente');
    return messaging;
  } catch (error) {
    console.error('[SW] ❌ Error al inicializar Firebase:', error);
    return null;
  }
}

/**
 * Manejar notificaciones en background
 * Se ejecuta cuando la app no está en foreground
 */
async function setupBackgroundMessageHandler() {
  const msg = await initializeFirebase();

  if (!msg) {
    console.error('[SW] No se pudo configurar el handler de mensajes');
    return;
  }

  msg.onBackgroundMessage((payload) => {
    console.log('[SW] 📨 Mensaje recibido en background:', payload);

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
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });
}

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
      return [{ action: 'view', title: 'Ver Detalles' }];
    default:
      return [];
  }
}

/**
 * Manejar clics en notificaciones
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 🖱️ Clic en notificación:', event);

  event.notification.close();

  // Obtener datos de la notificación
  const data = event.notification.data || {};
  const action = event.action;

  // Determinar URL de destino
  let urlToOpen = '/';

  if (action === 'view') {
    if (data.type === 'new-order' || data.type === 'order-status') {
      urlToOpen = `/pedidos/${data.orderId || ''}`;
    }
  } else if (action === 'dismiss') {
    // Solo cerrar la notificación (ya se cerró arriba)
    return;
  } else {
    // Clic en el cuerpo de la notificación (no en una acción)
    if (data.type === 'new-order' || data.type === 'order-status') {
      urlToOpen = `/pedidos/${data.orderId || ''}`;
    } else if (data.url) {
      urlToOpen = data.url;
    }
  }

  // Abrir o enfocar ventana
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
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
  console.log('[SW] 🔕 Notificación cerrada:', event.notification.tag);

  // Aquí puedes enviar analytics si lo necesitas
  // const data = event.notification.data || {};
  // fetch('/api/analytics/notification-closed', { ... })
});

/**
 * Manejar instalación del Service Worker
 */
self.addEventListener('install', (event) => {
  console.log(`[SW] 📦 Service Worker instalando (${SW_VERSION})`);

  // Forzar activación inmediata
  self.skipWaiting();

  // Pre-cachear la configuración de Firebase
  event.waitUntil(
    getFirebaseConfig().then(() => {
      console.log('[SW] ✅ Configuración pre-cacheada');
    })
  );
});

/**
 * Manejar activación del Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log(`[SW] ⚡ Service Worker activando (${SW_VERSION})`);

  event.waitUntil(
    clients.claim().then(() => {
      console.log('[SW] ✅ Service Worker activado y controlando clientes');
      // Inicializar Firebase después de activar
      return setupBackgroundMessageHandler();
    })
  );
});

/**
 * Manejar actualizaciones del Service Worker
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] ⏩ Saltando espera para actualización');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: SW_VERSION });
  }
});

/**
 * Log de versión
 */
console.log(`[SW] 🚀 Service Worker cargado - Versión ${SW_VERSION}`);
console.log('[SW] 🔒 Modo seguro: Configuración dinámica habilitada');
