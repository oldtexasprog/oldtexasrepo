import { TableroComandas } from '@/components/cocina/TableroComandas';
import { ChefHat } from 'lucide-react';

export default function CocinaPage() {
  return (
    <div className="container mx-auto p-6 space-y-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ChefHat className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Cocina</h1>
            <p className="text-muted-foreground">
              Gestiona las comandas en tiempo real
            </p>
          </div>
        </div>

        {/* Indicador de tiempo real */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Actualizando en tiempo real
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="flex-1 overflow-hidden">
        <TableroComandas />
      </div>
    </div>
  );
}
