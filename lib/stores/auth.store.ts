import { create } from 'zustand';
import { onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { usuariosService } from '@/lib/services';
import type { Usuario } from '@/lib/types/firestore';

interface AuthStoreState {
  user: User | null;
  userData: Usuario | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuthListener: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  error: null,
  initialized: false,

  initializeAuthListener: () => {
    if (get().initialized) return;
    if (!auth) {
      set({ loading: false, initialized: true });
      return;
    }

    setPersistence(auth, browserLocalPersistence).catch(() => {});

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await usuariosService.getById(firebaseUser.uid);
          set({ user: firebaseUser, userData, loading: false, error: null, initialized: true });
          if (userData) {
            await usuariosService.updateUltimaConexion(firebaseUser.uid);
          }
        } catch (e) {
          set({ user: firebaseUser, userData: null, loading: false, error: 'Error al cargar datos del usuario', initialized: true });
        }
      } else {
        set({ user: null, userData: null, loading: false, error: null, initialized: true });
      }
    });
  },

  signIn: async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase no está configurado');
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // El listener actualizará el estado
    } catch (error: any) {
      let errorMessage = 'Error al iniciar sesión';
      switch (error?.code) {
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
          errorMessage = error?.message || errorMessage;
      }
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  signOut: async () => {
    if (!auth) {
      set({ user: null, userData: null, loading: false, error: null });
      return;
    }
    await firebaseSignOut(auth);
    set({ user: null, userData: null, loading: false, error: null });
  },
}));


