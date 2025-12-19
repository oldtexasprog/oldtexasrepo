/**
 * Componente GraficaVentasPorHora
 * Gráfica de barras mostrando ventas por hora
 */

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { VentasPorHora } from '@/lib/services/reportes.service';

interface Props {
  datos: VentasPorHora[];
  isLoading?: boolean;
}

export function GraficaVentasPorHora({ datos, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="h-80 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  // Filtrar solo las horas con ventas para mejor visualización
  const datosConVentas = datos.filter((d) => d.cantidad > 0);

  if (datosConVentas.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Ventas por Hora
        </h3>
        <div className="flex h-80 items-center justify-center">
          <p className="text-muted-foreground">No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Ventas por Hora
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={datosConVentas}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="hora"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            label={{
              value: 'Cantidad',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'hsl(var(--muted-foreground))' },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            label={{
              value: 'Total ($)',
              angle: 90,
              position: 'insideRight',
              style: { fill: 'hsl(var(--muted-foreground))' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value, name) => {
              if (name === 'total') {
                return [`$${(value || 0).toLocaleString('es-MX')}`, 'Total'];
              }
              return [value || 0, 'Pedidos'];
            }}
          />
          <Legend
            wrapperStyle={{
              color: 'hsl(var(--foreground))',
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="cantidad"
            fill="hsl(var(--primary))"
            name="Pedidos"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="total"
            fill="hsl(var(--chart-2))"
            name="Total"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Resumen debajo de la gráfica */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Hora Pico</p>
          <p className="text-lg font-semibold text-foreground">
            {datosConVentas.reduce((prev, current) =>
              prev.cantidad > current.cantidad ? prev : current
            ).hora}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total del Día</p>
          <p className="text-lg font-semibold text-foreground">
            $
            {datosConVentas
              .reduce((sum, d) => sum + d.total, 0)
              .toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
        </div>
      </div>
    </div>
  );
}
