'use client';

import { useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { usuariosService } from '@/lib/services';
import type { Usuario } from '@/lib/types/firestore';

interface AuthState {
  user: User | null;
  userData: Usuario | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userData: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Si Firebase no está configurado, no hacer nada
    if (!auth) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Configurar persistencia
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario autenticado, obtener datos adicionales de Firestore
        try {
          const userData = await usuariosService.getById(user.uid);
          setState({
            user,
            userData,
            loading: false,
            error: null,
          });

          // Actualizar última conexión
          if (userData) {
            await usuariosService.updateUltimaConexion(user.uid);
          }
        } catch (error) {
          console.error('Error obteniendo datos de usuario:', error);
          setState({
            user,
            userData: null,
            loading: false,
            error: 'Error al cargar datos del usuario',
          });
        }
      } else {
        // No hay usuario autenticado
        setState({
          user: null,
          userData: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase no está configurado');
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged se encargará de actualizar el estado
    } catch (error: any) {
      let errorMessage = 'Error al iniciar sesión';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Usuario deshabilitado';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          errorMessage = error.message;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    if (!auth) {
      setState({
        user: null,
        userData: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      await firebaseSignOut(auth);
      setState({
        user: null,
        userData: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  return {
    user: state.user,
    userData: state.userData,
    loading: state.loading,
    error: state.error,
    signIn,
    signOut,
    isAuthenticated: !!state.user,
  };
}
