/**
 * Componente TablaProductosMasVendidos
 * Tabla con los productos más vendidos del día
 */

'use client';

import { Trophy, TrendingUp } from 'lucide-react';
import type { ProductoMasVendido } from '@/lib/services/reportes.service';

interface Props {
  productos: ProductoMasVendido[];
  isLoading?: boolean;
}

export function TablaProductosMasVendidos({ productos, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="h-80 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Productos Más Vendidos
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
          Productos Más Vendidos
        </h3>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                #
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Producto
              </th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                Cantidad
              </th>
              <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                Total Vendido
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr
                key={producto.productoId}
                className="border-b border-border last:border-0"
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                    {index === 1 && (
                      <Trophy className="h-4 w-4 text-gray-400" />
                    )}
                    {index === 2 && (
                      <Trophy className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {producto.productoNombre}
                    </p>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-semibold text-foreground">
                      {producto.cantidad}
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </td>
                <td className="py-3 text-right">
                  <span className="font-semibold text-foreground">
                    ${producto.total.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <p className="text-lg font-semibold text-foreground">
              {productos.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Unidades Vendidas</p>
            <p className="text-lg font-semibold text-foreground">
              {productos.reduce((sum, p) => sum + p.cantidad, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
