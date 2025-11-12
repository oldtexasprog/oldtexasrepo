'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export interface ItemCarrito {
  id: string;
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  personalizaciones?: {
    salsas?: string[];
    extras?: string[];
    presentacion?: string;
    notas?: string;
  };
  subtotal: number;
}

interface CarritoProductosProps {
  items: ItemCarrito[];
  onUpdateCantidad: (index: number, cantidad: number) => void;
  onRemoveItem: (index: number) => void;
  onEditItem?: (index: number) => void;
}

export function CarritoProductos({
  items,
  onUpdateCantidad,
  onRemoveItem,
  onEditItem,
}: CarritoProductosProps) {
  if (items.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Carrito vacío</p>
          <p className="text-sm">Agrega productos para comenzar</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Carrito de Productos</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.productoId}-${index}`}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            {/* Info del producto */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{item.nombre}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.precio)} c/u
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>

              {/* Personalizaciones */}
              {item.personalizaciones && (
                <div className="space-y-1 mb-2">
                  {item.personalizaciones.salsas &&
                    item.personalizaciones.salsas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">
                          Salsas:
                        </span>
                        {item.personalizaciones.salsas.map((salsa) => (
                          <Badge
                            key={salsa}
                            variant="secondary"
                            className="text-xs"
                          >
                            {salsa}
                          </Badge>
                        ))}
                      </div>
                    )}
                  {item.personalizaciones.extras &&
                    item.personalizaciones.extras.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">
                          Extras:
                        </span>
                        {item.personalizaciones.extras.map((extra) => (
                          <Badge
                            key={extra}
                            variant="secondary"
                            className="text-xs"
                          >
                            {extra}
                          </Badge>
                        ))}
                      </div>
                    )}
                  {item.personalizaciones.presentacion && (
                    <div className="flex gap-1">
                      <span className="text-xs text-muted-foreground">
                        Presentación:
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {item.personalizaciones.presentacion}
                      </Badge>
                    </div>
                  )}
                  {item.personalizaciones.notas && (
                    <p className="text-xs text-muted-foreground italic">
                      Nota: {item.personalizaciones.notas}
                    </p>
                  )}
                </div>
              )}

              {/* Controles de cantidad */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateCantidad(index, Math.max(1, item.cantidad - 1))
                  }
                  disabled={item.cantidad <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.cantidad}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateCantidad(index, item.cantidad + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2">
              {onEditItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditItem(index)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
