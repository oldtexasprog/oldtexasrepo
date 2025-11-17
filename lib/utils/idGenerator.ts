/**
 * Generador de IDs Consecutivos para Pedidos
 * Old Texas BBQ - CRM
 *
 * Sistema de IDs con formato: YYYYMMDD-NNNN
 * Ejemplo: 20251114-0001, 20251114-0002, etc.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Colección para almacenar contadores
 */
const COUNTERS_COLLECTION = 'counters';
const PEDIDOS_COUNTER_DOC = 'pedidos';

/**
 * Formato de fecha YYYYMMDD
 */
function getDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Genera el siguiente ID de pedido de forma consecutiva
 * Usa transacciones de Firestore para garantizar unicidad
 *
 * @returns ID del pedido en formato YYYYMMDD-NNNN
 *
 * @example
 * const pedidoId = await generatePedidoId();
 * // "20251114-0001"
 */
export async function generatePedidoId(): Promise<string> {
  const counterRef = doc(db, COUNTERS_COLLECTION, PEDIDOS_COUNTER_DOC);
  const dateKey = getDateKey();

  try {
    const newId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      let currentCount = 1;
      let lastDate = dateKey;

      if (counterDoc.exists()) {
        const data = counterDoc.data();
        lastDate = data.lastDate || dateKey;
        currentCount = data.count || 1;

        // Si cambió el día, resetear contador
        if (lastDate !== dateKey) {
          currentCount = 1;
        } else {
          currentCount += 1;
        }
      }

      // Actualizar contador
      transaction.set(counterRef, {
        count: currentCount,
        lastDate: dateKey,
        lastUpdated: new Date(),
      });

      // Formatear ID: YYYYMMDD-NNNN
      const paddedCount = String(currentCount).padStart(4, '0');
      return `${dateKey}-${paddedCount}`;
    });

    return newId;
  } catch (error) {
    console.error('Error generando ID de pedido:', error);
    throw new Error('No se pudo generar el ID del pedido');
  }
}

/**
 * Obtiene el contador actual sin incrementarlo
 * Útil para mostrar preview o debugging
 *
 * @returns Información del contador actual
 */
export async function getCurrentCounter(): Promise<{
  count: number;
  lastDate: string;
  nextId: string;
}> {
  const counterRef = doc(db, COUNTERS_COLLECTION, PEDIDOS_COUNTER_DOC);
  const counterDoc = await getDoc(counterRef);
  const dateKey = getDateKey();

  if (!counterDoc.exists()) {
    return {
      count: 0,
      lastDate: dateKey,
      nextId: `${dateKey}-0001`,
    };
  }

  const data = counterDoc.data();
  const lastDate = data.lastDate || dateKey;
  let count = data.count || 0;

  // Si es un día nuevo, el siguiente será 0001
  if (lastDate !== dateKey) {
    count = 0;
  }

  const nextCount = count + 1;
  const paddedCount = String(nextCount).padStart(4, '0');

  return {
    count,
    lastDate,
    nextId: `${dateKey}-${paddedCount}`,
  };
}

/**
 * Inicializa el contador de pedidos
 * Usar solo en setup inicial o reset manual
 */
export async function initializePedidosCounter(): Promise<void> {
  const counterRef = doc(db, COUNTERS_COLLECTION, PEDIDOS_COUNTER_DOC);
  const dateKey = getDateKey();

  await setDoc(counterRef, {
    count: 0,
    lastDate: dateKey,
    lastUpdated: new Date(),
  });
}

/**
 * Resetea el contador a 0
 * ADVERTENCIA: Usar solo en desarrollo o con extrema precaución
 */
export async function resetPedidosCounter(): Promise<void> {
  const counterRef = doc(db, COUNTERS_COLLECTION, PEDIDOS_COUNTER_DOC);
  const dateKey = getDateKey();

  await updateDoc(counterRef, {
    count: 0,
    lastDate: dateKey,
    lastUpdated: new Date(),
  });
}
