import { GestionColonias } from '@/components/colonias/GestionColonias';
import { MapPin } from 'lucide-react';

export default function ColoniasPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Colonias</h1>
            <p className="text-muted-foreground">
              Administra colonias con servicio a domicilio y sus costos
            </p>
          </div>
        </div>
      </div>

      <GestionColonias />
    </div>
  );
}
