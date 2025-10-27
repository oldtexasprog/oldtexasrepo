/**
 * Servicio de Categorías
 * Old Texas BBQ - CRM
 */

import { BaseService } from './base.service';
import { Categoria } from '@/lib/types/firestore';

class CategoriasService extends BaseService<Categoria> {
  constructor() {
    super('categorias');
  }

  /**
   * Obtiene categorías activas ordenadas
   */
  async getActivas(): Promise<Categoria[]> {
    return this.getAll({
      filters: [{ field: 'activa', operator: '==', value: true }],
      orderByField: 'orden',
      orderDirection: 'asc',
    });
  }

  /**
   * Toggle estado activo/inactivo
   */
  async toggleActiva(id: string, activa: boolean): Promise<void> {
    await this.update(id, { activa });
  }

  /**
   * Reordena categorías
   */
  async reordenar(categorias: Array<{ id: string; orden: number }>): Promise<void> {
    const updates = categorias.map((c) => ({
      id: c.id,
      data: { orden: c.orden },
    }));
    await this.batchUpdate(updates as any);
  }

  /**
   * Escucha categorías activas en tiempo real
   */
  onCategoriasActivasChange(
    callback: (categorias: Categoria[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'activa', operator: '==', value: true }],
        orderByField: 'orden',
        orderDirection: 'asc',
      },
      onError
    );
  }
}

export const categoriasService = new CategoriasService();
