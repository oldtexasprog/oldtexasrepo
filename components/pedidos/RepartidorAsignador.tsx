'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bike, User, Loader2 } from 'lucide-react';
import { repartidoresService } from '@/lib/services';
import type { Repartidor } from '@/lib/types/firestore';

interface RepartidorAsignadorProps {
  repartidorId: string | null;
  onRepartidorChange: (repartidorId: string | null) => void;
  required?: boolean;
}

export function RepartidorAsignador({
  repartidorId,
  onRepartidorChange,
  required = false,
}: RepartidorAsignadorProps) {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRepartidores();
  }, []);

  const loadRepartidores = async () => {
    try {
      setLoading(true);
      const data = await repartidoresService.getActivos();
      setRepartidores(data);
    } catch (error) {
      console.error('Error cargando repartidores:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIniciales = (nombre: string) => {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando repartidores...</span>
        </div>
      </Card>
    );
  }

  if (repartidores.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <Bike className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg mb-1">No hay repartidores disponibles</p>
          <p className="text-sm">
            Agrega repartidores desde el panel de administración
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bike className="h-5 w-5 text-primary" />
        <Label className="text-base font-semibold">
          Asignar Repartidor {required && <span className="text-destructive">*</span>}
        </Label>
      </div>

      <RadioGroup
        value={repartidorId || 'sin-asignar'}
        onValueChange={(value) =>
          onRepartidorChange(value === 'sin-asignar' ? null : value)
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Opción: Sin asignar (opcional) */}
          {!required && (
            <Card
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                !repartidorId
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onRepartidorChange(null)}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="sin-asignar" id="sin-asignar" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <Label
                      htmlFor="sin-asignar"
                      className="font-semibold cursor-pointer"
                    >
                      Sin asignar
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Asignar más tarde
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Lista de repartidores */}
          {repartidores.map((repartidor) => {
            const isSelected = repartidorId === repartidor.id;

            return (
              <Card
                key={repartidor.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onRepartidorChange(repartidor.id)}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={repartidor.id}
                    id={repartidor.id}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getIniciales(repartidor.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label
                      htmlFor={repartidor.id}
                      className="font-semibold cursor-pointer block"
                    >
                      {repartidor.nombre}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          repartidor.disponible ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {repartidor.disponible ? 'Disponible' : 'Ocupado'}
                      </Badge>
                      {repartidor.telefono && (
                        <span className="text-xs text-muted-foreground">
                          {repartidor.telefono}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </RadioGroup>

      {/* Información adicional */}
      <Card className="p-4 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Puedes cambiar el repartidor asignado en
          cualquier momento desde la vista de pedidos.
        </p>
      </Card>
    </div>
  );
}
