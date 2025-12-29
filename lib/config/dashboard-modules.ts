/**
 * Configuración de Módulos del Dashboard por Rol
 * Old Texas BBQ - CRM
 *
 * Define qué módulos/secciones ve cada rol en el dashboard
 * Basado en la matriz de permisos (docs/MATRIZ_PERMISOS.md)
 */

import { Rol } from '@/lib/types/firestore';

export interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  roles: Rol[]; // Roles que pueden ver este módulo
}

/**
 * Todos los módulos disponibles en el sistema
 */
export const ALL_MODULES: DashboardModule[] = [
  {
    id: 'pedidos',
    title: 'Pedidos',
    description: 'Gestionar pedidos del restaurante',
    icon: '📝',
    href: '/pedidos',
    roles: ['admin', 'encargado', 'cajera'], // Cocina y repartidor tienen sus propias vistas
  },
  {
    id: 'turnos',
    title: 'Turnos',
    description: 'Gestionar turnos del restaurante',
    icon: '⏰',
    href: '/turnos',
    roles: ['admin', 'encargado', 'cajera'],
  },
  {
    id: 'cocina',
    title: 'Cocina',
    description: 'Ver comandas en tiempo real',
    icon: '👨‍🍳',
    href: '/cocina',
    roles: ['admin', 'encargado', 'cocina'],
  },
  {
    id: 'reparto',
    title: 'Reparto',
    description: 'Gestión de entregas',
    icon: '🛵',
    href: '/reparto',
    roles: ['admin', 'encargado', 'repartidor'],
  },
  {
    id: 'repartidores',
    title: 'Repartidores',
    description: 'Gestión de repartidores',
    icon: '🚚',
    href: '/repartidores',
    roles: ['admin', 'encargado'],
  },
  {
    id: 'bitacora',
    title: 'Bitácora',
    description: 'Registro de pedidos del día',
    icon: '📋',
    href: '/bitacora',
    roles: ['admin', 'encargado', 'cajera'],
  },
  {
    id: 'usuarios',
    title: 'Usuarios',
    description: 'Gestión de usuarios del restaurante',
    icon: '👥',
    href: '/dashboard/usuarios',
    roles: ['admin'], // Solo admin puede gestionar usuarios
  },
  {
    id: 'colonias',
    title: 'Colonias',
    description: 'Gestión de colonias y costos de envío',
    icon: '📍',
    href: '/colonias',
    roles: ['admin', 'encargado'],
  },
  {
    id: 'reportes',
    title: 'Reportes',
    description: 'Análisis y métricas',
    icon: '📊',
    href: '/reportes',
    roles: ['admin', 'encargado'],
  },
  {
    id: 'caja',
    title: 'Caja',
    description: 'Corte de caja y reportes',
    icon: '💰',
    href: '/caja/corte',
    roles: ['admin', 'encargado', 'cajera'],
  },
];

/**
 * Obtiene los módulos que puede ver un rol específico
 */
export function getModulesForRole(role: Rol): DashboardModule[] {
  return ALL_MODULES.filter((module) => module.roles.includes(role));
}

/**
 * Verifica si un rol puede acceder a un módulo específico
 */
export function canAccessModule(role: Rol, moduleId: string): boolean {
  const module = ALL_MODULES.find((m) => m.id === moduleId);
  return module ? module.roles.includes(role) : false;
}

/**
 * Obtiene el módulo principal para un rol (a dónde redirigir por defecto)
 */
export function getDefaultModuleForRole(role: Rol): DashboardModule | null {
  const modules = getModulesForRole(role);
  return modules.length > 0 ? modules[0] : null;
}

/**
 * Descripción de lo que ve cada rol
 */
export const ROLE_DESCRIPTIONS: Record<Rol, string> = {
  admin: 'Acceso completo al sistema',
  encargado: 'Gestión operativa completa',
  cajera: 'Gestión de pedidos y caja',
  cocina: 'Visualización de comandas',
  repartidor: 'Gestión de entregas',
};

/**
 * Módulos del menú de usuario (perfil, configuración, etc.)
 */
export interface UserMenuItem {
  id: string;
  title: string;
  icon: 'user' | 'lock' | 'settings' | 'logout';
  href?: string;
  onClick?: () => void;
  roles: Rol[]; // Roles que pueden ver esta opción
}

/**
 * Obtiene las opciones del menú de usuario según el rol
 */
export function getUserMenuItems(role: Rol): Omit<UserMenuItem, 'onClick'>[] {
  const baseItems: Omit<UserMenuItem, 'onClick'>[] = [
    {
      id: 'perfil',
      title: 'Mi Perfil',
      icon: 'user',
      href: '/perfil',
      roles: ['admin', 'encargado', 'cajera', 'cocina', 'repartidor'],
    },
    {
      id: 'password',
      title: 'Cambiar Contraseña',
      icon: 'lock',
      href: '/cambiar-password',
      roles: ['admin', 'encargado', 'cajera', 'cocina', 'repartidor'],
    },
    {
      id: 'usuarios',
      title: 'Gestión de Usuarios',
      icon: 'settings',
      href: '/dashboard/usuarios',
      roles: ['admin'], // Solo admin
    },
  ];

  return baseItems.filter((item) => item.roles.includes(role));
}
