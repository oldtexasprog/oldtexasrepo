'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Colonia } from '@/lib/types/firestore';
import { coloniasService } from '@/lib/services/colonias.service';
import { Loader2 } from 'lucide-react';

interface SelectorColoniaPublicoProps {
  value: string;
  onChange: (coloniaId: string, colonia: Colonia) => void;
}

export function SelectorColoniaPublico({
  value,
  onChange,
}: SelectorColoniaPublicoProps) {
  const [colonias, setColonias] = useState<Colonia[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarColonias();
  }, []);

  const cargarColonias = async () => {
    try {
      setCargando(true);
      const coloniasActivas = await coloniasService.getAll({
        filters: [{ field: 'activa', operator: '==', value: true }],
        orderByField: 'nombre',
        orderDirection: 'asc',
      });
      setColonias(coloniasActivas);
    } catch (error) {
      console.error('Error cargando colonias:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-10 border rounded-md bg-gray-50">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">
          Cargando colonias...
        </span>
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(coloniaId) => {
        const colonia = colonias.find((c) => c.id === coloniaId);
        if (colonia) {
          onChange(coloniaId, colonia);
        }
      }}
    >
      <SelectTrigger className="mt-1">
        <SelectValue placeholder="Selecciona tu colonia" />
      </SelectTrigger>
      <SelectContent>
        {colonias.map((colonia) => (
          <SelectItem key={colonia.id} value={colonia.id}>
            {colonia.nombre} - ${colonia.costoEnvio.toFixed(2)} envío
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
