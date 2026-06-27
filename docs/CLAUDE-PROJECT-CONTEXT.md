# CLAUDE.md — Contexto del proyecto OLDTEXAS 2.0

> Este archivo le da a Claude (o a cualquier agente de código) **todo el contexto necesario** para implementar los módulos de OLDTEXAS 2.0 de forma consistente y eficiente. Léelo completo antes de escribir código. Sigue los patrones y plantillas al pie de la letra.

---

## 1. Qué es este proyecto

OLDTEXAS 2.0 es el CRM de gestión operativa y financiera del restaurante **Old Texas BBQ**. Reemplaza la gestión actual basada en hojas de Excel por un sistema integrado con cuatro módulos nuevos —**Caja, Inventario, Reportes y Nómina**— construidos sobre la plataforma existente.

**Principio rector:** una sola fuente de verdad. Cada operación (venta, compra, pago de nómina) se registra una vez y se refleja automáticamente en los reportes financieros, sin recaptura manual.

**Documentos hermanos en esta carpeta:**
- `PROPUESTA OLDTEXAS 2.0 - FINAL.docx` — el porqué (diagnóstico y objetivos de negocio).
- `HOJA DE RUTA OLDTEXAS 2.0 - DESARROLLO.docx` — el qué/cuándo (plan técnico por fases).
- `TODO.md` — checklist accionable de ejecución.
- **Este `CLAUDE.md`** — el cómo (contexto, patrones y plantillas para implementar).

---

## 2. Stack tecnológico (NO migrar)

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | **Next.js 16** (App Router) | Server/Client Components, rutas en `app/` |
| UI | **Tailwind CSS + shadcn/ui** | Reutilizar componentes existentes; no introducir otra librería UI |
| Datos | **Firebase Firestore** | Colecciones documentales (ver §5) |
| Auth | **Firebase Auth** | Roles y permisos ya implementados |
| Backend | **Firebase Cloud Functions** | Para lógica server-side cuando aplique |
| Data fetching | **React Query (@tanstack/react-query)** | Ya configurado; usar para TODO acceso a datos |
| Estado global | **Zustand** | Usuario, permisos, turno activo |
| Gráficos | **Recharts** | Dashboards y reportes |
| PDF | **jsPDF** | Exportación de reportes |
| Formularios | **react-hook-form** | Validación de TODOS los formularios |
| Lenguaje | **TypeScript** | Tipado estricto; prohibido `any` |

**Regla:** todo se construye sobre lo existente. No agregar dependencias nuevas sin justificación explícita.

---

## 3. Estructura de carpetas

```
lib/
  types/firestore.ts        # TODOS los tipos TypeScript del dominio (fuente única)
  services/                 # Acceso a datos y lógica de negocio (1 archivo por dominio)
  stores/                   # Stores de Zustand
  hooks/                    # Hooks de React Query (useX, useCreateX, ...)
components/
  <modulo>/                 # Componentes por módulo: caja/, inventario/, reportes/, nomina/
  ui/                       # shadcn/ui (no tocar salvo extender)
app/
  (protected)/<modulo>/     # Rutas protegidas por auth
  api/                      # Endpoints API si son necesarios
```

**Dónde va cada cosa:**
- ¿Acceso a Firestore o cálculo de negocio? → `lib/services/<dominio>.service.ts`
- ¿Fetching/caché en React? → hook en `lib/hooks/` que envuelve el servicio con React Query
- ¿UI reutilizable? → `components/<modulo>/`
- ¿Página/ruta? → `app/(protected)/<modulo>/`
- ¿Tipo de dato? → `lib/types/firestore.ts`

---

## 4. Convenciones y estándares

1. **Nombres por dominio, descriptivos:** `AperturaTurno.tsx`, no `CajaTurno.tsx`. Servicios `camelCase.service.ts`. Hooks `useNombre`. Tipos `PascalCase`.
2. **Servicios siempre retornan tipos tipados.** Nada de `any`, nada de `Promise<any>`.
3. **Data fetching solo vía React Query**, nunca `useEffect` + `fetch` manual en componentes.
4. **Formularios con react-hook-form** + validación; mostrar mensajes de error claros.
5. **Estado global mínimo en Zustand:** usuario/permisos y turno activo. Lo demás es estado de servidor (React Query) o local.
6. **Una rama por fase:** `git checkout -b semana-X-objetivo`.
7. **Toda escritura financiera incluye `fecha` y `usuario_id`** para trazabilidad.
8. **Permisos por rol** se verifican en cada ruta protegida y en operaciones sensibles.
9. **Componentes pequeños y enfocados;** la lógica vive en servicios/hooks, no en el JSX.
10. **Reutiliza shadcn/ui** (Button, Input, Card, Table, Dialog, Select, etc.) en lugar de crear primitivos.

---

## 5. Modelo de datos (Firestore)

Colecciones por módulo. Los campos marcados con `?` son opcionales. Define cada interfaz en `lib/types/firestore.ts`.

### Existentes (reutilizar)
- `Usuarios` — auth, rol, permisos.
- `Productos` — catálogo TPV. **Ampliar** con `cantidad_vendida` por turno/día.
- `Ingredientes` — base de datos con precios/costos.
- `Recetas` — vinculadas a ingredientes y costos.

### Módulo Caja
```ts
interface Turno {
  id: string;
  fecha: Timestamp;
  usuario_id: string;
  hora_apertura: Timestamp;
  hora_cierre?: Timestamp;
  saldo_inicial: number;
  estado: 'abierto' | 'cerrado';
}
interface MovimientoCaja {
  id: string;
  turno_id: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  concepto: string;          // referencia a ConceptosFinancieros
  descripcion?: string;
  fecha: Timestamp;
  usuario_id: string;
}
interface CierreCaja {
  id: string;
  turno_id: string;
  monto_esperado: number;
  monto_real: number;
  diferencia: number;        // monto_real - monto_esperado
  notas?: string;
  fecha: Timestamp;
}
```

### Módulo Inventario
```ts
interface MovimientoInventario {
  id: string;
  ingrediente_id: string;
  tipo: 'entrada' | 'salida' | 'merma' | 'gasto';
  cantidad: number;
  costo_unitario: number;
  motivo?: string;
  fecha: Timestamp;
  turno_id?: string;
  proveedor_id?: string;     // si tipo === 'entrada'
}
interface Proveedor {
  id: string;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}
interface ConceptoFinanciero {
  id: string;
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  categoria: string;
  descripcion?: string;
}
```

### Módulo Nómina
```ts
interface Empleado {
  id: string;
  nombre: string;
  cargo: string;
  salario_base: number;
  fecha_contratacion: Timestamp;
  estado: 'activo' | 'baja';
  sucursal?: string;
}
interface Nomina {
  id: string;
  empleado_id: string;
  periodo: string;           // p.ej. "2026-S26"
  salario_base: number;
  bonos: number;
  descuentos: number;
  total: number;             // salario_base + bonos - descuentos
  estado: 'pendiente' | 'pagada';
}
interface TurnoEmpleado {
  id: string;
  empleado_id: string;
  turno_id: string;          // integración con Turno
  fecha: Timestamp;
}
```

### Módulo Reportes
No crea colecciones propias: **agrega y lee** `MovimientoCaja`, `MovimientoInventario`, `Nomina` y `Productos` para producir vistas de G/P, KPIs y export PDF.

### Integraciones clave (críticas)
- **Nómina → Caja:** al marcar una `Nomina` como `pagada`, crear automáticamente un `MovimientoCaja` de tipo `egreso` por el `total`. (`integracionCaja.service.ts`)
- **TurnoEmpleado ↔ Turno:** los turnos trabajados se vinculan a los turnos de caja.
- **Reportes** depende de que Caja e Inventario registren datos correctamente; no duplicar cálculos, reutilizar servicios.

---

## 6. Patrones de implementación (plantillas)

Usa estas plantillas como base. Mantienen consistencia y aceleran el desarrollo.

### 6.1 Servicio (CRUD Firestore)
```ts
// lib/services/turnos.service.ts
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { Turno } from '@/lib/types/firestore';

const COL = 'Turnos';

export async function abrirTurno(data: Pick<Turno,'usuario_id'|'saldo_inicial'>): Promise<string> {
  // Regla: no permitir dos turnos abiertos a la vez (validar antes)
  const activo = await getTurnoActivo();
  if (activo) throw new Error('Ya existe un turno abierto');
  const ref = await addDoc(collection(db, COL), {
    ...data,
    fecha: Timestamp.now(),
    hora_apertura: Timestamp.now(),
    estado: 'abierto',
  });
  return ref.id;
}

export async function getTurnoActivo(): Promise<Turno | null> {
  const q = query(collection(db, COL), where('estado','==','abierto'));
  const snap = await getDocs(q);
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Turno);
}

export async function cerrarTurno(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { estado: 'cerrado', hora_cierre: Timestamp.now() });
}
```

### 6.2 Hook de React Query
```ts
// lib/hooks/useTurnos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTurnoActivo, abrirTurno, cerrarTurno } from '@/lib/services/turnos.service';

export const useTurnoActivo = () =>
  useQuery({ queryKey: ['turno-activo'], queryFn: getTurnoActivo });

export const useAbrirTurno = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: abrirTurno,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['turno-activo'] }),
  });
};
```

### 6.3 Store de Zustand (estado global mínimo)
```ts
// lib/stores/useSession.ts
import { create } from 'zustand';
interface SessionState {
  usuarioId: string | null;
  rol: 'admin' | 'cajero' | 'supervisor' | null;
  turnoActivoId: string | null;
  setTurnoActivo: (id: string | null) => void;
}
export const useSession = create<SessionState>((set) => ({
  usuarioId: null, rol: null, turnoActivoId: null,
  setTurnoActivo: (id) => set({ turnoActivoId: id }),
}));
```

### 6.4 Componente con formulario (react-hook-form + shadcn/ui)
```tsx
// components/caja/RegistroMovimiento.tsx
'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegistrarMovimiento } from '@/lib/hooks/useMovimientosCaja';

type Form = { tipo: 'ingreso'|'egreso'; monto: number; concepto: string; descripcion?: string };

export function RegistroMovimiento({ turnoId }: { turnoId: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();
  const { mutate, isPending } = useRegistrarMovimiento();
  const onSubmit = (d: Form) => mutate({ ...d, turno_id: turnoId });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input type="number" step="0.01" placeholder="Monto"
        {...register('monto', { required: true, valueAsNumber: true })} />
      {errors.monto && <p className="text-sm text-red-600">Monto requerido</p>}
      <Input placeholder="Concepto" {...register('concepto', { required: true })} />
      <Button type="submit" disabled={isPending}>Guardar movimiento</Button>
    </form>
  );
}
```

### 6.5 Ruta protegida (App Router)
```tsx
// app/(protected)/caja/page.tsx
import { ResumenCaja } from '@/components/caja/ResumenCaja';
import { RegistroMovimiento } from '@/components/caja/RegistroMovimiento';

export default function CajaPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RegistroMovimiento turnoId="..." />
      <ResumenCaja />
    </div>
  );
}
```

---

## 7. Flujo de trabajo por tarea

Para cada tarea de la hoja de ruta, en este orden:

1. **Tipos** — define/actualiza la interfaz en `lib/types/firestore.ts`.
2. **Servicio** — implementa el CRUD/lógica en `lib/services/`.
3. **Hook** — envuelve el servicio con React Query en `lib/hooks/`.
4. **Componente** — UI con shadcn/ui + react-hook-form en `components/<modulo>/`.
5. **Ruta** — monta los componentes en `app/(protected)/<modulo>/`.
6. **Testing** — prueba el flujo completo del módulo (ver §8).
7. **Verifica los criterios de aceptación** de la fase antes de avanzar.

---

## 8. Definition of Done (por módulo)

No marcar una fase como completa hasta que TODOS sus criterios pasen. Resumen (detalle completo en `TODO.md`):

- **Caja:** turno único activo; cada movimiento actualiza saldo en vivo; cierre calcula esperado vs real y diferencia.
- **Inventario:** cada movimiento clasificado por tipo y fecha; stock se recalcula automáticamente; proveedores vinculados a entradas; análisis de top productos correcto.
- **Reportes:** datos provienen de Caja/Inventario (sin duplicar cálculos); KPIs coinciden con movimientos; filtros recalculan; export PDF correcto.
- **Nómina:** alta persiste; cálculo de salario/bonos/descuentos correcto; pago genera egreso automático en caja; totales consistentes entre módulos.
- **Go-Live:** flujos E2E sin errores; responsivo; permisos por rol; build desplegada y verificada; documentación lista.

---

## 9. Cronograma (respetar el orden)

| Fase | Módulo | Semanas |
|------|--------|---------|
| 1 | Sistema de Caja completo | 1–2 |
| 2 | Inventario detallado | 3–5 |
| 3 | Dashboard de Reportes (G/P) | 6–7 |
| 4 | Sistema de Nómina | 8 |
| 5 | Pulido, testing y Go-Live | 9–10 |

Las fases son **secuenciales** porque cada una depende de los datos de la anterior (Reportes necesita Caja e Inventario; Nómina se integra con Caja).

---

## 10. Comandos

```bash
npm run dev      # entorno de desarrollo
npm run build    # compilar para producción
npm run lint     # verificar errores de código
npm run format   # formatear automáticamente
npm test         # pruebas unitarias
```

---

## 11. Guardrails — qué NO hacer

- ❌ No migrar de stack ni introducir librerías UI alternativas a shadcn/ui.
- ❌ No usar `any` ni servicios sin tipar.
- ❌ No hacer fetching manual en componentes; usar React Query.
- ❌ No duplicar lógica de cálculo financiero entre módulos; Reportes reutiliza servicios.
- ❌ No permitir dos turnos de caja abiertos simultáneamente.
- ❌ No registrar pagos de nómina sin generar el egreso correspondiente en caja.
- ❌ No avanzar de fase con criterios de aceptación incompletos.
- ❌ No exponer rutas protegidas sin verificación de rol.

---

## 12. Glosario de negocio

- **Turno:** periodo de caja con apertura y cierre; agrupa los movimientos del día/jornada.
- **Merma:** producto perdido/desperdiciado (se distingue del **gasto extraordinario**).
- **Concepto financiero:** etiqueta estandarizada de ingreso/egreso (catálogo).
- **G/P:** Ganancias y Pérdidas (estado de resultados operativo).
- **Cierre:** conciliación de caja al final del turno (esperado vs real).

---

_Mantén este archivo actualizado conforme evolucione el proyecto. Es la referencia primaria para implementar de forma eficiente y consistente._
