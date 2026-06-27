/**
 * useRolGuard
 * Old Texas BBQ - CRM
 *
 * Hook que verifica si el usuario activo tiene al menos uno de los roles
 * requeridos. Devuelve `{ allowed, isLoading }` para que los componentes
 * puedan renderizar un estado de acceso denegado o de carga.
 */

import { useAuthStore } from '@/lib/stores/auth.store';
import type { Rol } from '@/lib/types/firestore';

interface RolGuardResult {
  /** El usuario puede realizar la acción */
  allowed: boolean;
  /** Todavía cargando datos del usuario */
  isLoading: boolean;
}

/**
 * @param roles Lista de roles que tienen permiso.
 *
 * @example
 * const { allowed } = useRolGuard(['admin', 'encargado', 'cajera']);
 * if (!allowed) return <AccessDenied />;
 */
export function useRolGuard(roles: Rol[]): RolGuardResult {
  const { userData, loading } = useAuthStore();

  if (loading) return { allowed: false, isLoading: true };
  if (!userData) return { allowed: false, isLoading: false };

  const allowed = roles.includes(userData.rol as Rol);
  return { allowed, isLoading: false };
}
