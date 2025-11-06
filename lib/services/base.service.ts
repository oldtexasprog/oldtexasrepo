/**
 * Servicio Base para operaciones CRUD en Firestore
 * Old Texas BBQ - CRM
 *
 * Proporciona métodos genéricos reutilizables para todas las colecciones
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  CollectionReference,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  writeBatch,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface QueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  startAfterDoc?: QueryDocumentSnapshot;
  filters?: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
    value: any;
  }>;
}

export interface PaginatedResult<T> {
  data: T[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

export interface BaseDocument {
  id: string;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
}

// ============================================================================
// CLASE BASE SERVICE
// ============================================================================

export abstract class BaseService<T extends BaseDocument> {
  protected collectionName: string;
  protected _collectionRef: CollectionReference | null = null;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Obtiene la referencia de la colección, inicializándola si es necesario
   */
  protected get collectionRef(): CollectionReference {
    if (!this._collectionRef) {
      if (!db) {
        throw new Error('Firebase no está configurado. Asegúrate de que las variables de entorno estén configuradas.');
      }
      this._collectionRef = collection(db, this.collectionName);
    }
    return this._collectionRef;
  }

  // ==========================================================================
  // MÉTODOS DE LECTURA
  // ==========================================================================

  /**
   * Obtiene un documento por ID
   */
  async getById(id: string): Promise<T | null> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    } catch (error) {
      console.error(`Error getting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene todos los documentos de la colección
   */
  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      const q = this.buildQuery(options);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting all documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene documentos con paginación
   */
  async getPaginated(
    options?: QueryOptions
  ): Promise<PaginatedResult<T>> {
    try {
      const q = this.buildQuery(options);
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === (options?.limitCount || 0);

      return { data, lastDoc, hasMore };
    } catch (error) {
      console.error(`Error getting paginated documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Busca documentos con filtros específicos
   */
  async search(filters: QueryOptions['filters']): Promise<T[]> {
    try {
      const options: QueryOptions = { filters };
      return await this.getAll(options);
    } catch (error) {
      console.error(`Error searching documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Cuenta el número de documentos (con filtros opcionales)
   */
  async count(filters?: QueryOptions['filters']): Promise<number> {
    try {
      const data = await this.search(filters);
      return data.length;
    } catch (error) {
      console.error(`Error counting documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // MÉTODOS DE ESCRITURA
  // ==========================================================================

  /**
   * Crea un nuevo documento
   */
  async create(data: Omit<T, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<string> {
    try {
      const docData = {
        ...data,
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
      };

      const docRef = await addDoc(this.collectionRef, docData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Crea un documento con ID personalizado
   */
  async createWithId(
    id: string,
    data: Omit<T, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
  ): Promise<void> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const docData = {
        ...data,
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
      };

      // Usar setDoc en vez de updateDoc para crear el documento si no existe
      await setDoc(docRef, docData as any);
    } catch (error) {
      console.error(`Error creating document with ID in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza un documento existente
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'fechaCreacion' | 'fechaActualizacion'>>
  ): Promise<void> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        fechaActualizacion: serverTimestamp(),
      };

      await updateDoc(docRef, updateData as any);
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un documento (soft delete)
   */
  async delete(id: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Elimina múltiples documentos en batch
   */
  async batchDelete(ids: string[]): Promise<void> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const batch = writeBatch(db);

      ids.forEach((id) => {
        const docRef = doc(db!, this.collectionName, id);
        batch.delete(docRef);
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error batch deleting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza múltiples documentos en batch
   */
  async batchUpdate(
    updates: Array<{ id: string; data: Partial<T> }>
  ): Promise<void> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        const docRef = doc(db!, this.collectionName, id);
        batch.update(docRef, {
          ...data,
          fechaActualizacion: serverTimestamp(),
        } as any);
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error batch updating documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // MÉTODOS DE TIEMPO REAL
  // ==========================================================================

  /**
   * Escucha cambios en un documento específico
   */
  onDocumentChange(
    id: string,
    callback: (data: T | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!db) {
      return () => {}; // Return empty unsubscribe function
    }

    const docRef = doc(db, this.collectionName, id);

    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({
            id: docSnap.id,
            ...docSnap.data(),
          } as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Error listening to document ${id}:`, error);
        onError?.(error);
      }
    );
  }

  /**
   * Escucha cambios en una colección con filtros
   */
  onCollectionChange(
    callback: (data: T[]) => void,
    options?: QueryOptions,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const q = this.buildQuery(options);

    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        callback(data);
      },
      (error) => {
        console.error(`Error listening to collection ${this.collectionName}:`, error);
        onError?.(error);
      }
    );
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES
  // ==========================================================================

  /**
   * Construye una query de Firestore con las opciones proporcionadas
   */
  protected buildQuery(options?: QueryOptions) {
    if (!db) {
      throw new Error('Firebase no está configurado. Asegúrate de que las variables de entorno estén configuradas.');
    }

    const constraints: QueryConstraint[] = [];

    // Agregar filtros
    if (options?.filters) {
      options.filters.forEach((filter) => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
    }

    // Agregar ordenamiento
    if (options?.orderByField) {
      constraints.push(
        orderBy(options.orderByField, options.orderDirection || 'asc')
      );
    }

    // Agregar paginación
    if (options?.startAfterDoc) {
      constraints.push(startAfter(options.startAfterDoc));
    }

    // Agregar límite
    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    return query(this.collectionRef, ...constraints);
  }

  /**
   * Verifica si un documento existe
   */
  async exists(id: string): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error(`Error checking if document exists in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene la referencia a un documento
   */
  protected getDocRef(id: string) {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }
    return doc(db, this.collectionName, id);
  }

  /**
   * Obtiene la referencia a una subcolección
   */
  protected getSubcollectionRef(docId: string, subcollectionName: string) {
    if (!db) {
      throw new Error('Firebase no está configurado');
    }
    return collection(db, this.collectionName, docId, subcollectionName);
  }
}
