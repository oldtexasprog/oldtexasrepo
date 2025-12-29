'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ItemCarritoPublico } from './FormularioPedidoPublico';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface CarritoPedidoPublicoProps {
  items: ItemCarritoPublico[];
  onUpdateItem: (items: ItemCarritoPublico[]) => void;
  subtotal: number;
  onContinuar: () => void;
}

export function CarritoPedidoPublico({
  items,
  onUpdateItem,
  subtotal,
  onContinuar,
}: CarritoPedidoPublicoProps) {
  const handleUpdateCantidad = (index: number, cantidad: number) => {
    if (cantidad < 1) return;

    const nuevosItems = items.map((item, i) =>
      i === index
        ? {
            ...item,
            cantidad,
            subtotal: item.precio * cantidad,
          }
        : item
    );

    onUpdateItem(nuevosItems);
  };

  const handleEliminar = (index: number) => {
    const nuevosItems = items.filter((_, i) => i !== index);
    onUpdateItem(nuevosItems);
  };

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Tu carrito está vacío
        </h3>
        <p className="text-gray-500">
          Agrega productos del catálogo para continuar
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de productos */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex gap-4">
              {/* Imagen */}
              <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.foto ? (
                  <Image
                    src={item.foto}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    🍖
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {item.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  ${item.precio.toFixed(2)} c/u
                </p>

                {/* Personalizaciones */}
                {item.personalizaciones && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    {item.personalizaciones.salsas &&
                      item.personalizaciones.salsas.length > 0 && (
                        <p>
                          Salsas: {item.personalizaciones.salsas.join(', ')}
                        </p>
                      )}
                    {item.personalizaciones.presentacion && (
                      <p>
                        Presentación: {item.personalizaciones.presentacion}
                      </p>
                    )}
                    {item.personalizaciones.extras &&
                      item.personalizaciones.extras.length > 0 && (
                        <p>
                          Extras: {item.personalizaciones.extras.join(', ')}
                        </p>
                      )}
                    {item.personalizaciones.notas && (
                      <p className="italic">
                        Notas: {item.personalizaciones.notas}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Controles */}
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEliminar(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleUpdateCantidad(index, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <Input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => {
                      const cantidad = parseInt(e.target.value) || 1;
                      handleUpdateCantidad(index, cantidad);
                    }}
                    className="w-16 h-8 text-center"
                    min={1}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleUpdateCantidad(index, item.cantidad + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <p className="font-bold text-lg text-gray-900">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resumen */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Productos ({items.length})</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span className="text-red-600">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            El costo de envío se calculará en el siguiente paso según tu
            colonia
          </p>

          <Button
            onClick={onContinuar}
            className="w-full gap-2 bg-red-600 hover:bg-red-700 h-12 text-lg"
            size="lg"
          >
            Continuar
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
