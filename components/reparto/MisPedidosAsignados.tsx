'use client';

import { useReparto } from '@/lib/hooks/useReparto';
import { PedidoRepartoCard } from './PedidoRepartoCard';
import { Loader2, Inbox, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Pedido } from '@/lib/types/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils/formatters';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function MisPedidosAsignados() {
  const {
    misPedidos,
    loading,
    actionLoading,
    marcarComoEntregado,
    reportarIncidencia,
  } = useReparto();
  const [filtroEstado, setFiltroEstado] = useState<'en_reparto' | 'entregado' | 'todos'>('en_reparto');

  // Filtrar pedidos según el estado seleccionado
  const pedidosFiltrados = misPedidos.filter((pedido) => {
    if (filtroEstado === 'todos') return true;
    return pedido.estado === filtroEstado;
  });

  // Separar pedidos activos (en reparto) y entregados
  const pedidosEnReparto = misPedidos.filter((p) => p.estado === 'en_reparto');
  const pedidosEntregados = misPedidos.filter((p) => p.estado === 'entregado');

  // Calcular totales del día
  const totalPedidosHoy = misPedidos.length;
  const totalEntregado = pedidosEntregados.reduce(
    (sum, p) => sum + p.totales.total,
    0
  );
  const comisionTotal = pedidosEntregados.reduce(
    (sum, p) => sum + (p.reparto?.comisionRepartidor || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (misPedidos.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <Inbox className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">No tienes pedidos asignados</h3>
            <p className="text-muted-foreground">
              Acepta pedidos de la pestaña "Pedidos Listos" para comenzar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen del día */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pedidos</p>
              <p className="text-2xl font-bold">{totalPedidosHoy}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Entregado</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalEntregado)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Comisión Acumulada</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(comisionTotal)}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs para filtrar */}
      <Tabs value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en_reparto" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            En Reparto ({pedidosEnReparto.length})
          </TabsTrigger>
          <TabsTrigger value="entregado" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Entregados ({pedidosEntregados.length})
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            Todos ({totalPedidosHoy})
          </TabsTrigger>
        </TabsList>

        {/* Grid de pedidos */}
        <TabsContent value={filtroEstado} className="mt-6">
          {pedidosFiltrados.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                No hay pedidos en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidosFiltrados.map((pedido) => (
                <PedidoRepartoCard
                  key={pedido.id}
                  pedido={pedido}
                  mostrarBotonEntregado={pedido.estado === 'en_reparto'}
                  mostrarBotonIncidencia={pedido.estado === 'en_reparto'}
                  onMarcarEntregado={marcarComoEntregado}
                  onReportarIncidencia={reportarIncidencia}
                  loadingAction={actionLoading}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Historial de entregas del día */}
      {pedidosEntregados.length > 0 && filtroEstado === 'entregado' && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold text-lg mb-4">Historial de Entregas</h3>
          <div className="space-y-2">
            {pedidosEntregados.map((pedido) => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">Pedido #{pedido.numeroPedido}</p>
                  <p className="text-xs text-muted-foreground">
                    {pedido.horaEntrega
                      ? format(pedido.horaEntrega.toDate(), "HH:mm", { locale: es })
                      : '--:--'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(pedido.totales.total)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +{formatCurrency(pedido.reparto?.comisionRepartidor || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Importar íconos faltantes
import { DollarSign, Wallet } from 'lucide-react';
