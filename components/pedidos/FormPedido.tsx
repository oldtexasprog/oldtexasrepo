'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectorCanal } from './SelectorCanal';
import { ClienteForm } from './ClienteForm';
import { ProductoSelector } from './ProductoSelector';
import { CanalVenta, ClientePedido } from '@/lib/types/firestore';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FormPedido() {
  const router = useRouter();

  // Estados del formulario
  const [canal, setCanal] = useState<CanalVenta | null>(null);
  const [cliente, setCliente] = useState<ClientePedido>({
    nombre: '',
    telefono: '',
    direccion: '',
    colonia: '',
    referencia: '',
  });
  const [productos, setProductos] = useState<any[]>([]);

  const handleSubmit = async () => {
    // TODO: Implementar guardado del pedido
    console.log('Guardando pedido:', { canal, cliente, productos });
  };

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      {/* Selector de Canal */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">1. Canal de Venta</h2>
        <SelectorCanal value={canal} onChange={setCanal} />
      </Card>

      {/* Datos del Cliente */}
      {canal && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">2. Datos del Cliente</h2>
          <ClienteForm value={cliente} onChange={setCliente} />
        </Card>
      )}

      {/* Selección de Productos */}
      {canal && cliente.nombre && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">3. Productos</h2>
          <ProductoSelector value={productos} onChange={setProductos} />
        </Card>
      )}

      {/* Botones de acción */}
      {productos.length > 0 && (
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar Pedido
          </Button>
        </div>
      )}
    </div>
  );
}
