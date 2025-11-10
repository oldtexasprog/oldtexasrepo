'use client';

import { ClientePedido } from '@/lib/types/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, MapPin, Home, Info } from 'lucide-react';

interface ClienteFormProps {
  value: ClientePedido;
  onChange: (cliente: ClientePedido) => void;
}

export function ClienteForm({ value, onChange }: ClienteFormProps) {
  const handleChange = (field: keyof ClientePedido, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-6">
      {/* Nombre y Teléfono en grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Nombre del Cliente *
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Juan Pérez"
            value={value.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            required
            className="text-base"
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="telefono" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Teléfono *
          </Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="Ej: 8341234567"
            value={value.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            required
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            10 dígitos sin espacios ni guiones
          </p>
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="direccion" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Dirección de Entrega
        </Label>
        <Input
          id="direccion"
          placeholder="Ej: Calle Hidalgo #123, Col. Centro"
          value={value.direccion || ''}
          onChange={(e) => handleChange('direccion', e.target.value)}
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          Solo si es para entrega a domicilio
        </p>
      </div>

      {/* Colonia */}
      <div className="space-y-2">
        <Label htmlFor="colonia" className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Colonia
        </Label>
        <Input
          id="colonia"
          placeholder="Ej: Centro, Modelo, Industrial"
          value={value.colonia || ''}
          onChange={(e) => handleChange('colonia', e.target.value)}
          className="text-base"
        />
      </div>

      {/* Referencia */}
      <div className="space-y-2">
        <Label htmlFor="referencia" className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Referencias
        </Label>
        <Textarea
          id="referencia"
          placeholder="Ej: Casa de dos pisos, portón blanco, frente a la tienda..."
          value={value.referencia || ''}
          onChange={(e) => handleChange('referencia', e.target.value)}
          rows={3}
          className="text-base resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Ayuda al repartidor a encontrar más fácil la dirección
        </p>
      </div>

      {/* Indicador de campos requeridos */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-red-500">*</span>
        <span>Campos obligatorios</span>
      </div>
    </div>
  );
}
