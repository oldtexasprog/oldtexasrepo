import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;          // nombre de la persona de contacto
  email: string;
  telefono: string;
  direccion?: string;
  rfc?: string;
  notas?: string;
  activo: boolean;
  creadoPor: string;
  creadoEn: Timestamp;
  actualizadoEn?: Timestamp;
}

export type NuevoProveedor = Omit<Proveedor, 'id' | 'creadoEn' | 'actualizadoEn'>;

const COLECCION = 'Proveedores';

function colRef() {
  if (!db) throw new Error('Firestore no disponible');
  return collection(db, COLECCION);
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function crearProveedor(data: NuevoProveedor): Promise<string> {
  const ref = await addDoc(colRef(), { ...data, activo: true, creadoEn: Timestamp.now() });
  return ref.id;
}

export async function getProveedor(id: string): Promise<Proveedor | null> {
  if (!db) throw new Error('Firestore no disponible');
  const snap = await getDoc(doc(db, COLECCION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Proveedor;
}

export async function getProveedores(soloActivos = true): Promise<Proveedor[]> {
  const constraints = [];
  if (soloActivos) constraints.push(where('activo', '==', true));
  constraints.push(orderBy('nombre', 'asc'));
  const snap = await getDocs(query(colRef(), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Proveedor);
}

export async function actualizarProveedor(
  id: string,
  data: Partial<Omit<Proveedor, 'id' | 'creadoEn' | 'creadoPor'>>
): Promise<void> {
  if (!db) throw new Error('Firestore no disponible');
  await updateDoc(doc(db, COLECCION, id), { ...data, actualizadoEn: Timestamp.now() });
}

/** Soft-delete: marca activo = false. */
export async function desactivarProveedor(id: string): Promise<void> {
  return actualizarProveedor(id, { activo: false });
}

/** Hard-delete: solo admin. */
export async function eliminarProveedor(id: string): Promise<void> {
  if (!db) throw new Error('Firestore no disponible');
  await deleteDoc(doc(db, COLECCION, id));
}

// ─── Listener en tiempo real ──────────────────────────────────────────────────

export function suscribirProveedores(
  callback: (proveedores: Proveedor[]) => void
): () => void {
  if (!db) return () => {};
  const q = query(colRef(), where('activo', '==', true), orderBy('nombre', 'asc'));
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Proveedor));
  });
}
