/**
 * Componente TablaDesempenoRepartidores
 * Tabla con el desempeño de los repartidores
 */

'use client';

import { Bike, Clock, DollarSign, Package } from 'lucide-react';
import type { DesempenoRepartidor } from '@/lib/services/reportes.service';

interface Props {
  repartidores: DesempenoRepartidor[];
  isLoading?: boolean;
}

export function TablaDesempenoRepartidores({ repartidores, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="h-80 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  if (!repartidores || repartidores.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Desempeño de Repartidores
        </h3>
        <div className="flex h-60 items-center justify-center">
          <p className="text-muted-foreground">No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Desempeño de Repartidores
        </h3>
        <Bike className="h-5 w-5 text-primary" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Repartidor
              </th>
              <th className="pb-3 text-center text-sm font-medium text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Package className="h-4 w-4" />
                  Pedidos
                </div>
              </th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                <div className="flex items-center justify-end gap-1">
                  <DollarSign className="h-4 w-4" />
                  Total
                </div>
              </th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                <div className="flex items-center justify-end gap-1">
                  <DollarSign className="h-4 w-4" />
                  Comisiones
                </div>
              </th>
              <th className="pb-3 text-center text-sm font-medium text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  T. Promedio
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {repartidores.map((repartidor, index) => (
              <tr
                key={repartidor.repartidorId}
                className="border-b border-border last:border-0"
              >
                <td className="py-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {repartidor.repartidorNombre}
                    </p>
                    {index === 0 && (
                      <p className="text-xs text-yellow-600">⭐ Mejor del día</p>
                    )}
                  </div>
                </td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {repartidor.pedidosEntregados}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="font-semibold text-foreground">
                    ${repartidor.totalEntregado.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="font-semibold text-green-600">
                    ${repartidor.comisionesGanadas.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {repartidor.tiempoPromedioEntrega} min
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Repartidores</p>
            <p className="text-lg font-semibold text-foreground">
              {repartidores.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Pedidos</p>
            <p className="text-lg font-semibold text-foreground">
              {repartidores.reduce((sum, r) => sum + r.pedidosEntregados, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Entregado</p>
            <p className="text-lg font-semibold text-foreground">
              ${repartidores
                .reduce((sum, r) => sum + r.totalEntregado, 0)
                .toLocaleString('es-MX')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Comisiones</p>
            <p className="text-lg font-semibold text-green-600">
              ${repartidores
                .reduce((sum, r) => sum + r.comisionesGanadas, 0)
                .toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
