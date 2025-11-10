'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { FormPedido } from '@/components/pedidos/FormPedido';

function NuevoPedidoContent() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Nuevo Pedido</h1>
          <p className="text-muted-foreground">
            Captura un nuevo pedido del cliente
          </p>
        </div>

        {/* Formulario de pedido */}
        <FormPedido />
      </div>
    </div>
  );
}

export default function NuevoPedidoPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'cajera', 'encargado']}>
      <NuevoPedidoContent />
    </ProtectedRoute>
  );
}
