'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TipoDescuento, DescuentoPedido } from '@/lib/types/firestore';
import { Percent, DollarSign, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';

interface DescuentoSelectorProps {
  subtotal: number;
  descuento: DescuentoPedido | null;
  onChange: (descuento: DescuentoPedido | null) => void;
}

export function DescuentoSelector({
  subtotal,
  descuento,
  onChange,
}: DescuentoSelectorProps) {
  const [tipoDescuento, setTipoDescuento] = useState<TipoDescuento>('porcentaje');
  const [valorDescuento, setValorDescuento] = useState<string>('');

  // Actualizar estado local cuando cambia el descuento externo
  useEffect(() => {
    if (descuento) {
      setTipoDescuento(descuento.tipo);
      setValorDescuento(descuento.valor.toString());
    } else {
      setValorDescuento('');
    }
  }, [descuento]);

  const calcularMontoDescuento = (tipo: TipoDescuento, valor: number): number => {
    if (tipo === 'porcentaje') {
      // Porcentaje del subtotal
      return (subtotal * valor) / 100;
    } else {
      // Monto fijo
      return Math.min(valor, subtotal); // No puede ser mayor que el subtotal
    }
  };

  const handleValorChange = (valor: string) => {
    setValorDescuento(valor);

    const numero = parseFloat(valor);
    if (isNaN(numero) || numero <= 0) {
      onChange(null);
      return;
    }

    // Validar rangos
    if (tipoDescuento === 'porcentaje' && numero > 100) {
      return; // No permitir más de 100%
    }

    if (tipoDescuento === 'monto_fijo' && numero > subtotal) {
      return; // No permitir descuento mayor que el subtotal
    }

    const montoDescuento = calcularMontoDescuento(tipoDescuento, numero);

    onChange({
      tipo: tipoDescuento,
      valor: numero,
      monto: montoDescuento,
    });
  };

  const handleTipoChange = (tipo: TipoDescuento) => {
    setTipoDescuento(tipo);

    const numero = parseFloat(valorDescuento);
    if (isNaN(numero) || numero <= 0) {
      onChange(null);
      return;
    }

    const montoDescuento = calcularMontoDescuento(tipo, numero);

    onChange({
      tipo,
      valor: numero,
      monto: montoDescuento,
    });
  };

  const limpiarDescuento = () => {
    setValorDescuento('');
    onChange(null);
  };

  const montoDescuento = descuento?.monto || 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Percent className="h-4 w-4" />
          Descuento (Opcional)
        </Label>
        {descuento && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={limpiarDescuento}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Quitar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Selector de tipo */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Tipo</Label>
          <Select value={tipoDescuento} onValueChange={handleTipoChange}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="porcentaje">
                <div className="flex items-center gap-2">
                  <Percent className="h-3 w-3" />
                  Porcentaje
                </div>
              </SelectItem>
              <SelectItem value="monto_fijo">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  Monto Fijo
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input de valor */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Valor</Label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max={tipoDescuento === 'porcentaje' ? 100 : subtotal}
              step={tipoDescuento === 'porcentaje' ? 1 : 0.01}
              value={valorDescuento}
              onChange={(e) => handleValorChange(e.target.value)}
              placeholder={tipoDescuento === 'porcentaje' ? '0-100' : '0.00'}
              className="pr-8"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {tipoDescuento === 'porcentaje' ? '%' : '$'}
            </div>
          </div>
        </div>
      </div>

      {/* Vista previa del descuento */}
      {descuento && montoDescuento > 0 && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800 font-medium">
              Descuento aplicado:
            </span>
          </div>
          <span className="text-sm font-bold text-green-700">
            -{formatCurrency(montoDescuento)}
          </span>
        </div>
      )}

      {/* Ayuda contextual */}
      <p className="text-xs text-muted-foreground">
        {tipoDescuento === 'porcentaje'
          ? 'Ingresa un porcentaje entre 0 y 100'
          : `Ingresa un monto entre $0 y ${formatCurrency(subtotal)}`}
      </p>
    </div>
  );
}
