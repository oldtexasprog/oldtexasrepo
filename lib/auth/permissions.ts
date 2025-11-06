import type { Usuario, Rol } from '@/lib/types/firestore';

// Matriz de permisos por rol → acciones permitidas
const PERMISSIONS_MATRIX: Record<Rol, string[]> = {
  admin: [
    '*',
  ],
  encargado: [
    'pedidos:create',
    'pedidos:view',
    'pedidos:update',
    'cocina:view',
    'reparto:view',
    'reparto:assign',
    'reportes:view',
    'turnos:open',
    'turnos:close',
    'productos:view',
    'productos:update',
  ],
  cajera: [
    'pedidos:create',
    'pedidos:view',
    'pedidos:update',
    'cocina:view',
    'reparto:view',
    'reparto:assign',
    'turnos:open',
    'turnos:close',
  ],
  cocina: [
    'cocina:view',
    'pedidos:update:estado',
  ],
  repartidor: [
    'reparto:view:assigned',
    'reparto:update:estado',
  ],
};

export type PermissionAction = string; // p.ej. 'pedidos:create'

export function checkPermission(user: Usuario | null | undefined, action: PermissionAction): boolean {
  if (!user) return false;
  const role = user.rol;
  const allowed = PERMISSIONS_MATRIX[role];
  if (!allowed) return false;
  if (allowed.includes('*')) return true;
  // Coincidencia exacta o prefijo de recurso
  return allowed.some((perm) => perm === action || (perm.endsWith(':*') && action.startsWith(perm.slice(0, -2))));
}

export function getRolePermissions(role: Rol): string[] {
  return PERMISSIONS_MATRIX[role] ?? [];
}


