/**
 * Servicio de Productos
 * Old Texas BBQ - CRM
 *
 * Gestiona operaciones CRUD para productos y personalizaciones
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { BaseService, QueryOptions } from './base.service';
import {
  Producto,
  PersonalizacionProducto,
  NuevoProducto,
} from '@/lib/types/firestore';

class ProductosService extends BaseService<Producto> {
  constructor() {
    super('productos');
  }

  // ==========================================================================
  // MÉTODOS ESPECÍFICOS DE PRODUCTOS
  // ==========================================================================

  /**
   * Obtiene productos por categoría
   */
  async getByCategoria(categoriaId: string): Promise<Producto[]> {
    return this.search([
      { field: 'categoriaId', operator: '==', value: categoriaId },
      { field: 'disponible', operator: '==', value: true },
    ]);
  }

  /**
   * Obtiene productos disponibles ordenados por popularidad
   */
  async getDisponiblesOrdenadosPorPopularidad(): Promise<Producto[]> {
    return this.getAll({
      filters: [{ field: 'disponible', operator: '==', value: true }],
      orderByField: 'popularidad',
      orderDirection: 'desc',
    });
  }

  /**
   * Obtiene productos disponibles ordenados por orden de menú
   */
  async getDisponiblesOrdenadosPorMenu(): Promise<Producto[]> {
    return this.getAll({
      filters: [{ field: 'disponible', operator: '==', value: true }],
      orderByField: 'orden',
      orderDirection: 'asc',
    });
  }

  /**
   * Obtiene productos en promoción
   */
  async getEnPromocion(): Promise<Producto[]> {
    return this.search([
      { field: 'enPromocion', operator: '==', value: true },
      { field: 'disponible', operator: '==', value: true },
    ]);
  }

  /**
   * Busca productos por nombre
   */
  async searchByNombre(searchTerm: string): Promise<Producto[]> {
    // Nota: búsqueda básica, se puede mejorar con Algolia
    const allProducts = await this.getAll({
      filters: [{ field: 'disponible', operator: '==', value: true }],
    });

    const term = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.nombre.toLowerCase().includes(term) ||
        product.descripcion.toLowerCase().includes(term) ||
        (product.etiquetas && product.etiquetas.some((tag) => tag.toLowerCase().includes(term)))
    );
  }

  /**
   * Marca un producto como disponible/no disponible
   */
  async toggleDisponibilidad(id: string, disponible: boolean): Promise<void> {
    await this.update(id, { disponible });
  }

  /**
   * Actualiza el stock de un producto
   */
  async actualizarStock(id: string, nuevoStock: number): Promise<void> {
    await this.update(id, { stock: nuevoStock } as any);
  }

  /**
   * Incrementa la popularidad de un producto (cuando se vende)
   */
  async incrementarPopularidad(id: string): Promise<void> {
    const producto = await this.getById(id);
    if (!producto) return;

    await this.update(id, {
      popularidad: producto.popularidad + 1,
    } as any);
  }

  /**
   * Configura una promoción en un producto
   */
  async setPromocion(
    id: string,
    precioPromocion: number,
    enPromocion: boolean
  ): Promise<void> {
    await this.update(id, {
      precioPromocion,
      enPromocion,
    } as any);
  }

  /**
   * Reordena productos (actualiza campo orden)
   */
  async reordenarProductos(
    productos: Array<{ id: string; orden: number }>
  ): Promise<void> {
    const updates = productos.map((p) => ({
      id: p.id,
      data: { orden: p.orden },
    }));

    await this.batchUpdate(updates as any);
  }

  // ==========================================================================
  // MÉTODOS DE PERSONALIZACIONES (SUBCOLECCIÓN)
  // ==========================================================================

  /**
   * Obtiene las personalizaciones de un producto
   */
  async getPersonalizaciones(
    productoId: string
  ): Promise<PersonalizacionProducto[]> {
    try {
      const personalizacionesRef = this.getSubcollectionRef(
        productoId,
        'personalizaciones'
      );
      const querySnapshot = await getDocs(personalizacionesRef);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PersonalizacionProducto[];
    } catch (error) {
      console.error('Error obteniendo personalizaciones:', error);
      throw error;
    }
  }

  /**
   * Agrega una personalización a un producto
   */
  async addPersonalizacion(
    productoId: string,
    personalizacion: Omit<PersonalizacionProducto, 'id'>
  ): Promise<string> {
    try {
      const personalizacionesRef = this.getSubcollectionRef(
        productoId,
        'personalizaciones'
      );
      const docRef = await addDoc(personalizacionesRef, personalizacion);
      return docRef.id;
    } catch (error) {
      console.error('Error agregando personalización:', error);
      throw error;
    }
  }

  /**
   * Actualiza una personalización de un producto
   */
  async updatePersonalizacion(
    productoId: string,
    personalizacionId: string,
    data: Partial<PersonalizacionProducto>
  ): Promise<void> {
    try {
      const personalizacionRef = doc(
        db,
        this.collectionName,
        productoId,
        'personalizaciones',
        personalizacionId
      );
      await updateDoc(personalizacionRef, data as any);
    } catch (error) {
      console.error('Error actualizando personalización:', error);
      throw error;
    }
  }

  /**
   * Elimina una personalización de un producto
   */
  async deletePersonalizacion(
    productoId: string,
    personalizacionId: string
  ): Promise<void> {
    try {
      const personalizacionRef = doc(
        db,
        this.collectionName,
        productoId,
        'personalizaciones',
        personalizacionId
      );
      await deleteDoc(personalizacionRef);
    } catch (error) {
      console.error('Error eliminando personalización:', error);
      throw error;
    }
  }

  /**
   * Obtiene un producto con sus personalizaciones
   */
  async getProductoConPersonalizaciones(productoId: string): Promise<
    | (Producto & { personalizaciones: PersonalizacionProducto[] })
    | null
  > {
    const producto = await this.getById(productoId);
    if (!producto) return null;

    const personalizaciones = await this.getPersonalizaciones(productoId);

    return {
      ...producto,
      personalizaciones,
    };
  }

  // ==========================================================================
  // ESTADÍSTICAS Y REPORTES
  // ==========================================================================

  /**
   * Obtiene los productos más vendidos (top N)
   */
  async getTopProductos(limit: number = 10): Promise<Producto[]> {
    return this.getAll({
      orderByField: 'popularidad',
      orderDirection: 'desc',
      limitCount: limit,
    });
  }

  /**
   * Obtiene productos con stock bajo
   */
  async getProductosStockBajo(): Promise<Producto[]> {
    const allProducts = await this.getAll();

    return allProducts.filter(
      (p) =>
        p.stock !== undefined &&
        p.stockMinimo !== undefined &&
        p.stock <= p.stockMinimo
    );
  }

  /**
   * Obtiene estadísticas de productos
   */
  async getEstadisticas(): Promise<{
    total: number;
    disponibles: number;
    enPromocion: number;
    conStockBajo: number;
  }> {
    const allProducts = await this.getAll();

    return {
      total: allProducts.length,
      disponibles: allProducts.filter((p) => p.disponible).length,
      enPromocion: allProducts.filter((p) => p.enPromocion).length,
      conStockBajo: allProducts.filter(
        (p) =>
          p.stock !== undefined &&
          p.stockMinimo !== undefined &&
          p.stock <= p.stockMinimo
      ).length,
    };
  }

  // ==========================================================================
  // MÉTODOS DE TIEMPO REAL
  // ==========================================================================

  /**
   * Escucha productos disponibles por categoría
   */
  onProductosByCategoriaChange(
    categoriaId: string,
    callback: (productos: Producto[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [
          { field: 'categoriaId', operator: '==', value: categoriaId },
          { field: 'disponible', operator: '==', value: true },
        ],
        orderByField: 'orden',
        orderDirection: 'asc',
      },
      onError
    );
  }

  /**
   * Escucha productos disponibles
   */
  onProductosDisponiblesChange(
    callback: (productos: Producto[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'disponible', operator: '==', value: true }],
        orderByField: 'orden',
        orderDirection: 'asc',
      },
      onError
    );
  }
}

// Importar updateDoc y deleteDoc que faltaban
import { updateDoc, deleteDoc } from 'firebase/firestore';

// Exportar instancia única (Singleton)
export const productosService = new ProductosService();
