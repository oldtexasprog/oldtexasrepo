'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Producto } from '@/lib/types/firestore';
import { productosService } from '@/lib/services/productos.service';
import { Plus, Minus, ShoppingCart, Search, Flame } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ItemCarritoPublico } from './FormularioPedidoPublicoMejorado';

interface CatalogoProductosMejoradoProps {
  onAgregarProducto: (producto: Producto, cantidad: number, notas?: string) => void;
  carrito: ItemCarritoPublico[];
}

interface ProductoConCantidad extends Producto {
  cantidadTemporal: number;
  notasTemporal: string;
}

export function CatalogoProductosMejorado({
  onAgregarProducto,
  carrito,
}: CatalogoProductosMejoradoProps) {
  const [productos, setProductos] = useState<ProductoConCantidad[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const productosDisponibles =
        await productosService.getDisponiblesOrdenadosPorMenu();

      // Agregar campos temporales
      const productosConCantidad = productosDisponibles.map(p => ({
        ...p,
        cantidadTemporal: 1,
        notasTemporal: '',
      }));

      setProductos(productosConCantidad);
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setCargando(false);
    }
  };

  // Obtener categorías únicas
  const categorias = Array.from(
    new Set(productos.map((p) => p.categoriaNombre))
  ).filter(Boolean).sort();

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const matchCategoria =
      !categoriaSeleccionada || producto.categoriaNombre === categoriaSeleccionada;
    const matchBusqueda =
      !busqueda ||
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    return matchCategoria && matchBusqueda;
  });

  const handleCambiarCantidad = (productoId: string, delta: number) => {
    setProductos(prev => prev.map(p => {
      if (p.id === productoId) {
        const nuevaCantidad = Math.max(1, p.cantidadTemporal + delta);
        return { ...p, cantidadTemporal: nuevaCantidad };
      }
      return p;
    }));
  };

  const handleCambiarNotas = (productoId: string, notas: string) => {
    setProductos(prev => prev.map(p =>
      p.id === productoId ? { ...p, notasTemporal: notas } : p
    ));
  };

  const handleAgregar = (producto: ProductoConCantidad) => {
    onAgregarProducto(
      producto,
      producto.cantidadTemporal,
      producto.notasTemporal || undefined
    );

    toast.success(
      `${producto.cantidadTemporal}x ${producto.nombre} agregado al carrito`,
      { duration: 2000 }
    );

    // Resetear valores temporales
    setProductos(prev => prev.map(p =>
      p.id === producto.id
        ? { ...p, cantidadTemporal: 1, notasTemporal: '' }
        : p
    ));
  };

  // Obtener cantidad en carrito de un producto
  const getCantidadEnCarrito = (productoId: string): number => {
    const item = carrito.find(i => i.productoId === productoId);
    return item?.cantidad || 0;
  };

  if (cargando) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoriaSeleccionada === null ? 'default' : 'outline'}
          onClick={() => setCategoriaSeleccionada(null)}
          className={cn(
            categoriaSeleccionada === null && 'bg-red-600 text-white hover:bg-red-700'
          )}
        >
          Todos
        </Button>
        {categorias.map((categoria) => (
          <Button
            key={categoria}
            variant={
              categoriaSeleccionada === categoria ? 'default' : 'outline'
            }
            onClick={() => setCategoriaSeleccionada(categoria)}
            className={cn(
              categoriaSeleccionada === categoria &&
              'bg-red-600 hover:bg-red-700'
            )}
          >
            {categoria}
          </Button>
        ))}
      </div>

      {/* Grid de productos */}
      {productosFiltrados.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">
            No se encontraron productos con esos criterios
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productosFiltrados.map((producto) => {
            const cantidadEnCarrito = getCantidadEnCarrito(producto.id);

            return (
              <Card
                key={producto.id}
                className={cn(
                  "overflow-hidden hover:shadow-xl transition-all duration-300",
                  cantidadEnCarrito > 0 && "ring-2 ring-green-500"
                )}
              >
                {/* Imagen del producto */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {producto.imagen ? (
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🍖
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {producto.enPromocion && (
                      <Badge className="bg-red-600 text-white">
                        <Flame className="h-3 w-3 mr-1" />
                        Promoción
                      </Badge>
                    )}
                    {cantidadEnCarrito > 0 && (
                      <Badge className="bg-green-600 text-white">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {cantidadEnCarrito} en carrito
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  {/* Nombre y descripción */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground line-clamp-1">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {producto.descripcion}
                    </p>
                  </div>

                  {/* Precio */}
                  <div>
                    {producto.enPromocion && producto.precioPromocion ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-red-600">
                          ${producto.precioPromocion.toFixed(2)}
                        </span>
                        <span className="text-sm text-foreground/70 line-through">
                          ${producto.precio.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-foreground">
                        ${producto.precio.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Cantidad:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCambiarCantidad(producto.id, -1)}
                        disabled={producto.cantidadTemporal <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-bold w-8 text-center">
                        {producto.cantidadTemporal}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCambiarCantidad(producto.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Campo de notas */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Notas especiales (opcional):
                    </label>
                    <Textarea
                      placeholder="Ej: Sin cebolla, extra salsa BBQ..."
                      value={producto.notasTemporal}
                      onChange={(e) => handleCambiarNotas(producto.id, e.target.value)}
                      className="resize-none h-16 text-sm"
                    />
                  </div>

                  {/* Botón agregar */}
                  <Button
                    onClick={() => handleAgregar(producto)}
                    className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Agregar al Carrito - $
                    {(producto.cantidadTemporal * (producto.enPromocion && producto.precioPromocion ? producto.precioPromocion : producto.precio)).toFixed(2)}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
