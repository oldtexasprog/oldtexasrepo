/**
 * Firebase Configuration
 * Configuración central de Firebase para Old Texas BBQ CRM
 *
 * Este archivo inicializa y exporta todos los servicios de Firebase necesarios:
 * - Authentication: Para login/logout de usuarios
 * - Firestore: Base de datos para pedidos, productos, usuarios
 * - Storage: Almacenamiento de imágenes y archivos
 * - Messaging: Notificaciones push (opcional)
 * - Analytics: Métricas y eventos (opcional)
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from 'firebase/storage';
import {
  getMessaging,
  isSupported as isMessagingSupported,
  type Messaging,
} from 'firebase/messaging';
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from 'firebase/analytics';
import type { FirebaseConfig } from './types';

/**
 * Validar que todas las variables de entorno requeridas estén presentes
 * Solo valida en el cliente (browser), no en el servidor
 */
const validateConfig = (): boolean => {
  // Skip validation en el servidor de Next.js
  if (typeof window === 'undefined') {
    return false;
  }

  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName] || process.env[varName]?.includes('your-')
  );

  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Firebase no está configurado. Variables faltantes: ${missingVars.join(', ')}\n` +
        'Algunas funcionalidades no estarán disponibles.\n' +
        'Para configurar Firebase, crea un archivo .env.local con las credenciales.\n' +
        'Ver: docs/CONFIGURAR_FIREBASE.md'
    );
    return false;
  }

  return true;
};

/**
 * Configuración de Firebase desde variables de entorno
 */
const getFirebaseConfig = (): FirebaseConfig | null => {
  if (!validateConfig()) {
    return null;
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};

/**
 * Inicializar Firebase App
 * Solo se inicializa una vez, reutiliza la instancia existente si ya está inicializada
 */
const initializeFirebaseApp = (): FirebaseApp | null => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const config = getFirebaseConfig();
  if (!config) {
    return null;
  }

  return initializeApp(config);
};

/**
 * Instancia de Firebase App
 */
export const app: FirebaseApp | null = initializeFirebaseApp();

/**
 * Firebase Authentication
 * Servicio para autenticación de usuarios
 */
export const auth: Auth | null = app ? getAuth(app) : null;

/**
 * Cloud Firestore
 * Base de datos NoSQL para almacenar datos estructurados
 */
export const db: Firestore | null = app ? getFirestore(app) : null;

/**
 * Cloud Storage
 * Almacenamiento de archivos (imágenes, documentos, etc.)
 */
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

/**
 * Firebase Cloud Messaging
 * Servicio de notificaciones push (solo disponible en navegador)
 */
let messagingInstance: Messaging | null = null;

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined' || !app) {
    return null; // Messaging no está disponible en SSR o si Firebase no está configurado
  }

  if (messagingInstance) {
    return messagingInstance;
  }

  try {
    const supported = await isMessagingSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    }
  } catch (error) {
    console.warn('Firebase Messaging no está disponible:', error);
  }

  return null;
};

/**
 * Firebase Analytics
 * Servicio de analíticas (solo disponible en navegador)
 */
export const initializeAnalytics = async () => {
  if (typeof window === 'undefined' || !app) {
    return null;
  }

  try {
    const supported = await isAnalyticsSupported();
    if (supported) {
      return getAnalytics(app);
    }
  } catch (error) {
    console.warn('Firebase Analytics no está disponible:', error);
  }

  return null;
};

/**
 * Conectar a emuladores de Firebase (solo en desarrollo)
 * Útil para desarrollo local sin consumir cuota de Firebase
 */
if (
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' &&
  app &&
  db &&
  storage
) {
  try {
    // Conectar Firestore al emulador
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('📡 Conectado al emulador de Firestore');

    // Conectar Storage al emulador
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('📡 Conectado al emulador de Storage');
  } catch (error) {
    console.warn('⚠️ No se pudo conectar a los emuladores de Firebase:', error);
  }
}

/**
 * Información del proyecto
 */
export const firebaseInfo = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  environment: process.env.NODE_ENV,
  usingEmulator: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true',
};

/**
 * Log de inicialización
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (app) {
    console.log('🔥 Firebase inicializado correctamente');
    console.log('📦 Proyecto:', firebaseInfo.projectId);
    console.log('🌍 Entorno:', firebaseInfo.environment);
    console.log('🧪 Emulador:', firebaseInfo.usingEmulator ? 'Sí' : 'No');
  } else {
    console.log('⚠️ Firebase no está configurado - Modo demo activado');
    console.log('💡 Para habilitar Firebase, configura las variables de entorno en .env.local');
  }
}

/**
 * Export default de la app
 */
export default app;
