import { GestionRepartidores } from '@/components/repartidores/GestionRepartidores';
import { Truck } from 'lucide-react';

export default function RepartidoresPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Repartidores</h1>
            <p className="text-muted-foreground">
              Administra repartidores, comisiones y disponibilidad
            </p>
          </div>
        </div>
      </div>

      <GestionRepartidores />
    </div>
  );
}
