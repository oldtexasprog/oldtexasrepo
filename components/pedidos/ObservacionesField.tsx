'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ObservacionesFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export function ObservacionesField({
  value,
  onChange,
  maxLength = 500,
  placeholder = 'Ej: Cliente solicitó extra de salsas, entrega urgente, sin cebolla...',
}: ObservacionesFieldProps) {
  const caracteresRestantes = maxLength - value.length;
  const isNearLimit = caracteresRestantes < 50;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <Label htmlFor="observaciones" className="text-base font-semibold">
            Observaciones del Pedido
          </Label>
        </div>
        <Badge
          variant={isNearLimit ? 'destructive' : 'secondary'}
          className="text-xs"
        >
          {caracteresRestantes} caracteres
        </Badge>
      </div>

      <Card className="p-4">
        <Textarea
          id="observaciones"
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          rows={4}
          className="resize-none text-sm"
        />

        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              Usa este campo para registrar cualquier solicitud especial,
              restricciones alimentarias, o información importante sobre el
              pedido.
            </span>
          </p>

          {/* Sugerencias rápidas */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">
              Sugerencias rápidas:
            </span>
            {[
              'Sin cebolla',
              'Sin pepinillos',
              'Extra salsa',
              'Bien cocido',
              'Entrega urgente',
              'Tocar timbre',
            ].map((sugerencia) => (
              <Badge
                key={sugerencia}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-accent"
                onClick={() => {
                  const newValue = value
                    ? `${value}, ${sugerencia}`
                    : sugerencia;
                  if (newValue.length <= maxLength) {
                    onChange(newValue);
                  }
                }}
              >
                + {sugerencia}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
