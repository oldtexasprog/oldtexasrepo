import { ListaPedidos } from '@/components/pedidos/ListaPedidos';

export default function PedidosPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">
            Gestiona y consulta todos los pedidos del sistema
          </p>
        </div>
      </div>

      <ListaPedidos />
    </div>
  );
}
