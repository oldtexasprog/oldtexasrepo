'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, Truck, Calculator, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface ResumenTotalesProps {
  subtotal: number;
  costoEnvio: number;
  descuento?: number;
  total: number;
  cantidadProductos: number;
  metodoPago?: string;
  cambio?: number;
}

export function ResumenTotales({
  subtotal,
  costoEnvio,
  descuento = 0,
  total,
  cantidadProductos,
  metodoPago,
  cambio,
}: ResumenTotalesProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Resumen del Pedido</h3>
        </div>

        {/* Cantidad de productos */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>Productos</span>
          </div>
          <Badge variant="secondary">{cantidadProductos} items</Badge>
        </div>

        <Separator />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="text-lg font-semibold">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Costo de envío */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Envío</span>
          </div>
          <span className="text-lg font-semibold">
            {costoEnvio > 0 ? formatCurrency(costoEnvio) : 'Gratis'}
          </span>
        </div>

        {/* Descuento */}
        {descuento > 0 && (
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span className="text-sm font-medium">Descuento</span>
            </div>
            <span className="text-lg font-semibold">
              -{formatCurrency(descuento)}
            </span>
          </div>
        )}

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">TOTAL</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Información de pago */}
        {metodoPago && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Método de pago</span>
                <Badge variant="outline" className="capitalize">
                  {metodoPago}
                </Badge>
              </div>

              {cambio !== undefined && cambio > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Cambio a entregar
                  </span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(cambio)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
