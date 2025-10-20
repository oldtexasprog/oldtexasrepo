'use client';

import { useOrders, useUpdateOrderStatus } from '@/lib/hooks/useOrders';
import type { EstadoPedido } from '@/lib/types';

export function OrderList() {
  // Hook de TanStack Query - maneja loading, error, data automáticamente
  const {
    data: orders,
    isLoading,
    error,
  } = useOrders({
    estado: 'recibido',
    limit: 20,
  });

  // Mutation para actualizar estado
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatusChange = (id: string, newStatus: EstadoPedido) => {
    updateStatus({ id, newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error al cargar pedidos: {error.message}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay pedidos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Pedidos Recibidos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                #{order.id}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  order.estado_pedido === 'recibido'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {order.estado_pedido}
              </span>
            </div>

            <h3 className="mb-1 font-semibold">{order.cliente.nombre}</h3>
            <p className="mb-2 text-sm text-gray-600">
              {order.items.length} item(s) - ${order.totales.total}
            </p>

            <button
              onClick={() => handleStatusChange(order.id, 'en_preparacion')}
              disabled={isPending}
              className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? 'Actualizando...' : 'Iniciar Preparación'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
