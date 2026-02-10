'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ItemCarritoPublico } from './FormularioPedidoPublicoMejorado';
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CarritoSidebarProps {
  items: ItemCarritoPublico[];
  subtotal: number;
  onActualizarCantidad: (productoId: string, nuevaCantidad: number) => void;
  onEliminarItem: (productoId: string) => void;
  onActualizarNotas: (productoId: string, notas: string) => void;
  onContinuar: () => void;
  cantidadProductos: number;
}

export function CarritoSidebar({
  items,
  subtotal,
  onActualizarCantidad,
  onEliminarItem,
  onActualizarNotas,
  onContinuar,
  cantidadProductos,
}: CarritoSidebarProps) {
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  const toggleExpandir = (productoId: string) => {
    setItemExpandido(prev => prev === productoId ? null : productoId);
  };

  return (
    <Card className="p-6 space-y-4 shadow-lg border-2">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2">
        <ShoppingCart className="h-6 w-6 text-red-600" />
        <h3 className="text-xl font-bold">Tu Carrito</h3>
        {cantidadProductos > 0 && (
          <Badge className="bg-red-600 text-white ml-auto">
            {cantidadProductos}
          </Badge>
        )}
      </div>

      <Separator className="my-2" />

      {/* Lista de items */}
      {items.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="text-6xl">🛒</div>
          <p className="text-lg font-medium text-gray-500">Tu carrito está vacío</p>
          <p className="text-sm text-gray-400">
            Agrega productos del menú para continuar
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {items.map((item) => {
            const isExpandido = itemExpandido === item.productoId;

            return (
              <Card
                key={item.productoId}
                className="p-3 space-y-2 hover:shadow-lg transition-all border hover:border-red-200"
              >
                {/* Item Principal */}
                <div className="flex gap-3">
                  {/* Imagen */}
                  {item.foto ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <Image
                        src={item.foto}
                        alt={item.nombre}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 text-3xl shadow-sm">
                      🍖
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {item.nombre}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ${item.precio.toFixed(2)} c/u
                    </p>

                    {/* Notas preview */}
                    {item.personalizaciones?.notas && !isExpandido && (
                      <p className="text-xs text-gray-500 italic line-clamp-1 mt-1">
                        {item.personalizaciones.notas}
                      </p>
                    )}
                  </div>

                  {/* Subtotal y eliminar */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEliminarItem(item.productoId)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-sm">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onActualizarCantidad(item.productoId, item.cantidad - 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.cantidad}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onActualizarCantidad(item.productoId, item.cantidad + 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Botón expandir/contraer */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpandir(item.productoId)}
                    className="text-xs gap-1"
                  >
                    {isExpandido ? 'Ocultar notas' : 'Editar notas'}
                    <ChevronRight className={cn(
                      "h-3 w-3 transition-transform",
                      isExpandido && "rotate-90"
                    )} />
                  </Button>
                </div>

                {/* Campo de notas expandido */}
                {isExpandido && (
                  <div className="space-y-1 pt-2 border-t">
                    <label className="text-xs font-medium text-gray-700">
                      Notas especiales:
                    </label>
                    <Textarea
                      placeholder="Ej: Sin cebolla, extra salsa..."
                      value={item.personalizaciones?.notas || ''}
                      onChange={(e) => onActualizarNotas(item.productoId, e.target.value)}
                      className="resize-none h-16 text-sm"
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Resumen y botón continuar */}
      {items.length > 0 && (
        <>
          <Separator className="my-4" />

          <div className="space-y-4 pt-2">
            {/* Subtotal */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-700 font-medium">Subtotal:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-gray-500 text-center px-2">
              💰 El costo de envío se calculará en el siguiente paso
            </p>

            {/* Botón continuar */}
            <Button
              onClick={onContinuar}
              className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              Continuar con el Pedido
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
