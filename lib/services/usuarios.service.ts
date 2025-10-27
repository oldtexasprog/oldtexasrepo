/**
 * Servicio de Usuarios
 * Old Texas BBQ - CRM
 *
 * Gestiona operaciones CRUD para usuarios del sistema
 */

import { BaseService, QueryOptions } from './base.service';
import { Usuario, Rol } from '@/lib/types/firestore';
import { Timestamp } from 'firebase/firestore';

class UsuariosService extends BaseService<Usuario> {
  constructor() {
    super('usuarios');
  }

  // ==========================================================================
  // MÉTODOS ESPECÍFICOS DE USUARIOS
  // ==========================================================================

  /**
   * Obtiene usuarios por rol
   */
  async getByRol(rol: Rol): Promise<Usuario[]> {
    return this.search([
      { field: 'rol', operator: '==', value: rol },
      { field: 'activo', operator: '==', value: true },
    ]);
  }

  /**
   * Obtiene usuario por email
   */
  async getByEmail(email: string): Promise<Usuario | null> {
    const results = await this.search([
      { field: 'email', operator: '==', value: email },
    ]);
    return results[0] || null;
  }

  /**
   * Obtiene cajeras activas
   */
  async getCajerasActivas(): Promise<Usuario[]> {
    return this.getByRol('cajera');
  }

  /**
   * Obtiene usuarios de cocina activos
   */
  async getCocinaActivos(): Promise<Usuario[]> {
    return this.getByRol('cocina');
  }

  /**
   * Activa o desactiva un usuario
   */
  async toggleActivo(id: string, activo: boolean): Promise<void> {
    await this.update(id, { activo });
  }

  /**
   * Actualiza última conexión del usuario
   */
  async updateUltimaConexion(id: string): Promise<void> {
    await this.update(id, {
      ultimaConexion: Timestamp.now(),
    } as any);
  }

  /**
   * Agrega un token FCM al usuario para notificaciones push
   */
  async addFCMToken(userId: string, token: string): Promise<void> {
    const user = await this.getById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const tokens = user.fcmTokens || [];
    if (!tokens.includes(token)) {
      tokens.push(token);
      await this.update(userId, { fcmTokens: tokens } as any);
    }
  }

  /**
   * Elimina un token FCM del usuario
   */
  async removeFCMToken(userId: string, token: string): Promise<void> {
    const user = await this.getById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const tokens = (user.fcmTokens || []).filter((t) => t !== token);
    await this.update(userId, { fcmTokens: tokens } as any);
  }

  /**
   * Obtiene usuarios activos con opciones de ordenamiento
   */
  async getUsuariosActivos(options?: QueryOptions): Promise<Usuario[]> {
    const queryOptions: QueryOptions = {
      ...options,
      filters: [
        ...(options?.filters || []),
        { field: 'activo', operator: '==', value: true },
      ],
    };
    return this.getAll(queryOptions);
  }

  /**
   * Busca usuarios por nombre o apellido
   */
  async searchByName(searchTerm: string): Promise<Usuario[]> {
    // Nota: Firestore no soporta búsqueda "LIKE" nativa
    // Esta es una implementación básica que se puede mejorar con Algolia
    const allUsers = await this.getAll();
    const term = searchTerm.toLowerCase();

    return allUsers.filter(
      (user) =>
        user.nombre.toLowerCase().includes(term) ||
        user.apellido.toLowerCase().includes(term) ||
        `${user.nombre} ${user.apellido}`.toLowerCase().includes(term)
    );
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  async getEstadisticas(): Promise<{
    total: number;
    activos: number;
    porRol: Record<Rol, number>;
  }> {
    const allUsers = await this.getAll();

    const stats = {
      total: allUsers.length,
      activos: allUsers.filter((u) => u.activo).length,
      porRol: {
        admin: 0,
        encargado: 0,
        cajera: 0,
        cocina: 0,
        repartidor: 0,
      } as Record<Rol, number>,
    };

    allUsers.forEach((user) => {
      stats.porRol[user.rol]++;
    });

    return stats;
  }

  // ==========================================================================
  // MÉTODOS DE TIEMPO REAL
  // ==========================================================================

  /**
   * Escucha cambios en usuarios activos
   */
  onUsuariosActivosChange(
    callback: (usuarios: Usuario[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'activo', operator: '==', value: true }],
        orderByField: 'nombre',
        orderDirection: 'asc',
      },
      onError
    );
  }

  /**
   * Escucha cambios en cajeras activas
   */
  onCajerasActivasChange(
    callback: (cajeras: Usuario[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [
          { field: 'rol', operator: '==', value: 'cajera' },
          { field: 'activo', operator: '==', value: true },
        ],
        orderByField: 'nombre',
        orderDirection: 'asc',
      },
      onError
    );
  }
}

// Exportar instancia única (Singleton)
export const usuariosService = new UsuariosService();
