/**
 * Componente GraficaVentasPorCanal
 * Gráfica de pie mostrando ventas por canal
 */

'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { VentasPorCanal } from '@/lib/services/reportes.service';

interface Props {
  datos: VentasPorCanal[];
  isLoading?: boolean;
}

const COLORES = {
  whatsapp: '#25D366',
  mostrador: '#3B82F6',
  uber: '#000000',
  didi: '#FF6600',
  llamada: '#8B5CF6',
  web: '#10B981',
};

const NOMBRES_CANAL = {
  whatsapp: 'WhatsApp',
  mostrador: 'Mostrador',
  uber: 'Uber Eats',
  didi: 'Didi Food',
  llamada: 'Llamada',
  web: 'Web',
};

export function GraficaVentasPorCanal({ datos, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="h-80 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  // Filtrar solo canales con ventas
  const datosConVentas = datos.filter((d) => d.cantidad > 0);

  if (datosConVentas.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Ventas por Canal
        </h3>
        <div className="flex h-80 items-center justify-center">
          <p className="text-muted-foreground">No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  // Preparar datos para la gráfica
  const datosGrafica = datosConVentas.map((d) => ({
    name: NOMBRES_CANAL[d.canal],
    value: d.total,
    cantidad: d.cantidad,
    porcentaje: d.porcentaje,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Ventas por Canal
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfica de Pie */}
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={datosGrafica}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {datosConVentas.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORES[entry.canal]}
                  opacity={0.8}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number, name: string, props: any) => [
                `$${value.toLocaleString('es-MX')} (${props.payload.cantidad} pedidos)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Lista detallada */}
        <div className="space-y-3">
          {datosConVentas.map((d) => (
            <div
              key={d.canal}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: COLORES[d.canal] }}
                ></div>
                <div>
                  <p className="font-medium text-foreground">
                    {NOMBRES_CANAL[d.canal]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.cantidad} pedidos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ${d.total.toLocaleString('es-MX')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {d.porcentaje}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Canal Principal</p>
            <p className="text-lg font-semibold text-foreground">
              {
                NOMBRES_CANAL[
                  datosConVentas.reduce((prev, current) =>
                    prev.total > current.total ? prev : current
                  ).canal
                ]
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Pedidos</p>
            <p className="text-lg font-semibold text-foreground">
              {datosConVentas.reduce((sum, d) => sum + d.cantidad, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
