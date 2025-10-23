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
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import type { FirebaseConfig } from './types';

/**
 * Validar que todas las variables de entorno requeridas estén presentes
 */
const validateConfig = (): void => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.\n' +
        'See .env.example for reference.'
    );
  }
};

/**
 * Configuración de Firebase desde variables de entorno
 */
const getFirebaseConfig = (): FirebaseConfig => {
  validateConfig();

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
const initializeFirebaseApp = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const config = getFirebaseConfig();
  return initializeApp(config);
};

/**
 * Instancia de Firebase App
 */
export const app: FirebaseApp = initializeFirebaseApp();

/**
 * Firebase Authentication
 * Servicio para autenticación de usuarios
 */
export const auth: Auth = getAuth(app);

/**
 * Cloud Firestore
 * Base de datos NoSQL para almacenar datos estructurados
 */
export const db: Firestore = getFirestore(app);

/**
 * Cloud Storage
 * Almacenamiento de archivos (imágenes, documentos, etc.)
 */
export const storage: FirebaseStorage = getStorage(app);

/**
 * Firebase Cloud Messaging
 * Servicio de notificaciones push (solo disponible en navegador)
 */
let messagingInstance: Messaging | null = null;

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') {
    return null; // Messaging no está disponible en SSR
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
  if (typeof window === 'undefined') {
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
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
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
  console.log('🔥 Firebase inicializado correctamente');
  console.log('📦 Proyecto:', firebaseInfo.projectId);
  console.log('🌍 Entorno:', firebaseInfo.environment);
  console.log('🧪 Emulador:', firebaseInfo.usingEmulator ? 'Sí' : 'No');
}

/**
 * Export default de la app
 */
export default app;
