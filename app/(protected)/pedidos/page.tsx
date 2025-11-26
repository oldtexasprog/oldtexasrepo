import { ListaPedidos } from '@/components/pedidos/ListaPedidos';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

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
        <Link href="/pedidos/nuevo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Pedido
          </Button>
        </Link>
      </div>

      <ListaPedidos />
    </div>
  );
}
