'use client';

import { useTurnosCerrados } from '@/lib/hooks/useCaja';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRolGuard } from '@/lib/hooks/useRolGuard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  PackageOpen,
  BarChart3,
  Wallet,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Turno } from '@/lib/types/firestore';

// ── Roadmap de módulos financieros ──────────────────────────────────────────

const MODULOS = [
  {
    id: 'caja',
    nombre: 'Caja',
    descripcion: 'Apertura/cierre de turnos, movimientos, histórico y PDF',
    fase: 1,
    estado: 'completo' as const,
    href: '/caja',
    icon: DollarSign,
    features: [
      'Apertura y cierre de turnos',
      'Registro de ingresos y egresos por catálogo',
      'Corrección de movimientos (auditoría inmutable)',
      'Histórico de cortes con exportación a PDF',
      'Control de acceso por cajero (modo solo-lectura)',
      'Alertas de descuadre en 3 niveles',
    ],
  },
  {
    id: 'inventario',
    nombre: 'Inventario',
    descripcion: 'Control de stock, entradas/salidas y análisis de mermas',
    fase: 2,
    estado: 'en_desarrollo' as const,
    href: '/inventario',
    icon: PackageOpen,
    features: [
      'Movimientos de entrada y salida por ingrediente',
      'Stock actual en tiempo real',
      'Vinculación con proveedores',
      'Análisis de mermas y rotación',
    ],
  },
  {
    id: 'reportes',
    nombre: 'Reportes',
    descripcion: 'Dashboard G/P, KPIs y exportación por periodo',
    fase: 3,
    estado: 'pendiente' as const,
    href: '/reportes',
    icon: BarChart3,
    features: [
      'Dashboard de ganancias y pérdidas',
      'KPIs por período (día/semana/mes)',
      'Gráficas de ventas por canal',
      'Exportación a PDF',
    ],
  },
  {
    id: 'nomina',
    nombre: 'Nómina',
    descripcion: 'Cálculo automático e integración directa con caja',
    fase: 4,
    estado: 'pendiente' as const,
    href: '/nomina',
    icon: Wallet,
    features: [
      'Alta y gestión de empleados',
      'Cálculo de nómina con bonos y descuentos',
      'Pago genera egreso automático en caja',
      'Historial de pagos por empleado',
    ],
  },
];

const ESTADO_CONFIG = {
  completo: {
    label: 'Completo',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-500/10 border-green-500/30',
    badge: 'default' as const,
  },
  en_desarrollo: {
    label: 'En desarrollo',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10 border-amber-500/30',
    badge: 'outline' as const,
  },
  pendiente: {
    label: 'Pendiente',
    icon: Lock,
    color: 'text-muted-foreground',
    bg: 'bg-muted/40 border-border',
    badge: 'secondary' as const,
  },
};

// ── Helpers de métricas ──────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

function calcularMetricasCaja(turnos: Turno[]) {
  const cerrados = turnos.filter((t) => t.estado === 'cerrado' && t.corte);
  const totalTurnos = cerrados.length;
  if (totalTurnos === 0) return null;

  const totalIngresos = cerrados.reduce(
    (acc, t) => acc + (t.resumen?.totalVentas ?? 0),
    0
  );
  const diferencias = cerrados.map((t) => t.corte!.diferencia ?? 0);
  const totalDescuadre = diferencias.reduce((acc, d) => acc + d, 0);
  const turnosConDescuadre = diferencias.filter((d) => Math.abs(d) >= 50).length;
  const tasaDescuadre = Math.round((turnosConDescuadre / totalTurnos) * 100);

  const turnosCruzados = cerrados.filter(
    (t) =>
      t.corte?.cerradoPorNombre &&
      t.cajeroNombre &&
      t.corte.cerradoPorNombre.trim().toLowerCase() !==
        t.cajeroNombre.trim().toLowerCase()
  ).length;

  const ultimoTurno = cerrados[0];

  return {
    totalTurnos,
    totalIngresos,
    totalDescuadre,
    turnosConDescuadre,
    tasaDescuadre,
    turnosCruzados,
    ultimoTurno,
  };
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function FinancieroPage() {
  const { allowed, isLoading: loadingRol } = useRolGuard(['admin', 'encargado']);
  const { data: turnos = [], isLoading: loadingTurnos } = useTurnosCerrados();

  if (loadingRol || loadingTurnos) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-sm text-muted-foreground">
          Solo administradores y encargados pueden ver esta sección.
        </p>
      </div>
    );
  }

  const metricas = calcularMetricasCaja(turnos as Turno[]);
  const modulosCompletos = MODULOS.filter((m) => m.estado === 'completo').length;
  const progreso = Math.round((modulosCompletos / MODULOS.length) * 100);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Financiero</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Analíticas del módulo de caja y estado del roadmap financiero
        </p>
      </div>

      {/* Progreso general del roadmap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Progreso del Módulo Financiero</span>
            <span className="text-2xl font-bold text-primary">{progreso}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={progreso} className="h-3" />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              {MODULOS.filter((m) => m.estado === 'completo').length} completos
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              {MODULOS.filter((m) => m.estado === 'en_desarrollo').length} en desarrollo
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              {MODULOS.filter((m) => m.estado === 'pendiente').length} pendientes
            </span>
          </div>
        </CardContent>
      </Card>

      {/* KPIs de Caja */}
      {metricas ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Analíticas de Caja</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">Turnos cerrados</p>
                <p className="text-2xl font-bold mt-1">{metricas.totalTurnos}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">Total ingresos</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {fmt(metricas.totalIngresos)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">Descuadre neto</p>
                <div className="flex items-center gap-1 mt-1">
                  {metricas.totalDescuadre === 0 ? (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  ) : metricas.totalDescuadre > 0 ? (
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <p
                    className={`text-2xl font-bold ${
                      metricas.totalDescuadre === 0
                        ? 'text-muted-foreground'
                        : metricas.totalDescuadre > 0
                        ? 'text-blue-600'
                        : 'text-destructive'
                    }`}
                  >
                    {fmt(metricas.totalDescuadre)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">Tasa de descuadre</p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    metricas.tasaDescuadre > 30
                      ? 'text-destructive'
                      : metricas.tasaDescuadre > 15
                      ? 'text-amber-600'
                      : 'text-green-600'
                  }`}
                >
                  {metricas.tasaDescuadre}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {metricas.turnosConDescuadre} de {metricas.totalTurnos} turnos ≥ $50
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas operativas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricas.turnosCruzados > 0 && (
              <div className="flex gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Turnos cruzados</p>
                  <p className="text-xs mt-0.5">
                    {metricas.turnosCruzados} turno{metricas.turnosCruzados > 1 ? 's fueron cerrados' : ' fue cerrado'} por alguien distinto a quien lo abrió.
                  </p>
                </div>
              </div>
            )}
            {metricas.tasaDescuadre > 30 && (
              <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
                <TrendingDown className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Tasa de descuadre alta</p>
                  <p className="text-xs mt-0.5">
                    Más del 30% de los turnos tienen diferencias ≥ $50. Revisa el histórico.
                  </p>
                </div>
              </div>
            )}
            {metricas.turnosCruzados === 0 && metricas.tasaDescuadre <= 30 && (
              <div className="flex gap-3 p-4 rounded-lg border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Operación saludable</p>
                  <p className="text-xs mt-0.5">
                    Sin turnos cruzados y tasa de descuadre dentro del umbral aceptable.
                  </p>
                </div>
              </div>
            )}
            {metricas.ultimoTurno && (
              <div className="flex gap-3 p-4 rounded-lg border bg-muted/40">
                <DollarSign className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Último turno cerrado</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    {metricas.ultimoTurno.cajeroNombre} ·{' '}
                    {metricas.ultimoTurno.tipo} ·{' '}
                    {metricas.ultimoTurno.fecha
                      ? format(new Date(metricas.ultimoTurno.fecha), "d MMM yyyy", { locale: es })
                      : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            Sin turnos cerrados aún. Las analíticas de caja aparecerán aquí una vez que se registren turnos.
          </CardContent>
        </Card>
      )}

      {/* Roadmap de módulos */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Roadmap — Módulos Financieros</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MODULOS.map((modulo) => {
            const cfg = ESTADO_CONFIG[modulo.estado];
            const EstadoIcon = cfg.icon;
            const ModuloIcon = modulo.icon;

            return (
              <Card key={modulo.id} className={`border ${cfg.bg}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-background border">
                        <ModuloIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{modulo.nombre}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">Fase {modulo.fase}</p>
                      </div>
                    </div>
                    <Badge variant={cfg.badge} className="flex items-center gap-1 shrink-0">
                      <EstadoIcon className={`h-3 w-3 ${cfg.color}`} />
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">{modulo.descripcion}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {modulo.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs">
                        {modulo.estado === 'completo' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 shrink-0 mt-0.5" />
                        )}
                        <span className={modulo.estado !== 'completo' ? 'text-muted-foreground' : ''}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
