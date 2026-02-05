/**
 * Firebase Admin SDK Configuration
 * Old Texas BBQ - CRM
 *
 * Para producción, configura FIREBASE_SERVICE_ACCOUNT_KEY en .env.local
 * con el JSON del service account codificado en base64
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function initializeAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Opción 1: Usar service account desde variable de entorno (base64 encoded)
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountBase64) {
    try {
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
      );

      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } catch (e) {
      console.error('Error parsing service account:', e);
    }
  }

  // Opción 2: Usar variables de entorno individuales
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  }

  // Opción 3: En desarrollo, usar Application Default Credentials o emulador
  // Esto funciona si estás en Google Cloud o tienes gcloud configurado localmente
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Firebase Admin: No service account configured. ' +
      'Using project ID only (limited functionality). ' +
      'Set FIREBASE_SERVICE_ACCOUNT_KEY for full admin access.'
    );

    // Inicializar sin credenciales (funcionará con emulador o ADC)
    return initializeApp({
      projectId: projectId || 'oldtexasbbq-ecb85',
    });
  }

  throw new Error(
    'Firebase Admin SDK requires proper credentials in production. ' +
    'Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.'
  );
}

// Lazy initialization
function getAdminApp(): App {
  if (!adminApp) {
    adminApp = initializeAdmin();
  }
  return adminApp;
}

function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

// Exportar getters para lazy initialization
export { getAdminApp, getAdminDb, getAdminAuth };

// También exportar instancias directas para compatibilidad
export const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    return (getAdminDb() as any)[prop];
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    return (getAdminAuth() as any)[prop];
  },
});
