/**
 * Firebase Types
 * Tipos TypeScript para la configuración y servicios de Firebase
 */

import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore, Timestamp } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import type { Messaging } from 'firebase/messaging';

/**
 * Configuración de Firebase
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Servicios de Firebase
 */
export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  messaging?: Messaging;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Resultado de operaciones de autenticación
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: Error;
  message?: string;
}

/**
 * Credenciales de inicio de sesión
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos de registro de usuario
 */
export interface RegisterData extends LoginCredentials {
  nombre: string;
  rol: 'cajera' | 'cocina' | 'repartidor' | 'encargado' | 'admin';
}

/**
 * Opciones de consulta de Firestore
 */
export interface QueryOptions {
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'array-contains';
    value: any;
  }>;
  limit?: number;
  startAfter?: any;
}

/**
 * Resultado de consulta paginada
 */
export interface PaginatedResult<T> {
  data: T[];
  lastVisible: any;
  hasMore: boolean;
}

/**
 * Opciones de subida de archivo
 */
export interface UploadOptions {
  folder: 'productos' | 'comprobantes' | 'usuarios';
  id: string;
  filename?: string;
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
  onProgress?: (progress: number) => void;
}

/**
 * Resultado de subida de archivo
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: Error;
  message?: string;
}

/**
 * Opciones de descarga de archivo
 */
export interface DownloadOptions {
  path: string;
  filename?: string;
}

/**
 * Configuración de notificación push
 */
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, string>;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Token de FCM
 */
export interface FCMToken {
  token: string;
  userId: string;
  device: string;
  createdAt: Timestamp;
}

/**
 * Documento de Firestore con ID
 */
export interface FirestoreDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Opciones de batch write
 */
export interface BatchOperation<T> {
  type: 'set' | 'update' | 'delete';
  collection: string;
  id?: string;
  data?: Partial<T>;
}

/**
 * Resultado de operación de Firestore
 */
export interface FirestoreResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
}

/**
 * Utilidades de conversión de tipos
 */
export type FirestoreTimestamp = Timestamp;

export type FirestoreData<T> = {
  [K in keyof T]: T[K] extends Date
    ? Timestamp | Date
    : T[K] extends Date | undefined
      ? Timestamp | Date | undefined
      : T[K];
};

/**
 * Tipos de eventos de Analytics
 */
export type AnalyticsEvent =
  | 'pedido_creado'
  | 'pedido_actualizado'
  | 'pedido_cancelado'
  | 'login'
  | 'logout'
  | 'turno_abierto'
  | 'turno_cerrado'
  | 'producto_creado'
  | 'producto_actualizado';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  params?: Record<string, any>;
}
