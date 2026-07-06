import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  runTransaction,
  onSnapshot,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste' | 'merma' | 'venta';

export interface MovimientoInventario {
  id: string;
  ingrediente_id: string;
  ingredienteNombre: string;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  costo_unitario?: number;
  costoTotal?: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  turno_id?: string;
  pedidoId?: string;
  proveedorId?: string;
  proveedorNombre?: string;
  usuarioId: string;
  usuarioNombre: string;
  fecha: Timestamp;
}

export interface FiltrosMovimientoInventario {
  tipo?: TipoMovimientoInventario;
  ingrediente_id?: string;
  turno_id?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  limite?: number;
}

const COLECCION = 'MovimientosInventario';

function colRef() {
  if (!db) throw new Error('Firestore no disponible');
  return collection(db, COLECCION);
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function registrarMovimiento(
  data: Omit<MovimientoInventario, 'id' | 'fecha'>
): Promise<string> {
  const ref = await addDoc(colRef(), { ...data, fecha: Timestamp.now() });
  return ref.id;
}

/**
 * Registra una entrada y actualiza el stock del ingrediente en una transacción.
 */
export async function registrarEntrada(params: {
  ingrediente_id: string;
  ingredienteNombre: string;
  stockActual: number;
  cantidad: number;
  costo_unitario?: number;
  motivo: string;
  turno_id?: string;
  proveedorId?: string;
  proveedorNombre?: string;
  usuarioId: string;
  usuarioNombre: string;
}): Promise<string> {
  if (!db) throw new Error('Firestore no disponible');

  const stockNuevo = params.stockActual + params.cantidad;
  let movimientoId = '';

  await runTransaction(db, async (tx) => {
    const movRef = doc(colRef());
    tx.set(movRef, {
      ingrediente_id: params.ingrediente_id,
      ingredienteNombre: params.ingredienteNombre,
      tipo: 'entrada' as TipoMovimientoInventario,
      cantidad: params.cantidad,
      costo_unitario: params.costo_unitario ?? null,
      costoTotal: params.costo_unitario != null ? params.costo_unitario * params.cantidad : null,
      stockAnterior: params.stockActual,
      stockNuevo,
      motivo: params.motivo,
      turno_id: params.turno_id ?? null,
      proveedorId: params.proveedorId ?? null,
      proveedorNombre: params.proveedorNombre ?? null,
      usuarioId: params.usuarioId,
      usuarioNombre: params.usuarioNombre,
      fecha: Timestamp.now(),
    });
    tx.update(doc(db, 'ingredientes', params.ingrediente_id), {
      stockActual: stockNuevo,
      ultimaActualizacion: Timestamp.now(),
    });
    movimientoId = movRef.id;
  });

  return movimientoId;
}

/**
 * Registra una salida/merma y descuenta stock en una transacción.
 */
export async function registrarSalida(params: {
  ingrediente_id: string;
  ingredienteNombre: string;
  stockActual: number;
  cantidad: number;
  costo_unitario?: number;
  tipo: 'salida' | 'merma' | 'venta';
  motivo: string;
  turno_id?: string;
  pedidoId?: string;
  usuarioId: string;
  usuarioNombre: string;
}): Promise<string> {
  if (!db) throw new Error('Firestore no disponible');

  const stockNuevo = Math.max(0, params.stockActual - params.cantidad);
  let movimientoId = '';

  await runTransaction(db, async (tx) => {
    const movRef = doc(colRef());
    tx.set(movRef, {
      ingrediente_id: params.ingrediente_id,
      ingredienteNombre: params.ingredienteNombre,
      tipo: params.tipo,
      cantidad: params.cantidad,
      costo_unitario: params.costo_unitario ?? null,
      costoTotal: params.costo_unitario != null ? params.costo_unitario * params.cantidad : null,
      stockAnterior: params.stockActual,
      stockNuevo,
      motivo: params.motivo,
      turno_id: params.turno_id ?? null,
      pedidoId: params.pedidoId ?? null,
      usuarioId: params.usuarioId,
      usuarioNombre: params.usuarioNombre,
      fecha: Timestamp.now(),
    });
    tx.update(doc(db, 'ingredientes', params.ingrediente_id), {
      stockActual: stockNuevo,
      ultimaActualizacion: Timestamp.now(),
    });
    movimientoId = movRef.id;
  });

  return movimientoId;
}

/**
 * Ajuste manual de inventario (conteo físico).
 */
export async function registrarAjuste(params: {
  ingrediente_id: string;
  ingredienteNombre: string;
  stockActual: number;
  stockNuevo: number;
  motivo: string;
  turno_id?: string;
  usuarioId: string;
  usuarioNombre: string;
}): Promise<string> {
  if (!db) throw new Error('Firestore no disponible');

  const diferencia = params.stockNuevo - params.stockActual;
  let movimientoId = '';

  await runTransaction(db, async (tx) => {
    const movRef = doc(colRef());
    tx.set(movRef, {
      ingrediente_id: params.ingrediente_id,
      ingredienteNombre: params.ingredienteNombre,
      tipo: 'ajuste' as TipoMovimientoInventario,
      cantidad: Math.abs(diferencia),
      costo_unitario: null,
      costoTotal: null,
      stockAnterior: params.stockActual,
      stockNuevo: params.stockNuevo,
      motivo: `${params.motivo} (diferencia: ${diferencia > 0 ? '+' : ''}${diferencia})`,
      turno_id: params.turno_id ?? null,
      usuarioId: params.usuarioId,
      usuarioNombre: params.usuarioNombre,
      fecha: Timestamp.now(),
    });
    tx.update(doc(db, 'ingredientes', params.ingrediente_id), {
      stockActual: params.stockNuevo,
      ultimaActualizacion: Timestamp.now(),
    });
    movimientoId = movRef.id;
  });

  return movimientoId;
}

// ─── Consultas ────────────────────────────────────────────────────────────────

export async function getMovimientos(
  filtros?: FiltrosMovimientoInventario
): Promise<MovimientoInventario[]> {
  if (!db) throw new Error('Firestore no disponible');

  const constraints = [];
  if (filtros?.tipo)           constraints.push(where('tipo', '==', filtros.tipo));
  if (filtros?.ingrediente_id) constraints.push(where('ingrediente_id', '==', filtros.ingrediente_id));
  if (filtros?.turno_id)       constraints.push(where('turno_id', '==', filtros.turno_id));
  constraints.push(orderBy('fecha', 'desc'));
  if (filtros?.limite)         constraints.push(limit(filtros.limite));

  const snap = await getDocs(query(colRef(), ...constraints));
  let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MovimientoInventario);

  // Filtros de rango de fecha en memoria (evita índice compuesto extra)
  if (filtros?.fechaInicio) {
    const ts = Timestamp.fromDate(filtros.fechaInicio);
    docs = docs.filter((m) => m.fecha >= ts);
  }
  if (filtros?.fechaFin) {
    const ts = Timestamp.fromDate(filtros.fechaFin);
    docs = docs.filter((m) => m.fecha <= ts);
  }

  return docs;
}

export async function getMovimientosPorIngrediente(
  ingrediente_id: string,
  limite = 50
): Promise<MovimientoInventario[]> {
  return getMovimientos({ ingrediente_id, limite });
}

export async function getMovimientosPorTurno(
  turno_id: string
): Promise<MovimientoInventario[]> {
  return getMovimientos({ turno_id });
}

export async function getMovimientosPorFecha(
  inicio: Date,
  fin: Date
): Promise<MovimientoInventario[]> {
  return getMovimientos({ fechaInicio: inicio, fechaFin: fin });
}

// ─── Listener en tiempo real ──────────────────────────────────────────────────

export function suscribirMovimientos(
  callback: (movimientos: MovimientoInventario[]) => void,
  filtros?: { ingrediente_id?: string; limite?: number }
): () => void {
  if (!db) return () => {};

  const constraints = [];
  if (filtros?.ingrediente_id) constraints.push(where('ingrediente_id', '==', filtros.ingrediente_id));
  constraints.push(orderBy('fecha', 'desc'));
  if (filtros?.limite) constraints.push(limit(filtros.limite ?? 100));

  return onSnapshot(
    query(colRef(), ...constraints),
    (snap: QuerySnapshot<DocumentData>) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MovimientoInventario));
    }
  );
}
