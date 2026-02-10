'use client';

import { useState, useMemo } from 'react';
import { CatalogoProductosMejorado } from './CatalogoProductosMejorado';
import { CarritoSidebar } from './CarritoSidebar';
import { DatosClientePublico } from './DatosClientePublico';
import { ConfirmacionPedido } from './ConfirmacionPedido';
import { Button } from '@/components/ui/button';
import { Producto } from '@/lib/types/firestore';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ItemCarritoPublico {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  foto?: string;
  personalizaciones?: {
    salsas?: string[];
    presentacion?: string;
    extras?: string[];
    notas?: string;
  };
  subtotal: number;
}

export interface DatosClienteForm {
  nombre: string;
  telefono: string;
  direccion: string;
  colonia: string;
  coloniaId: string;
  referencia: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'tarjeta_linea' | null;
  montoPagado: number;
}

type PasoFormulario = 'catalogo' | 'datos' | 'confirmacion';

export function FormularioPedidoPublicoMejorado() {
  const [paso, setPaso] = useState<PasoFormulario>('catalogo');
  const [carrito, setCarrito] = useState<ItemCarritoPublico[]>([]);
  const [datosCliente, setDatosCliente] = useState<DatosClienteForm>({
    nombre: '',
    telefono: '',
    direccion: '',
    colonia: '',
    coloniaId: '',
    referencia: '',
    metodoPago: null,
    montoPagado: 0,
  });
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [numeroPedido, setNumeroPedido] = useState<number | null>(null);

  // Cálculos
  const cantidadProductos = useMemo(() => {
    return carrito.reduce((sum, item) => sum + item.cantidad, 0);
  }, [carrito]);

  const subtotal = useMemo(() => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }, [carrito]);

  const total = useMemo(() => {
    return subtotal + costoEnvio;
  }, [subtotal, costoEnvio]);

  const cambio = useMemo(() => {
    if (
      datosCliente.metodoPago === 'efectivo' &&
      datosCliente.montoPagado > total
    ) {
      return datosCliente.montoPagado - total;
    }
    return 0;
  }, [datosCliente.metodoPago, datosCliente.montoPagado, total]);

  // Handlers
  const handleAgregarProducto = (producto: Producto, cantidad: number, notas?: string) => {
    // Usar precio promocional si está disponible
    const precioFinal = producto.enPromocion && producto.precioPromocion
      ? producto.precioPromocion
      : producto.precio;

    setCarrito((prev) => {
      const existente = prev.find((item) => item.productoId === producto.id);

      if (existente) {
        return prev.map((item) =>
          item.productoId === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: item.precio * (item.cantidad + cantidad),
                personalizaciones: notas
                  ? { ...item.personalizaciones, notas }
                  : item.personalizaciones,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: precioFinal,
          cantidad,
          foto: producto.imagen,
          subtotal: precioFinal * cantidad,
          personalizaciones: notas ? { notas } : undefined,
        },
      ];
    });
  };

  const handleActualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setCarrito((prev) => prev.filter((item) => item.productoId !== productoId));
    } else {
      setCarrito((prev) =>
        prev.map((item) =>
          item.productoId === productoId
            ? {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: item.precio * nuevaCantidad,
              }
            : item
        )
      );
    }
  };

  const handleEliminarItem = (productoId: string) => {
    setCarrito((prev) => prev.filter((item) => item.productoId !== productoId));
  };

  const handleActualizarNotas = (productoId: string, notas: string) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.productoId === productoId
          ? {
              ...item,
              personalizaciones: {
                ...item.personalizaciones,
                notas,
              },
            }
          : item
      )
    );
  };

  const handleContinuarADatos = () => {
    if (carrito.length > 0) {
      setPaso('datos');
    }
  };

  const handleFinalizarPedido = (pedidoId: string, numeroPedido: number) => {
    setPedidoId(pedidoId);
    setNumeroPedido(numeroPedido);
    setPaso('confirmacion');
  };

  const handleNuevoPedido = () => {
    setCarrito([]);
    setDatosCliente({
      nombre: '',
      telefono: '',
      direccion: '',
      colonia: '',
      coloniaId: '',
      referencia: '',
      metodoPago: null,
      montoPagado: 0,
    });
    setCostoEnvio(0);
    setPedidoId(null);
    setNumeroPedido(null);
    setPaso('catalogo');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Contenido según el paso */}
      <div className="relative">
        {/* Paso 1: Catálogo con Carrito Visible */}
        {paso === 'catalogo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Catálogo - Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  🍖 Nuestro Menú
                </h2>
                {/* Botón móvil para ver carrito */}
                <Button
                  onClick={() => document.getElementById('carrito-mobile')?.scrollIntoView({ behavior: 'smooth' })}
                  className="lg:hidden gap-2 bg-red-600 text-white hover:bg-red-700"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ver Carrito ({cantidadProductos})
                </Button>
              </div>

              <CatalogoProductosMejorado
                onAgregarProducto={handleAgregarProducto}
                carrito={carrito}
              />

              {/* Carrito Mobile (Al final del catálogo) */}
              <div id="carrito-mobile" className="lg:hidden">
                <CarritoSidebar
                  items={carrito}
                  subtotal={subtotal}
                  onActualizarCantidad={handleActualizarCantidad}
                  onEliminarItem={handleEliminarItem}
                  onActualizarNotas={handleActualizarNotas}
                  onContinuar={handleContinuarADatos}
                  cantidadProductos={cantidadProductos}
                />
              </div>
            </div>

            {/* Carrito - Sidebar Flotante (Desktop) */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-6">
                <CarritoSidebar
                  items={carrito}
                  subtotal={subtotal}
                  onActualizarCantidad={handleActualizarCantidad}
                  onEliminarItem={handleEliminarItem}
                  onActualizarNotas={handleActualizarNotas}
                  onContinuar={handleContinuarADatos}
                  cantidadProductos={cantidadProductos}
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Datos del Cliente */}
        {paso === 'datos' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setPaso('catalogo')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Menú
              </Button>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Completa tu Pedido
              </h2>
            </div>

            <DatosClientePublico
              datosCliente={datosCliente}
              onDatosChange={setDatosCliente}
              carrito={carrito}
              subtotal={subtotal}
              costoEnvio={costoEnvio}
              onCostoEnvioChange={setCostoEnvio}
              total={total}
              cambio={cambio}
              onFinalizarPedido={handleFinalizarPedido}
            />
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {paso === 'confirmacion' && pedidoId && numeroPedido && (
          <ConfirmacionPedido
            pedidoId={pedidoId}
            numeroPedido={numeroPedido}
            total={total}
            onNuevoPedido={handleNuevoPedido}
          />
        )}
      </div>
    </div>
  );
}
