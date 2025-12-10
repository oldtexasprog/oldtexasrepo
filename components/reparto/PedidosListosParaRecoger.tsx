'use client';

import { useReparto } from '@/lib/hooks/useReparto';
import { PedidoRepartoCard } from './PedidoRepartoCard';
import { Loader2, Package } from 'lucide-react';

export function PedidosListosParaRecoger() {
  const { pedidosListos, loading, actionLoading, aceptarPedido } = useReparto();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando pedidos listos...</p>
        </div>
      </div>
    );
  }

  if (pedidosListos.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">No hay pedidos listos</h3>
            <p className="text-muted-foreground">
              Cuando haya pedidos listos para recoger aparecerán aquí
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con contador */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Pedidos Disponibles</h2>
          </div>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
            {pedidosListos.length}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Estos pedidos están listos y esperan ser recogidos
        </p>
      </div>

      {/* Grid de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidosListos.map((pedido) => (
          <PedidoRepartoCard
            key={pedido.id}
            pedido={pedido}
            mostrarBotonAceptar
            onAceptar={aceptarPedido}
            loadingAction={actionLoading}
          />
        ))}
      </div>
    </div>
  );
}
