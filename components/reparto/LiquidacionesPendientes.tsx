'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { pedidosService } from '@/lib/services/pedidos.service';
import { repartidoresService } from '@/lib/services/repartidores.service';
import { Pedido } from '@/lib/types/firestore';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  Wallet,
  Loader2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function LiquidacionesPendientes() {
  const { userData } = useAuth();
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLiquidar, setLoadingLiquidar] = useState(false);

  // Cargar pedidos pendientes de liquidar
  useEffect(() => {
    if (!userData?.id) return;

    const loadPedidos = async () => {
      try {
        setLoading(true);
        // Si es repartidor, buscar por su ID de usuario
        // Si es cajera o admin, buscar todos los pendientes
        let pedidos: Pedido[] = [];

        if (userData.rol === 'repartidor') {
          // Buscar el ID del repartidor asociado a este usuario
          const repartidores = await repartidoresService.search([
            { field: 'usuarioId', operator: '==', value: userData.id }
          ]);

          if (repartidores.length > 0) {
            const repartidor = repartidores[0];
            pedidos = await pedidosService.getPendientesLiquidar(repartidor.id);
          }
        } else {
          // Cajera o admin: mostrar todos los pendientes
          pedidos = await pedidosService.search([
            { field: 'reparto.liquidado', operator: '==', value: false },
            { field: 'estado', operator: '==', value: 'entregado' },
          ]);
        }

        setPedidosPendientes(pedidos);
      } catch (error) {
        console.error('Error cargando pedidos pendientes:', error);
        toast.error('Error al cargar pedidos pendientes');
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();
  }, [userData]);

  // Toggle selección de pedido
  const togglePedido = (pedidoId: string) => {
    setPedidosSeleccionados((prev) =>
      prev.includes(pedidoId)
        ? prev.filter((id) => id !== pedidoId)
        : [...prev, pedidoId]
    );
  };

  // Seleccionar todos
  const toggleTodos = () => {
    if (pedidosSeleccionados.length === pedidosPendientes.length) {
      setPedidosSeleccionados([]);
    } else {
      setPedidosSeleccionados(pedidosPendientes.map((p) => p.id));
    }
  };

  // Calcular totales de los pedidos seleccionados
  const calcularTotales = () => {
    const seleccionados = pedidosPendientes.filter((p) =>
      pedidosSeleccionados.includes(p.id)
    );

    const totalPedidos = seleccionados.reduce(
      (acc, p) => acc + p.totales.total,
      0
    );
    const totalComisiones = seleccionados.reduce(
      (acc, p) => acc + (p.reparto?.comisionRepartidor || 0),
      0
    );
    const totalAEntregar = totalPedidos - totalComisiones;

    return { totalPedidos, totalComisiones, totalAEntregar };
  };

  // Liquidar pedidos seleccionados
  const handleLiquidar = async () => {
    if (pedidosSeleccionados.length === 0) {
      toast.warning('Selecciona al menos un pedido para liquidar');
      return;
    }

    if (!userData?.id) {
      toast.error('Usuario no autenticado');
      return;
    }

    try {
      setLoadingLiquidar(true);

      // Liquidar los pedidos en batch
      await pedidosService.liquidarPedidos(pedidosSeleccionados, userData.id);

      // Si hay un repartidor específico, actualizar su saldo
      const pedidosALiquidar = pedidosPendientes.filter((p) =>
        pedidosSeleccionados.includes(p.id)
      );

      // Obtener el repartidor del primer pedido (asumiendo que todos son del mismo)
      if (pedidosALiquidar.length > 0 && pedidosALiquidar[0].reparto?.repartidorId) {
        const repartidorId = pedidosALiquidar[0].reparto.repartidorId;
        await repartidoresService.liquidarSaldo(repartidorId);
      }

      toast.success(
        `✅ ${pedidosSeleccionados.length} pedido(s) liquidado(s) exitosamente`
      );

      // Limpiar selección y recargar
      setPedidosSeleccionados([]);
      setPedidosPendientes((prev) =>
        prev.filter((p) => !pedidosSeleccionados.includes(p.id))
      );
    } catch (error) {
      console.error('Error liquidando pedidos:', error);
      toast.error('Error al liquidar pedidos');
    } finally {
      setLoadingLiquidar(false);
    }
  };

  const totales = calcularTotales();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pedidosPendientes.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No hay pedidos pendientes de liquidar
          </h3>
          <p className="text-muted-foreground">
            Todos los pedidos entregados han sido liquidados
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen superior */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pedidos</p>
              <p className="text-2xl font-bold">{pedidosPendientes.length}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto Total</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  pedidosPendientes.reduce((acc, p) => acc + p.totales.total, 0)
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Comisiones Totales</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(
                  pedidosPendientes.reduce(
                    (acc, p) => acc + (p.reparto?.comisionRepartidor || 0),
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Controles de selección */}
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={
              pedidosSeleccionados.length === pedidosPendientes.length &&
              pedidosPendientes.length > 0
            }
            onCheckedChange={toggleTodos}
          />
          <span className="text-sm font-medium">
            {pedidosSeleccionados.length > 0
              ? `${pedidosSeleccionados.length} seleccionado(s)`
              : 'Seleccionar todos'}
          </span>
        </div>

        {pedidosSeleccionados.length > 0 && (
          <Button
            onClick={handleLiquidar}
            disabled={loadingLiquidar}
            className="bg-green-600 hover:bg-green-700"
          >
            {loadingLiquidar ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Liquidando...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Liquidar {pedidosSeleccionados.length} pedido(s)
              </>
            )}
          </Button>
        )}
      </div>

      {/* Resumen de selección */}
      {pedidosSeleccionados.length > 0 && (
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Resumen de Liquidación
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-green-700 dark:text-green-300">Total Pedidos</p>
              <p className="font-bold text-lg text-green-900 dark:text-green-100">
                {formatCurrency(totales.totalPedidos)}
              </p>
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300">Comisiones</p>
              <p className="font-bold text-lg text-orange-600">
                - {formatCurrency(totales.totalComisiones)}
              </p>
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300">A Entregar</p>
              <p className="font-bold text-lg text-green-900 dark:text-green-100">
                {formatCurrency(totales.totalAEntregar)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidosPendientes.map((pedido) => {
          const isSeleccionado = pedidosSeleccionados.includes(pedido.id);
          const comision = pedido.reparto?.comisionRepartidor || 0;
          const aEntregar = pedido.totales.total - comision;

          return (
            <Card
              key={pedido.id}
              className={`p-4 cursor-pointer transition-all ${
                isSeleccionado
                  ? 'border-primary border-2 bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => togglePedido(pedido.id)}
            >
              <div className="space-y-3">
                {/* Header con checkbox */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSeleccionado}
                      onCheckedChange={() => togglePedido(pedido.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <h3 className="font-bold">Pedido #{pedido.numeroPedido}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(pedido.horaEntrega?.toDate() || new Date(), 'dd/MM/yyyy HH:mm', {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Repartidor */}
                <div className="bg-muted p-2 rounded text-sm">
                  <p className="text-xs text-muted-foreground">Repartidor</p>
                  <p className="font-medium">{pedido.reparto?.repartidorNombre}</p>
                </div>

                {/* Desglose */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total pedido:</span>
                    <span className="font-semibold">
                      {formatCurrency(pedido.totales.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-orange-600">
                    <span>Comisión:</span>
                    <span className="font-semibold">
                      - {formatCurrency(comision)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 font-bold text-base">
                    <span>A entregar:</span>
                    <span className="text-green-600">
                      {formatCurrency(aEntregar)}
                    </span>
                  </div>
                </div>

                {/* Método de pago */}
                <Badge variant="outline" className="capitalize">
                  {pedido.pago.metodo}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
