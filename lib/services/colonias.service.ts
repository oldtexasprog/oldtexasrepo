import { BaseService } from './base.service';
import type { Colonia } from '../types/firestore';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

class ColoniasService extends BaseService<Colonia> {
  constructor() {
    super('colonias');
  }

  /**
   * Obtener solo colonias activas ordenadas por nombre
   */
  async getActivas(): Promise<Colonia[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('activa', '==', true),
        orderBy('nombre', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Colonia[];
    } catch (error) {
      console.error('Error obteniendo colonias activas:', error);
      throw error;
    }
  }

  /**
   * Buscar colonia por nombre (búsqueda exacta, case-insensitive)
   */
  async buscarPorNombre(nombre: string): Promise<Colonia | null> {
    try {
      const colonias = await this.getActivas();
      const colonia = colonias.find(
        (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
      );
      return colonia || null;
    } catch (error) {
      console.error('Error buscando colonia por nombre:', error);
      throw error;
    }
  }

  /**
   * Obtener colonias por zona
   */
  async getByZona(zona: string): Promise<Colonia[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('zona', '==', zona),
        where('activa', '==', true),
        orderBy('nombre', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Colonia[];
    } catch (error) {
      console.error('Error obteniendo colonias por zona:', error);
      throw error;
    }
  }

  /**
   * Verificar si una colonia tiene servicio (está activa)
   */
  async tieneServicio(coloniaId: string): Promise<boolean> {
    try {
      const colonia = await this.getById(coloniaId);
      return colonia?.activa || false;
    } catch (error) {
      console.error('Error verificando servicio de colonia:', error);
      return false;
    }
  }

  /**
   * Activar/desactivar colonia
   */
  async toggleActiva(coloniaId: string): Promise<void> {
    try {
      const colonia = await this.getById(coloniaId);
      if (!colonia) {
        throw new Error('Colonia no encontrada');
      }

      await this.update(coloniaId, {
        activa: !colonia.activa,
      });
    } catch (error) {
      console.error('Error cambiando estado de colonia:', error);
      throw error;
    }
  }
}

export const coloniasService = new ColoniasService();
