'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Personalizacion {
  salsas?: string[];
  extras?: string[];
  presentacion?: string;
  notas?: string;
}

interface PersonalizacionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productoNombre: string;
  personalizacion?: Personalizacion;
  onConfirm: (personalizacion: Personalizacion) => void;
}

// Catálogo de opciones de personalización
const SALSAS_DISPONIBLES = [
  'BBQ',
  'Picante',
  'Chipotle',
  'Ranch',
  'Habanero',
  'Miel Mostaza',
  'Ajo',
  'Sin salsa',
];

const EXTRAS_DISPONIBLES = [
  'Queso extra',
  'Tocino',
  'Cebolla caramelizada',
  'Jalapeños',
  'Aguacate',
  'Pepinillos',
  'Champiñones',
];

const PRESENTACIONES = [
  'Para llevar',
  'Para aquí',
  'En bolsa',
  'En caja',
];

export function PersonalizacionModal({
  open,
  onOpenChange,
  productoNombre,
  personalizacion,
  onConfirm,
}: PersonalizacionModalProps) {
  const [salsas, setSalsas] = useState<string[]>(personalizacion?.salsas || []);
  const [extras, setExtras] = useState<string[]>(personalizacion?.extras || []);
  const [presentacion, setPresentacion] = useState<string>(
    personalizacion?.presentacion || ''
  );
  const [notas, setNotas] = useState<string>(personalizacion?.notas || '');

  // Resetear cuando se abre el modal
  useEffect(() => {
    if (open) {
      setSalsas(personalizacion?.salsas || []);
      setExtras(personalizacion?.extras || []);
      setPresentacion(personalizacion?.presentacion || '');
      setNotas(personalizacion?.notas || '');
    }
  }, [open, personalizacion]);

  const handleToggleSalsa = (salsa: string) => {
    setSalsas((prev) =>
      prev.includes(salsa)
        ? prev.filter((s) => s !== salsa)
        : [...prev, salsa]
    );
  };

  const handleToggleExtra = (extra: string) => {
    setExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((e) => e !== extra)
        : [...prev, extra]
    );
  };

  const handleConfirm = () => {
    const personalizacion: any = {};

    // Solo agregar campos si tienen valor
    if (salsas.length > 0) {
      personalizacion.salsas = salsas;
    }

    if (extras.length > 0) {
      personalizacion.extras = extras;
    }

    if (presentacion) {
      personalizacion.presentacion = presentacion;
    }

    if (notas.trim()) {
      personalizacion.notas = notas.trim();
    }

    onConfirm(personalizacion);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizar Producto</DialogTitle>
          <DialogDescription>
            Personaliza <strong>{productoNombre}</strong> según las preferencias
            del cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Salsas */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Salsas</Label>
            <div className="grid grid-cols-2 gap-3">
              {SALSAS_DISPONIBLES.map((salsa) => (
                <div
                  key={salsa}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleToggleSalsa(salsa)}
                >
                  <Checkbox
                    id={`salsa-${salsa}`}
                    checked={salsas.includes(salsa)}
                    onCheckedChange={() => handleToggleSalsa(salsa)}
                  />
                  <Label
                    htmlFor={`salsa-${salsa}`}
                    className="cursor-pointer flex-1"
                  >
                    {salsa}
                  </Label>
                </div>
              ))}
            </div>
            {salsas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {salsas.map((salsa) => (
                  <Badge key={salsa} variant="secondary">
                    {salsa}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Extras */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Extras</Label>
            <div className="grid grid-cols-2 gap-3">
              {EXTRAS_DISPONIBLES.map((extra) => (
                <div
                  key={extra}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleToggleExtra(extra)}
                >
                  <Checkbox
                    id={`extra-${extra}`}
                    checked={extras.includes(extra)}
                    onCheckedChange={() => handleToggleExtra(extra)}
                  />
                  <Label
                    htmlFor={`extra-${extra}`}
                    className="cursor-pointer flex-1"
                  >
                    {extra}
                  </Label>
                </div>
              ))}
            </div>
            {extras.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {extras.map((extra) => (
                  <Badge key={extra} variant="secondary">
                    {extra}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Presentación */}
          <div className="space-y-3">
            <Label htmlFor="presentacion" className="text-base font-semibold">
              Presentación
            </Label>
            <Select value={presentacion} onValueChange={setPresentacion}>
              <SelectTrigger id="presentacion">
                <SelectValue placeholder="Selecciona una presentación" />
              </SelectTrigger>
              <SelectContent>
                {PRESENTACIONES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notas especiales */}
          <div className="space-y-3">
            <Label htmlFor="notas" className="text-base font-semibold">
              Notas Especiales
            </Label>
            <Textarea
              id="notas"
              placeholder="Ej: Sin cebolla, sin pepinillos, bien cocido..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Indica cualquier solicitud especial del cliente
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar Personalización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
