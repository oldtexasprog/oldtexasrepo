/**
 * Componente ResumenDiario
 * Muestra métricas clave del día
 */

'use client';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Percent,
  Minus,
} from 'lucide-react';
import type { ResumenDiario, ComparativaConDiaAnterior } from '@/lib/services/reportes.service';

interface Props {
  resumen: ResumenDiario;
  comparativa?: ComparativaConDiaAnterior;
  isLoading?: boolean;
}

interface MetricaCardProps {
  titulo: string;
  valor: string | number;
  variacion?: number;
  icono: React.ReactNode;
  descripcion?: string;
}

function MetricaCard({
  titulo,
  valor,
  variacion,
  icono,
  descripcion,
}: MetricaCardProps) {
  const getTendenciaColor = (val: number) => {
    if (val > 0) return 'text-green-600';
    if (val < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getTendenciaIcono = (val: number) => {
    if (val > 0) return <TrendingUp className="h-4 w-4" />;
    if (val < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{valor}</p>

          {variacion !== undefined && typeof variacion === 'number' && !isNaN(variacion) && (
            <div
              className={`mt-2 flex items-center gap-1 text-sm font-medium ${getTendenciaColor(variacion)}`}
            >
              {getTendenciaIcono(variacion)}
              <span>{Math.abs(variacion).toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">vs ayer</span>
            </div>
          )}

          {descripcion && (
            <p className="mt-1 text-xs text-muted-foreground">{descripcion}</p>
          )}
        </div>

        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icono}
        </div>
      </div>
    </div>
  );
}

export function ResumenDiario({ resumen, comparativa, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-muted"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricaCard
          titulo="Total Ventas"
          valor={`$${resumen.totalVentas.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variacion={comparativa?.variacionVentas}
          icono={<DollarSign className="h-6 w-6" />}
          descripcion="Ingresos del día"
        />

        <MetricaCard
          titulo="Total Pedidos"
          valor={resumen.totalPedidos}
          variacion={comparativa?.variacionPedidos}
          icono={<ShoppingCart className="h-6 w-6" />}
          descripcion="Pedidos completados"
        />

        <MetricaCard
          titulo="Ticket Promedio"
          valor={`$${resumen.ticketPromedio.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variacion={comparativa?.variacionTicketPromedio}
          icono={<Percent className="h-6 w-6" />}
          descripcion="Promedio por pedido"
        />

        <MetricaCard
          titulo="Total Envíos"
          valor={`$${resumen.totalEnvios.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icono={<DollarSign className="h-6 w-6" />}
          descripcion="Costos de envío"
        />
      </div>

      {/* Resumen detallado */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pedidos por Estado */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Pedidos por Estado
          </h3>
          <div className="space-y-3">
            {Object.entries(resumen.pedidosPorEstado).map(
              ([estado, cantidad]) => (
                <div
                  key={estado}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm capitalize text-muted-foreground">
                    {estado.replace(/_/g, ' ')}
                  </span>
                  <span className="font-semibold text-foreground">
                    {typeof cantidad === 'number' && !isNaN(cantidad) ? cantidad : 0}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Ventas por Método de Pago */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Ventas por Método de Pago
          </h3>
          <div className="space-y-3">
            {Object.entries(resumen.ventasPorMetodoPago)
              .filter(([, total]) => typeof total === 'number' && !isNaN(total) && total > 0)
              .map(([metodo, total]) => (
                <div
                  key={metodo}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm capitalize text-muted-foreground">
                    {metodo}
                  </span>
                  <span className="font-semibold text-foreground">
                    ${(total || 0).toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
