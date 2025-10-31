import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Pedido } from '@/lib/types';

const COLLECTION_NAME = 'pedidos';

// Lazy initialization - solo se usa en el cliente
const getOrdersRef = () => {
  if (!db) {
    throw new Error('Firebase no está configurado');
  }
  return collection(db, COLLECTION_NAME);
};

export const orderService = {
  /**
   * Obtiene todos los pedidos con filtros
   */
  async getAll(options?: {
    estado?: string;
    fecha?: Date;
    limit?: number;
  }): Promise<Pedido[]> {
    try {
      let q = query(getOrdersRef());

      // Filtros
      if (options?.estado) {
        q = query(q, where('estado_pedido', '==', options.estado));
      }

      if (options?.fecha) {
        const startOfDay = new Date(options.fecha);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(options.fecha);
        endOfDay.setHours(23, 59, 59, 999);

        q = query(
          q,
          where('fecha_hora', '>=', Timestamp.fromDate(startOfDay)),
          where('fecha_hora', '<=', Timestamp.fromDate(endOfDay))
        );
      }

      // Ordenamiento
      q = query(q, orderBy('fecha_hora', 'desc'));

      // Límite
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      const orders: Pedido[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          orders.push({
            id: doc.id,
            ...data,
            fecha_hora: data.fecha_hora?.toDate(),
          } as Pedido);
        }
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error('No se pudieron obtener los pedidos');
    }
  },

  /**
   * Obtiene un pedido por ID
   */
  async getById(id: string): Promise<Pedido | null> {
    try {
      const docRef = doc(db!, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        fecha_hora: data.fecha_hora?.toDate(),
      } as Pedido;
    } catch (error) {
      console.error('Error getting order:', error);
      throw new Error('No se pudo obtener el pedido');
    }
  },

  /**
   * Crea un nuevo pedido
   */
  async create(
    data: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const orderData = {
        ...data,
        fecha_hora: Timestamp.fromDate(data.fecha_hora as unknown as Date),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(getOrdersRef(), orderData);

      console.log('Order created:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('No se pudo crear el pedido');
    }
  },

  /**
   * Actualiza un pedido
   */
  async update(
    id: string,
    data: Partial<Omit<Pedido, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db!, COLLECTION_NAME, id);

      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
      console.log('Order updated:', id);
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('No se pudo actualizar el pedido');
    }
  },

  /**
   * Elimina un pedido (soft delete)
   */
  async delete(id: string): Promise<void> {
    try {
      await this.update(id, {
        estado_pedido: 'cancelado',
      });
      console.log('Order deleted (soft):', id);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('No se pudo eliminar el pedido');
    }
  },

  /**
   * Actualiza el estado de un pedido
   */
  async updateStatus(
    id: string,
    newStatus: Pedido['estado_pedido']
  ): Promise<void> {
    try {
      await this.update(id, {
        estado_pedido: newStatus,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('No se pudo actualizar el estado');
    }
  },

  /**
   * Obtiene pedidos de hoy
   */
  async getTodayOrders(): Promise<Pedido[]> {
    return this.getAll({ fecha: new Date() });
  },

  /**
   * Obtiene pedidos por repartidor
   */
  async getByRepartidor(repartidorId: string): Promise<Pedido[]> {
    try {
      const q = query(
        getOrdersRef(),
        where('reparto.repartidor', '==', repartidorId),
        where('estado_pedido', 'in', ['en_reparto', 'listo']),
        orderBy('fecha_hora', 'desc')
      );

      const snapshot = await getDocs(q);
      const orders: Pedido[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          orders.push({
            id: doc.id,
            ...data,
            fecha_hora: data.fecha_hora?.toDate(),
          } as Pedido);
        }
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders by repartidor:', error);
      throw new Error('No se pudieron obtener los pedidos del repartidor');
    }
  },
};
