/**
 * Firebase Configuration for Server-Side (API Routes)
 * Old Texas BBQ - CRM
 *
 * Este archivo NO tiene 'use client' y puede usarse en API routes
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Configuración de Firebase (mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Inicializar Firebase para el servidor
function getServerApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

// Exportar instancia de Firestore para servidor
export function getServerDb(): Firestore {
  return getFirestore(getServerApp());
}

// También exportar la app si se necesita
export function getServerFirebaseApp(): FirebaseApp {
  return getServerApp();
}
