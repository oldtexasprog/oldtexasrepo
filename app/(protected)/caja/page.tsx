'use client';

import { AperturaTurno } from '@/components/caja/AperturaTurno';
import { RegistroMovimiento } from '@/components/caja/RegistroMovimiento';
import { ResumenCaja } from '@/components/caja/ResumenCaja';
import { CierreTurno } from '@/components/caja/CierreTurno';
import { useTurnoActivo, useTurnoVencido } from '@/lib/hooks/useCaja';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CajaPage() {
  const { data: turno, isLoading, isError } = useTurnoActivo();
  const { data: vencidos = [] } = useTurnoVencido(10);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Error al cargar el estado de caja. Recarga la página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Alerta turno vencido */}
      {vencidos.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <Clock className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Turno abierto hace más de 10 horas</p>
            <p className="text-xs mt-0.5 text-amber-600 dark:text-amber-500">
              El turno lleva demasiado tiempo activo. Si el cajero ya terminó, realiza el cierre lo antes posible.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Caja</h1>
          <p className="text-muted-foreground">
            {turno
              ? `Turno ${turno.tipo} activo · abierto a las ${
                  turno.horaInicio?.toDate
                    ? turno.horaInicio.toDate().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                    : '-'
                }`
              : 'Sin turno activo'}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/caja/corte">Ver Histórico</Link>
        </Button>
      </div>

      {/* Sin turno activo → mostrar apertura */}
      {!turno && (
        <div className="flex justify-center pt-8">
          <AperturaTurno />
        </div>
      )}

      {/* Turno activo → operación normal */}
      {turno && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: registro + cierre */}
          <div className="space-y-4">
            <RegistroMovimiento turnoId={turno.id} />
            <CierreTurno turno={turno} />
          </div>

          {/* Columna derecha (2/3): resumen en vivo */}
          <div className="lg:col-span-2">
            <ResumenCaja turno={turno} />
          </div>
        </div>
      )}
    </div>
  );
}
