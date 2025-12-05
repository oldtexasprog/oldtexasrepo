'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Colonia } from '@/lib/types/firestore';
import { coloniasService } from '@/lib/services/colonias.service';
import { MapPin, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface SelectorColoniaProps {
  value?: string; // ID de la colonia seleccionada
  onChange: (coloniaId: string, colonia: Colonia) => void;
  error?: string;
}

export function SelectorColonia({
  value,
  onChange,
  error,
}: SelectorColoniaProps) {
  const [colonias, setColonias] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [coloniaSeleccionada, setColoniaSeleccionada] = useState<Colonia | null>(
    null
  );

  useEffect(() => {
    cargarColonias();
  }, []);

  useEffect(() => {
    if (value && colonias.length > 0) {
      const colonia = colonias.find((c) => c.id === value);
      setColoniaSeleccionada(colonia || null);
    }
  }, [value, colonias]);

  const cargarColonias = async () => {
    try {
      setLoading(true);
      const data = await coloniasService.getActivas();
      setColonias(data);
    } catch (error) {
      console.error('Error cargando colonias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (coloniaId: string) => {
    const colonia = colonias.find((c) => c.id === coloniaId);
    if (colonia) {
      setColoniaSeleccionada(colonia);
      onChange(coloniaId, colonia);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Colonia *
      </Label>

      <Select value={value} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger
          className={error ? 'border-red-500' : ''}
        >
          <SelectValue
            placeholder={
              loading
                ? 'Cargando colonias...'
                : 'Selecciona una colonia'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {colonias.length === 0 && !loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium mb-1">No hay colonias disponibles</p>
              <p className="text-xs">
                Contacta al administrador para agregar colonias
              </p>
            </div>
          )}

          {colonias.map((colonia) => (
            <SelectItem key={colonia.id} value={colonia.id}>
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{colonia.nombre}</span>
                <span className="text-xs text-muted-foreground ml-4">
                  {formatCurrency(colonia.costoEnvio)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mostrar información de la colonia seleccionada */}
      {coloniaSeleccionada && (
        <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg text-sm shadow-sm">
          <DollarSign className="h-4 w-4 text-primary" />
          <div>
            <span className="text-foreground/80">Costo de envío: </span>
            <span className="font-bold text-primary">
              {formatCurrency(coloniaSeleccionada.costoEnvio)}
            </span>
            {coloniaSeleccionada.zona && (
              <span className="text-xs text-foreground/70 ml-2">
                • Zona: {coloniaSeleccionada.zona}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Mensaje informativo si no hay colonias */}
      {colonias.length === 0 && !loading && !error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">
                No hay colonias configuradas
              </p>
              <p className="text-yellow-700 text-xs">
                No se pueden tomar pedidos sin colonias disponibles. Contacta al
                administrador para configurar las colonias con servicio.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
