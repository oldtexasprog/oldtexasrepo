'use client';

import { useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore } from '@/lib/stores/auth.store';

export function useAuth() {
  const { user, userData, loading, error, signIn, signOut, initializeAuthListener } = useAuthStore();

  useEffect(() => {
    initializeAuthListener();
  }, []);

  return {
    user,
    userData,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
