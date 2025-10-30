'use client';

import { useAuth } from '@/lib/auth/useAuth';
import type { Rol } from '@/lib/types/firestore';

/**
 * Hook para verificar permisos basados en rol
 */
export function useRole() {
  const { userData } = useAuth();

  const hasRole = (role: Rol): boolean => {
    return userData?.rol === role;
  };

  const hasAnyRole = (roles: Rol[]): boolean => {
    if (!userData) return false;
    return roles.includes(userData.rol);
  };

  const isAdmin = (): boolean => {
    return userData?.rol === 'admin';
  };

  const isEncargado = (): boolean => {
    return userData?.rol === 'encargado';
  };

  const isCajera = (): boolean => {
    return userData?.rol === 'cajera';
  };

  const isCocina = (): boolean => {
    return userData?.rol === 'cocina';
  };

  const isRepartidor = (): boolean => {
    return userData?.rol === 'repartidor';
  };

  const canManageUsers = (): boolean => {
    return hasAnyRole(['admin', 'encargado']);
  };

  const canCreatePedidos = (): boolean => {
    return hasAnyRole(['admin', 'encargado', 'cajera']);
  };

  const canViewReportes = (): boolean => {
    return hasAnyRole(['admin', 'encargado']);
  };

  const canManageTurnos = (): boolean => {
    return hasAnyRole(['admin', 'encargado']);
  };

  return {
    role: userData?.rol,
    hasRole,
    hasAnyRole,
    isAdmin,
    isEncargado,
    isCajera,
    isCocina,
    isRepartidor,
    canManageUsers,
    canCreatePedidos,
    canViewReportes,
    canManageTurnos,
  };
}
