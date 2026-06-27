/**
 * Servicio de Conceptos Financieros
 * Old Texas BBQ - CRM
 *
 * Gestiona la colección `ConceptosFinancieros` que alimenta los selectores
 * de ingreso/egreso en el módulo de caja.
 *
 * Estructura del documento:
 * {
 *   id: string (auto)
 *   nombre: string
 *   tipo: 'ingreso' | 'egreso'
 *   activo: boolean
 *   orden?: number   — para ordenar en UI
 * }
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface ConceptoFinanciero {
  id: string;
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  activo: boolean;
  orden?: number;
}

const COLECCION = 'ConceptosFinancieros';

function ref() {
  if (!db) throw new Error('Firestore no disponible');
  return collection(db, COLECCION);
}

/** Obtiene todos los conceptos activos de un tipo. */
export async function getConceptosPorTipo(
  tipo: 'ingreso' | 'egreso'
): Promise<ConceptoFinanciero[]> {
  const q = query(
    ref(),
    where('tipo', '==', tipo),
    where('activo', '==', true),
    orderBy('orden', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ConceptoFinanciero);
}

/** Obtiene todos los conceptos (para administración). */
export async function getTodosLosConceptos(): Promise<ConceptoFinanciero[]> {
  const q = query(ref(), orderBy('tipo', 'asc'), orderBy('orden', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ConceptoFinanciero);
}

/** Crea un nuevo concepto. */
export async function crearConcepto(
  data: Omit<ConceptoFinanciero, 'id'>
): Promise<string> {
  const docRef = await addDoc(ref(), {
    ...data,
    creadoEn: Timestamp.now(),
  });
  return docRef.id;
}

/** Actualiza un concepto existente. */
export async function actualizarConcepto(
  id: string,
  data: Partial<Omit<ConceptoFinanciero, 'id'>>
): Promise<void> {
  if (!db) throw new Error('Firestore no disponible');
  await updateDoc(doc(db, COLECCION, id), {
    ...data,
    actualizadoEn: Timestamp.now(),
  });
}

/** Elimina permanentemente un concepto (solo admin). */
export async function eliminarConcepto(id: string): Promise<void> {
  if (!db) throw new Error('Firestore no disponible');
  await deleteDoc(doc(db, COLECCION, id));
}

// ── Seed inicial ──────────────────────────────────────────────────────────────
// Llama esta función una sola vez para poblar la colección en un entorno vacío.
export async function seedConceptos(): Promise<void> {
  const ingresos: Omit<ConceptoFinanciero, 'id'>[] = [
    { nombre: 'Venta mostrador', tipo: 'ingreso', activo: true, orden: 1 },
    { nombre: 'Venta delivery', tipo: 'ingreso', activo: true, orden: 2 },
    { nombre: 'Anticipo cliente', tipo: 'ingreso', activo: true, orden: 3 },
    { nombre: 'Recuperación faltante', tipo: 'ingreso', activo: true, orden: 4 },
    { nombre: 'Otro ingreso', tipo: 'ingreso', activo: true, orden: 99 },
  ];
  const egresos: Omit<ConceptoFinanciero, 'id'>[] = [
    { nombre: 'Compra insumos', tipo: 'egreso', activo: true, orden: 1 },
    { nombre: 'Pago proveedor', tipo: 'egreso', activo: true, orden: 2 },
    { nombre: 'Nómina', tipo: 'egreso', activo: true, orden: 3 },
    { nombre: 'Servicios (agua/luz/gas)', tipo: 'egreso', activo: true, orden: 4 },
    { nombre: 'Mantenimiento', tipo: 'egreso', activo: true, orden: 5 },
    { nombre: 'Retiro para depósito', tipo: 'egreso', activo: true, orden: 6 },
    { nombre: 'Gastos varios', tipo: 'egreso', activo: true, orden: 7 },
    { nombre: 'Otro egreso', tipo: 'egreso', activo: true, orden: 99 },
  ];
  for (const c of [...ingresos, ...egresos]) {
    await crearConcepto(c);
  }
}
