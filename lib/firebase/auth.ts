/**
 * Firebase Authentication Utilities
 * Utilidades para autenticación de usuarios en Old Texas BBQ CRM
 *
 * Funcionalidades:
 * - Login/Logout
 * - Registro de usuarios
 * - Recuperación de contraseña
 * - Actualización de perfil
 * - Gestión de sesiones
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { AuthResult, LoginCredentials, RegisterData } from './types';
import type { Usuario, Role } from '@/lib/types';

/**
 * Iniciar sesión con email y contraseña
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  if (!auth || !db) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado. Contacta al administrador.',
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Verificar que el usuario tenga un documento en Firestore
    const userDoc = await getDoc(doc(db, 'usuarios', userCredential.user.uid));

    if (!userDoc.exists()) {
      await signOut(auth);
      return {
        success: false,
        error: new Error('Usuario no encontrado en la base de datos'),
        message: 'Usuario no encontrado. Contacta al administrador.',
      };
    }

    const userData = userDoc.data() as Usuario;

    // Verificar que el usuario esté activo
    if (!userData.activo) {
      await signOut(auth);
      return {
        success: false,
        error: new Error('Usuario inactivo'),
        message: 'Tu cuenta está desactivada. Contacta al administrador.',
      };
    }

    return {
      success: true,
      user: userCredential.user,
      message: `Bienvenido ${userData.nombre}`,
    };
  } catch (error: any) {
    console.error('Error en login:', error);

    let message = 'Error al iniciar sesión';

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        message = 'Credenciales incorrectas';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/user-disabled':
        message = 'Usuario deshabilitado';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos. Intenta más tarde.';
        break;
      case 'auth/network-request-failed':
        message = 'Error de conexión. Verifica tu internet.';
        break;
      default:
        message = error.message || 'Error desconocido';
    }

    return {
      success: false,
      error,
      message,
    };
  }
};

/**
 * Cerrar sesión
 */
export const logout = async (): Promise<AuthResult> => {
  if (!auth) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado.',
    };
  }

  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  } catch (error: any) {
    console.error('Error en logout:', error);
    return {
      success: false,
      error,
      message: 'Error al cerrar sesión',
    };
  }
};

/**
 * Registrar nuevo usuario
 * NOTA: Esta función debe ser llamada desde un contexto con privilegios de admin
 * o usar Firebase Admin SDK en un API Route
 */
export const registerUser = async (data: RegisterData): Promise<AuthResult> => {
  try {
    // NOTA: Esta función requiere Firebase Admin SDK para crear usuarios
    // desde el backend. Por ahora, retorna un error indicando que debe
    // hacerse desde el panel de administración.

    return {
      success: false,
      error: new Error('Registro no implementado'),
      message:
        'El registro de usuarios debe hacerse desde el panel de administración.',
    };

    // TODO: Implementar con Firebase Admin SDK en API Route
    // const userCredential = await createUserWithEmailAndPassword(
    //   auth,
    //   data.email,
    //   data.password
    // );
    //
    // await updateProfile(userCredential.user, {
    //   displayName: data.nombre,
    // });
    //
    // await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
    //   id: userCredential.user.uid,
    //   nombre: data.nombre,
    //   email: data.email,
    //   rol: data.rol,
    //   activo: true,
    //   createdAt: serverTimestamp(),
    // });
    //
    // return {
    //   success: true,
    //   user: userCredential.user,
    //   message: 'Usuario registrado correctamente',
    // };
  } catch (error: any) {
    console.error('Error en registro:', error);

    let message = 'Error al registrar usuario';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        message = error.message || 'Error desconocido';
    }

    return {
      success: false,
      error,
      message,
    };
  }
};

/**
 * Enviar email de recuperación de contraseña
 */
export const resetPassword = async (email: string): Promise<AuthResult> => {
  if (!auth) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado.',
    };
  }

  try {
    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
      message: 'Email de recuperación enviado. Revisa tu bandeja de entrada.',
    };
  } catch (error: any) {
    console.error('Error en reset password:', error);

    let message = 'Error al enviar email de recuperación';

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/user-not-found':
        message = 'No existe usuario con ese email';
        break;
      default:
        message = error.message || 'Error desconocido';
    }

    return {
      success: false,
      error,
      message,
    };
  }
};

/**
 * Actualizar perfil del usuario actual
 */
export const updateUserProfile = async (data: {
  displayName?: string;
  photoURL?: string;
}): Promise<AuthResult> => {
  if (!auth || !db) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado.',
    };
  }

  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        error: new Error('No hay usuario autenticado'),
        message: 'Debes iniciar sesión para actualizar tu perfil',
      };
    }

    await updateProfile(currentUser, data);

    // Actualizar también en Firestore si cambió el nombre
    if (data.displayName) {
      await setDoc(
        doc(db, 'usuarios', currentUser.uid),
        {
          nombre: data.displayName,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    return {
      success: true,
      user: currentUser,
      message: 'Perfil actualizado correctamente',
    };
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al actualizar perfil',
    };
  }
};

/**
 * Cambiar email del usuario actual
 */
export const changeEmail = async (
  newEmail: string,
  currentPassword: string
): Promise<AuthResult> => {
  if (!auth || !db) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado.',
    };
  }

  try {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      return {
        success: false,
        error: new Error('No hay usuario autenticado'),
        message: 'Debes iniciar sesión',
      };
    }

    // Reautenticar usuario antes de cambiar email
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);

    // Cambiar email
    await updateEmail(currentUser, newEmail);

    // Actualizar en Firestore
    await setDoc(
      doc(db, 'usuarios', currentUser.uid),
      {
        email: newEmail,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return {
      success: true,
      user: currentUser,
      message: 'Email actualizado correctamente',
    };
  } catch (error: any) {
    console.error('Error al cambiar email:', error);

    let message = 'Error al cambiar email';

    switch (error.code) {
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está en uso';
        break;
      case 'auth/requires-recent-login':
        message = 'Debes iniciar sesión nuevamente';
        break;
      default:
        message = error.message || 'Error desconocido';
    }

    return {
      success: false,
      error,
      message,
    };
  }
};

/**
 * Cambiar contraseña del usuario actual
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> => {
  if (!auth) {
    return {
      success: false,
      error: new Error('Firebase no está configurado'),
      message: 'Firebase no está configurado.',
    };
  }

  try {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      return {
        success: false,
        error: new Error('No hay usuario autenticado'),
        message: 'Debes iniciar sesión',
      };
    }

    // Reautenticar usuario antes de cambiar contraseña
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);

    // Cambiar contraseña
    await updatePassword(currentUser, newPassword);

    return {
      success: true,
      user: currentUser,
      message: 'Contraseña actualizada correctamente',
    };
  } catch (error: any) {
    console.error('Error al cambiar contraseña:', error);

    let message = 'Error al cambiar contraseña';

    switch (error.code) {
      case 'auth/wrong-password':
        message = 'Contraseña actual incorrecta';
        break;
      case 'auth/weak-password':
        message = 'La nueva contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/requires-recent-login':
        message = 'Debes iniciar sesión nuevamente';
        break;
      default:
        message = error.message || 'Error desconocido';
    }

    return {
      success: false,
      error,
      message,
    };
  }
};

/**
 * Obtener el usuario actual
 */
export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null;
};

/**
 * Obtener datos completos del usuario actual desde Firestore
 */
export const getCurrentUserData = async (): Promise<Usuario | null> => {
  if (!auth || !db) {
    return null;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as Usuario;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

/**
 * Verificar si el usuario tiene un rol específico
 */
export const hasRole = async (
  requiredRole: Role | Role[]
): Promise<boolean> => {
  const userData = await getCurrentUserData();

  if (!userData) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userData.rol);
};

/**
 * Verificar si el usuario es admin
 */
export const isAdmin = async (): Promise<boolean> => {
  return hasRole('admin');
};

/**
 * Verificar si el usuario es encargado o admin
 */
export const isManager = async (): Promise<boolean> => {
  return hasRole(['encargado', 'admin']);
};

/**
 * Suscribirse a cambios en el estado de autenticación
 * Útil para React components
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  if (!auth) {
    return () => {}; // Return empty unsubscribe function
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Esperar a que Firebase Auth se inicialice
 * Útil para protección de rutas
 */
export const waitForAuthInit = (): Promise<User | null> => {
  if (!auth) {
    return Promise.resolve(null);
  }

  const authInstance = auth; // TypeScript type narrowing
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Verificar si hay una sesión activa
 */
export const isAuthenticated = (): boolean => {
  return auth?.currentUser !== null;
};

/**
 * Obtener el token de autenticación del usuario actual
 * Útil para llamadas a API
 */
export const getAuthToken = async (): Promise<string | null> => {
  if (!auth) {
    return null;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  try {
    return await currentUser.getIdToken();
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

/**
 * Forzar refresh del token de autenticación
 */
export const refreshAuthToken = async (): Promise<string | null> => {
  if (!auth) {
    return null;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  try {
    return await currentUser.getIdToken(true); // Force refresh
  } catch (error) {
    console.error('Error al refrescar token:', error);
    return null;
  }
};
