'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectorCanal } from './SelectorCanal';
import { ClienteForm } from './ClienteForm';
import { ProductoSelector } from './ProductoSelector';
import { CarritoProductos, ItemCarrito } from './CarritoProductos';
import { PersonalizacionModal } from './PersonalizacionModal';
import { MetodoPagoSelector } from './MetodoPagoSelector';
import { RepartidorAsignador } from './RepartidorAsignador';
import { ObservacionesField } from './ObservacionesField';
import { ResumenTotales } from './ResumenTotales';
import { SelectorColonia } from './SelectorColonia';
import {
  CanalVenta,
  ClientePedido,
  MetodoPago,
  NuevoPedido,
  ItemPedido,
} from '@/lib/types/firestore';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';
import { pedidosService } from '@/lib/services/pedidos.service';
import { notificacionesService } from '@/lib/services/notificaciones.service';
import { useAuth } from '@/lib/auth/useAuth';
import { useClientesSugeridos } from '@/lib/hooks/useClientesSugeridos';
import { useTurnoActual } from '@/lib/hooks/useTurnoActual';

export function FormPedido() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const { guardarCliente } = useClientesSugeridos();
  const { turno } = useTurnoActual();

  // Estados del formulario
  const [canal, setCanal] = useState<CanalVenta | null>(null);
  const [cliente, setCliente] = useState<ClientePedido>({
    nombre: '',
    telefono: '',
    direccion: '',
    colonia: '',
    referencia: '',
  });
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [coloniaId, setColoniaId] = useState<string>('');
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [montoPagado, setMontoPagado] = useState(0);
  const [repartidorId, setRepartidorId] = useState<string | null>(null);
  const [repartidorNombre, setRepartidorNombre] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Modal de personalización
  const [personalizacionModal, setPersonalizacionModal] = useState({
    open: false,
    itemIndex: -1,
    productoNombre: '',
  });

  // Cálculos automáticos
  const subtotal = useMemo(() => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }, [carrito]);

  const total = useMemo(() => {
    return subtotal + costoEnvio;
  }, [subtotal, costoEnvio]);

  const cambio = useMemo(() => {
    if (metodoPago === 'efectivo' && montoPagado > total) {
      return montoPagado - total;
    }
    return 0;
  }, [metodoPago, montoPagado, total]);

  const cantidadProductos = useMemo(() => {
    return carrito.reduce((sum, item) => sum + item.cantidad, 0);
  }, [carrito]);

  // Handlers del carrito
  const handleUpdateCantidad = (index: number, cantidad: number) => {
    setCarrito((prev) => {
      const newCarrito = [...prev];
      newCarrito[index] = {
        ...newCarrito[index],
        cantidad,
        subtotal: newCarrito[index].precio * cantidad,
      };
      return newCarrito;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
    toast.success('Producto eliminado del carrito');
  };

  const handleEditItem = (index: number) => {
    setPersonalizacionModal({
      open: true,
      itemIndex: index,
      productoNombre: carrito[index].nombre,
    });
  };

  const handlePersonalizacionConfirm = (personalizacion: any) => {
    if (personalizacionModal.itemIndex >= 0) {
      setCarrito((prev) => {
        const newCarrito = [...prev];
        newCarrito[personalizacionModal.itemIndex] = {
          ...newCarrito[personalizacionModal.itemIndex],
          personalizaciones: personalizacion,
        };
        return newCarrito;
      });
      toast.success('Personalización guardada');
    }
  };

  // Validaciones
  const puedeGuardar = useMemo(() => {
    // Validaciones básicas
    const validacionesBasicas =
      canal &&
      cliente.nombre &&
      cliente.telefono &&
      coloniaId && // Nueva validación de colonia
      carrito.length > 0 &&
      metodoPago;

    if (!validacionesBasicas) return false;

    // Si es efectivo, validar que el monto pagado sea suficiente
    if (metodoPago === 'efectivo') {
      return montoPagado >= total;
    }

    // Para tarjeta y transferencia, no se requiere monto pagado
    return true;
  }, [canal, cliente, coloniaId, carrito, metodoPago, montoPagado, total]);

  const handleSubmit = async () => {
    if (!puedeGuardar) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!user || !userData) {
      toast.error('Debes estar autenticado para crear pedidos');
      return;
    }

    try {
      setGuardando(true);

      // Si el método no es efectivo, asignar el total como monto pagado
      const montoPagadoFinal =
        metodoPago === 'efectivo' ? montoPagado : total;
      const cambioFinal =
        metodoPago === 'efectivo' && montoPagado > total
          ? montoPagado - total
          : 0;

      const ahora = Timestamp.now();

      // Validar que haya un turno abierto
      if (!turno) {
        toast.error('No hay un turno abierto. Solicita al encargado que abra un turno.');
        return;
      }

      // Preparar datos del pedido
      const pedidoData: Omit<NuevoPedido, 'numeroPedido'> = {
        canal: canal!,
        cliente,
        estado: 'pendiente',
        totales: {
          subtotal,
          envio: costoEnvio,
          descuento: 0,
          total,
        },
        pago: {
          metodo: metodoPago!,
          requiereCambio: metodoPago === 'efectivo' && cambioFinal > 0,
          montoRecibido: montoPagadoFinal,
          cambio: cambioFinal,
          pagoAdelantado: false,
        },
        observaciones,
        horaRecepcion: ahora,
        creadoPor: user.uid,
        turnoId: turno.id,
        cancelado: false,
      };

      // Si hay repartidor asignado, agregar datos de reparto
      if (repartidorId && repartidorNombre) {
        pedidoData.reparto = {
          repartidorId,
          repartidorNombre,
          comisionRepartidor: 0,
          estadoReparto: 'asignado',
          horaAsignacion: ahora,
          liquidado: false,
        };
      }

      // Preparar items del pedido
      const items: Omit<ItemPedido, 'id'>[] = carrito.map((item) => {
        const itemPedido: any = {
          productoId: item.productoId,
          productoNombre: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.subtotal,
        };

        // Solo agregar personalizaciones si existen y tienen contenido
        if (item.personalizaciones) {
          const personalizaciones: any = {};

          if (
            item.personalizaciones.salsas &&
            item.personalizaciones.salsas.length > 0
          ) {
            personalizaciones.salsa = item.personalizaciones.salsas;
          }

          if (item.personalizaciones.presentacion) {
            personalizaciones.presentacion =
              item.personalizaciones.presentacion;
          }

          if (
            item.personalizaciones.extras &&
            item.personalizaciones.extras.length > 0
          ) {
            personalizaciones.extras = item.personalizaciones.extras;
          }

          // Solo agregar el objeto personalizaciones si tiene al menos un campo
          if (Object.keys(personalizaciones).length > 0) {
            itemPedido.personalizaciones = personalizaciones;
          }
        }

        // Solo agregar notas si existe
        if (item.personalizaciones?.notas) {
          itemPedido.notas = item.personalizaciones.notas;
        }

        return itemPedido;
      });

      // Guardar pedido en Firestore
      const pedidoId = await pedidosService.crearPedidoCompleto(
        pedidoData,
        items
      );

      console.log('Pedido creado exitosamente:', pedidoId);

      // Guardar cliente en localStorage para futuras referencias
      guardarCliente(cliente);

      // Enviar notificación a cocina
      try {
        await notificacionesService.crearParaRol(
          'cocina',
          'nuevo_pedido',
          '🔥 Nuevo Pedido',
          `Pedido #${pedidoId.slice(-8)} - ${cantidadProductos} producto(s) - ${canal}`,
          'alta',
          pedidoId
        );
      } catch (notifError) {
        console.error('Error enviando notificación a cocina:', notifError);
        // No bloquear el flujo si falla la notificación
      }

      toast.success(`Pedido #${pedidoId.slice(-6)} creado exitosamente`, {
        duration: 5000,
        action: {
          label: 'Imprimir Ticket',
          onClick: async () => {
            // Obtener el pedido completo con items
            const pedidoCompleto = await pedidosService.getById(pedidoId);
            const itemsPedido = await pedidosService.getItems(pedidoId);

            if (pedidoCompleto && itemsPedido) {
              const { imprimirTicket } = await import('@/lib/utils/ticket');
              imprimirTicket({
                pedido: pedidoCompleto,
                items: itemsPedido,
                nombreNegocio: 'Old Texas BBQ',
                direccionNegocio: 'Piedras Negras, Coahuila',
                telefonoNegocio: '878-XXX-XXXX',
              });
            }
          },
        },
      });

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error guardando pedido:', error);
      toast.error(error?.message || 'Error al guardar el pedido');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <Button variant="outline" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal - Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Selector de Canal */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">1. Canal de Venta</h2>
            <SelectorCanal value={canal} onChange={setCanal} />
          </Card>

          {/* 2. Selección de Productos */}
          {canal && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">2. Productos</h2>
              <ProductoSelector
                value={carrito}
                onChange={(productos) => {
                  // Los productos ya vienen en formato ItemCarrito[] desde ProductoSelector
                  setCarrito(productos);
                }}
              />
            </Card>
          )}

          {/* 3. Carrito de Productos */}
          {carrito.length > 0 && (
            <>
              <CarritoProductos
                items={carrito}
                onUpdateCantidad={handleUpdateCantidad}
                onRemoveItem={handleRemoveItem}
                onEditItem={handleEditItem}
              />

              {/* 4. Datos del Cliente */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">3. Datos del Cliente</h2>
                <ClienteForm value={cliente} onChange={setCliente} />
              </Card>

              {/* 5. Colonia y Costo de Envío */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">4. Colonia y Envío</h2>
                <SelectorColonia
                  value={coloniaId}
                  onChange={(id, colonia) => {
                    setColoniaId(id);
                    setCostoEnvio(colonia.costoEnvio);
                    // Actualizar el nombre de la colonia en los datos del cliente
                    setCliente((prev) => ({
                      ...prev,
                      colonia: colonia.nombre,
                    }));
                  }}
                  error={cliente.nombre && !coloniaId ? 'Selecciona una colonia' : undefined}
                />
              </Card>

              {/* 6. Método de Pago */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">5. Total y Método de Pago</h2>
                <MetodoPagoSelector
                  metodoPago={metodoPago}
                  onMetodoPagoChange={setMetodoPago}
                  total={total}
                  montoPagado={montoPagado}
                  onMontoPagadoChange={setMontoPagado}
                />
              </Card>

              {/* 7. Asignar Repartidor */}
              {costoEnvio > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">6. Repartidor</h2>
                  <RepartidorAsignador
                    repartidorId={repartidorId}
                    onRepartidorChange={(id, nombre) => {
                      setRepartidorId(id);
                      setRepartidorNombre(nombre || null);
                    }}
                  />
                </Card>
              )}

              {/* 8. Observaciones */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">7. Observaciones</h2>
                <ObservacionesField
                  value={observaciones}
                  onChange={setObservaciones}
                />
              </Card>
            </>
          )}
        </div>

        {/* Columna lateral - Resumen */}
        {carrito.length > 0 && (
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <ResumenTotales
                subtotal={subtotal}
                costoEnvio={costoEnvio}
                total={total}
                cantidadProductos={cantidadProductos}
                metodoPago={metodoPago || undefined}
                cambio={cambio}
              />

              {/* Botones de acción */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!puedeGuardar || guardando}
                    className="w-full gap-2 h-12 text-lg"
                    size="lg"
                  >
                    {guardando ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Guardar Pedido
                      </>
                    )}
                  </Button>
                  {!puedeGuardar && (
                    <p className="text-xs text-destructive text-center">
                      {!canal
                        ? 'Selecciona un canal de venta'
                        : !cliente.nombre || !cliente.telefono
                          ? 'Completa los datos del cliente'
                          : carrito.length === 0
                            ? 'Agrega productos al carrito'
                            : !metodoPago
                              ? 'Selecciona un método de pago'
                              : metodoPago === 'efectivo' && montoPagado < total
                                ? `Ingresa el monto pagado (mínimo ${total.toFixed(2)})`
                                : 'Completa todos los campos'}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={guardando}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Personalización */}
      <PersonalizacionModal
        open={personalizacionModal.open}
        onOpenChange={(open) =>
          setPersonalizacionModal((prev) => ({ ...prev, open }))
        }
        productoNombre={personalizacionModal.productoNombre}
        personalizacion={
          personalizacionModal.itemIndex >= 0
            ? carrito[personalizacionModal.itemIndex]?.personalizaciones
            : undefined
        }
        onConfirm={handlePersonalizacionConfirm}
      />
    </div>
  );
}
