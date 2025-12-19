'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getMessaging, type Messaging, isSupported } from 'firebase/messaging';

// Solo claves públicas necesarias en el cliente (Next.js expone NEXT_PUBLIC_*)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Singleton: evita "Firebase App already exists"
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Servicios básicos
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Messaging (solo en el cliente y si es soportado)
export const getMessagingInstance = async (): Promise<Messaging | null> => {
  try {
    const supported = await isSupported();
    if (typeof window !== 'undefined' && supported) {
      return getMessaging(app);
    }
    return null;
  } catch (error) {
    console.warn('Firebase Messaging no está soportado:', error);
    return null;
  }
};

export default app;
