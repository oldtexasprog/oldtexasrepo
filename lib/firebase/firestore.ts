/**
 * Firestore Utilities
 * Utilidades para operaciones con Cloud Firestore en Old Texas BBQ CRM
 *
 * Funcionalidades:
 * - CRUD operations genéricas
 * - Queries con filtros y paginación
 * - Operaciones en batch
 * - Listeners en tiempo real
 * - Transacciones
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  writeBatch,
  runTransaction,
  serverTimestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
  type WhereFilterOp,
  type OrderByDirection,
} from 'firebase/firestore';
import { db } from './config';
import type {
  QueryOptions,
  PaginatedResult,
  FirestoreResult,
  BatchOperation,
  FirestoreDocument,
} from './types';

/**
 * Nombres de colecciones disponibles
 */
export const COLLECTIONS = {
  USUARIOS: 'usuarios',
  PEDIDOS: 'pedidos',
  PRODUCTOS: 'productos',
  PERSONALIZACIONES: 'personalizaciones',
  REPARTIDORES: 'repartidores',
  TURNOS: 'turnos',
  CONFIGURACION: 'configuracion',
} as const;

/**
 * Obtener un documento por ID
 */
export const getDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<FirestoreResult<T>> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: new Error('Documento no encontrado'),
        message: 'El documento solicitado no existe',
      };
    }

    return {
      success: true,
      data: { id: docSnap.id, ...docSnap.data() } as T,
    };
  } catch (error: any) {
    console.error('Error al obtener documento:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al obtener documento',
    };
  }
};

/**
 * Obtener todos los documentos de una colección
 */
export const getDocuments = async <T>(
  collectionName: string,
  options?: QueryOptions
): Promise<FirestoreResult<T[]>> => {
  try {
    const colRef = collection(db, collectionName);
    let q = query(colRef);

    // Aplicar filtros where
    if (options?.where) {
      options.where.forEach((condition) => {
        q = query(
          q,
          where(
            condition.field,
            condition.operator as WhereFilterOp,
            condition.value
          )
        );
      });
    }

    // Aplicar ordenamiento
    if (options?.orderBy) {
      q = query(
        q,
        orderBy(
          options.orderBy.field,
          options.orderBy.direction as OrderByDirection
        )
      );
    }

    // Aplicar límite
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    // Aplicar paginación
    if (options?.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as T
    );

    return {
      success: true,
      data: documents,
    };
  } catch (error: any) {
    console.error('Error al obtener documentos:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al obtener documentos',
    };
  }
};

/**
 * Obtener documentos con paginación
 */
export const getPaginatedDocuments = async <T>(
  collectionName: string,
  pageSize: number,
  lastDoc?: any,
  options?: QueryOptions
): Promise<PaginatedResult<T>> => {
  try {
    const colRef = collection(db, collectionName);
    let q = query(colRef);

    // Aplicar filtros where
    if (options?.where) {
      options.where.forEach((condition) => {
        q = query(
          q,
          where(
            condition.field,
            condition.operator as WhereFilterOp,
            condition.value
          )
        );
      });
    }

    // Aplicar ordenamiento (requerido para paginación)
    const orderByField = options?.orderBy?.field || 'createdAt';
    const orderByDirection =
      (options?.orderBy?.direction as OrderByDirection) || 'desc';
    q = query(q, orderBy(orderByField, orderByDirection));

    // Aplicar paginación
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Obtener un documento extra para saber si hay más
    q = query(q, limit(pageSize + 1));

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.slice(0, pageSize).map(
      (doc) => ({ id: doc.id, ...doc.data() }) as T
    );

    const hasMore = querySnapshot.docs.length > pageSize;
    const lastVisible = querySnapshot.docs[pageSize - 1] || null;

    return {
      data: documents,
      lastVisible,
      hasMore,
    };
  } catch (error: any) {
    console.error('Error en paginación:', error);
    return {
      data: [],
      lastVisible: null,
      hasMore: false,
    };
  }
};

/**
 * Crear un nuevo documento con ID autogenerado
 */
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<FirestoreResult<T & FirestoreDocument>> => {
  try {
    const colRef = collection(db, collectionName);
    const dataWithTimestamp = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(colRef, dataWithTimestamp);

    return {
      success: true,
      data: {
        id: docRef.id,
        ...dataWithTimestamp,
      } as T & FirestoreDocument,
      message: 'Documento creado correctamente',
    };
  } catch (error: any) {
    console.error('Error al crear documento:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al crear documento',
    };
  }
};

/**
 * Crear o actualizar un documento con ID específico
 */
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: T,
  merge: boolean = true
): Promise<FirestoreResult<T & FirestoreDocument>> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // Si no es merge y no existe createdAt, agregarlo
    if (!merge) {
      (dataWithTimestamp as any).createdAt = serverTimestamp();
    }

    await setDoc(docRef, dataWithTimestamp, { merge });

    return {
      success: true,
      data: {
        id: documentId,
        ...dataWithTimestamp,
      } as T & FirestoreDocument,
      message: 'Documento guardado correctamente',
    };
  } catch (error: any) {
    console.error('Error al guardar documento:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al guardar documento',
    };
  }
};

/**
 * Actualizar un documento existente (merge)
 */
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<FirestoreResult> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, dataWithTimestamp);

    return {
      success: true,
      message: 'Documento actualizado correctamente',
    };
  } catch (error: any) {
    console.error('Error al actualizar documento:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al actualizar documento',
    };
  }
};

/**
 * Eliminar un documento
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<FirestoreResult> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);

    return {
      success: true,
      message: 'Documento eliminado correctamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar documento:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al eliminar documento',
    };
  }
};

/**
 * Operaciones en batch (múltiples operaciones en una sola transacción)
 */
export const batchOperations = async <T>(
  operations: BatchOperation<T>[]
): Promise<FirestoreResult> => {
  try {
    const batch = writeBatch(db);

    operations.forEach((operation) => {
      const docRef = operation.id
        ? doc(db, operation.collection, operation.id)
        : doc(collection(db, operation.collection));

      switch (operation.type) {
        case 'set':
          if (operation.data) {
            batch.set(docRef, {
              ...operation.data,
              updatedAt: serverTimestamp(),
            });
          }
          break;

        case 'update':
          if (operation.data) {
            batch.update(docRef, {
              ...operation.data,
              updatedAt: serverTimestamp(),
            });
          }
          break;

        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();

    return {
      success: true,
      message: `${operations.length} operaciones completadas correctamente`,
    };
  } catch (error: any) {
    console.error('Error en batch operations:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al ejecutar operaciones en batch',
    };
  }
};

/**
 * Ejecutar una transacción
 */
export const executeTransaction = async <T>(
  transactionFn: () => Promise<T>
): Promise<FirestoreResult<T>> => {
  try {
    const result = await runTransaction(db, async (transaction) => {
      return await transactionFn();
    });

    return {
      success: true,
      data: result,
      message: 'Transacción completada correctamente',
    };
  } catch (error: any) {
    console.error('Error en transacción:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al ejecutar transacción',
    };
  }
};

/**
 * Suscribirse a cambios en un documento en tiempo real
 */
export const subscribeToDocument = <T>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null, error?: Error) => void
): Unsubscribe => {
  const docRef = doc(db, collectionName, documentId);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({
          id: snapshot.id,
          ...snapshot.data(),
        } as T);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error en subscripción a documento:', error);
      callback(null, error);
    }
  );
};

/**
 * Suscribirse a cambios en una colección en tiempo real
 */
export const subscribeToCollection = <T>(
  collectionName: string,
  options: QueryOptions,
  callback: (data: T[], error?: Error) => void
): Unsubscribe => {
  const colRef = collection(db, collectionName);
  let q = query(colRef);

  // Aplicar filtros where
  if (options.where) {
    options.where.forEach((condition) => {
      q = query(
        q,
        where(
          condition.field,
          condition.operator as WhereFilterOp,
          condition.value
        )
      );
    });
  }

  // Aplicar ordenamiento
  if (options.orderBy) {
    q = query(
      q,
      orderBy(
        options.orderBy.field,
        options.orderBy.direction as OrderByDirection
      )
    );
  }

  // Aplicar límite
  if (options.limit) {
    q = query(q, limit(options.limit));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const documents = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as T
      );
      callback(documents);
    },
    (error) => {
      console.error('Error en subscripción a colección:', error);
      callback([], error);
    }
  );
};

/**
 * Contar documentos en una colección (estimado)
 * NOTA: Firestore no tiene un método nativo de count eficiente
 * Esta función obtiene todos los docs y cuenta. Para colecciones grandes,
 * considera mantener un contador en un documento separado.
 */
export const countDocuments = async (
  collectionName: string,
  whereConditions?: QueryOptions['where']
): Promise<number> => {
  try {
    const colRef = collection(db, collectionName);
    let q = query(colRef);

    if (whereConditions) {
      whereConditions.forEach((condition) => {
        q = query(
          q,
          where(
            condition.field,
            condition.operator as WhereFilterOp,
            condition.value
          )
        );
      });
    }

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error al contar documentos:', error);
    return 0;
  }
};

/**
 * Verificar si un documento existe
 */
export const documentExists = async (
  collectionName: string,
  documentId: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error al verificar existencia de documento:', error);
    return false;
  }
};

/**
 * Obtener documentos donde un campo está en un array de valores
 */
export const getDocumentsWhereIn = async <T>(
  collectionName: string,
  field: string,
  values: any[]
): Promise<T[]> => {
  try {
    // Firestore limita "in" a 10 valores
    if (values.length > 10) {
      console.warn('whereIn limitado a 10 valores. Dividiendo en múltiples queries...');

      const chunks: any[][] = [];
      for (let i = 0; i < values.length; i += 10) {
        chunks.push(values.slice(i, i + 10));
      }

      const results = await Promise.all(
        chunks.map((chunk) =>
          getDocuments<T>(collectionName, {
            where: [{ field, operator: 'in', value: chunk }],
          })
        )
      );

      return results.flatMap((result) => result.data || []);
    }

    const result = await getDocuments<T>(collectionName, {
      where: [{ field, operator: 'in', value: values }],
    });

    return result.data || [];
  } catch (error) {
    console.error('Error en whereIn query:', error);
    return [];
  }
};

/**
 * Utilidades de conversión de fechas
 */
export const timestampToDate = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp instanceof Date) return timestamp;
  return null;
};

export const dateToTimestamp = (date: Date) => {
  return serverTimestamp();
};
