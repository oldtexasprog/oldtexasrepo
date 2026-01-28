/**
 * Formulario de Tarjeta para Clip
 * Old Texas BBQ - CRM
 *
 * Componente para capturar datos de tarjeta de crédito/débito
 * Los datos son tokenizados antes de enviar al servidor
 */

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCard, Lock, Calendar, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ClipCardFormProps {
  amount: number;
  onSubmit: (cardToken: string, installments?: number) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  showInstallments?: boolean;
  className?: string;
}

interface CardFormData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  installments?: string;
}

export function ClipCardForm({
  amount,
  onSubmit,
  onCancel,
  isLoading = false,
  showInstallments = false,
  className,
}: ClipCardFormProps) {
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('unknown');
  const [isTokenizing, setIsTokenizing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: {
      installments: '1',
    },
  });

  // Formatear número de tarjeta
  const formatCardNumber = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  }, []);

  // Detectar tipo de tarjeta
  const detectCardType = useCallback((number: string) => {
    const cleanNumber = number.replace(/\D/g, '');

    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    return 'unknown';
  }, []);

  // Manejar cambio en número de tarjeta
  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCardNumber(e.target.value);
      setValue('cardNumber', formatted);
      setCardType(detectCardType(formatted));
    },
    [formatCardNumber, detectCardType, setValue]
  );

  // Tokenizar tarjeta (simulado - en producción usar Clip.js SDK)
  const tokenizeCard = async (data: CardFormData): Promise<string> => {
    // En producción, esto usaría el SDK de Clip para tokenización segura
    // Aquí simulamos el proceso para desarrollo

    const response = await fetch('/api/clip/tokenize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        cardHolderName: data.cardHolderName,
        expirationMonth: data.expirationMonth,
        expirationYear: data.expirationYear,
        cvv: data.cvv,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al tokenizar la tarjeta');
    }

    const result = await response.json();
    return result.token;
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data: CardFormData) => {
    try {
      setIsTokenizing(true);

      // Tokenizar la tarjeta
      const cardToken = await tokenizeCard(data);

      // Llamar al callback con el token
      const installments = data.installments && data.installments !== '1'
        ? parseInt(data.installments)
        : undefined;

      await onSubmit(cardToken, installments as 3 | 6 | 9 | 12 | undefined);
    } catch (error) {
      console.error('Error procesando tarjeta:', error);
    } finally {
      setIsTokenizing(false);
    }
  };

  // Generar años para el selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  // Meses para el selector
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const isSubmitting = isLoading || isTokenizing;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={cn('space-y-4', className)}
    >
      {/* Monto a pagar */}
      <div className="bg-muted p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">Total a pagar</p>
        <p className="text-2xl font-bold">
          ${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
        </p>
      </div>

      {/* Número de tarjeta */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">
          <CreditCard className="inline-block w-4 h-4 mr-1" />
          Número de tarjeta
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            {...register('cardNumber', {
              required: 'El número de tarjeta es requerido',
              pattern: {
                value: /^[\d\s]{13,19}$/,
                message: 'Número de tarjeta inválido',
              },
            })}
            onChange={handleCardNumberChange}
            disabled={isSubmitting}
            className="pr-12"
          />
          {cardType !== 'unknown' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                {cardType}
              </span>
            </div>
          )}
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
        )}
      </div>

      {/* Nombre del titular */}
      <div className="space-y-2">
        <Label htmlFor="cardHolderName">
          <User className="inline-block w-4 h-4 mr-1" />
          Nombre del titular
        </Label>
        <Input
          id="cardHolderName"
          placeholder="Como aparece en la tarjeta"
          {...register('cardHolderName', {
            required: 'El nombre del titular es requerido',
            minLength: {
              value: 3,
              message: 'El nombre debe tener al menos 3 caracteres',
            },
          })}
          disabled={isSubmitting}
        />
        {errors.cardHolderName && (
          <p className="text-sm text-destructive">{errors.cardHolderName.message}</p>
        )}
      </div>

      {/* Fecha de vencimiento y CVV */}
      <div className="grid grid-cols-3 gap-3">
        {/* Mes */}
        <div className="space-y-2">
          <Label>
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Mes
          </Label>
          <Select
            onValueChange={(value) => setValue('expirationMonth', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register('expirationMonth', {
              required: 'El mes es requerido',
            })}
          />
        </div>

        {/* Año */}
        <div className="space-y-2">
          <Label>Año</Label>
          <Select
            onValueChange={(value) => setValue('expirationYear', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="AAAA" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register('expirationYear', {
              required: 'El año es requerido',
            })}
          />
        </div>

        {/* CVV */}
        <div className="space-y-2">
          <Label htmlFor="cvv">
            <Lock className="inline-block w-4 h-4 mr-1" />
            CVV
          </Label>
          <Input
            id="cvv"
            type="password"
            placeholder="123"
            maxLength={4}
            {...register('cvv', {
              required: 'El CVV es requerido',
              pattern: {
                value: /^\d{3,4}$/,
                message: 'CVV inválido',
              },
            })}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {(errors.expirationMonth || errors.expirationYear || errors.cvv) && (
        <p className="text-sm text-destructive">
          {errors.expirationMonth?.message ||
            errors.expirationYear?.message ||
            errors.cvv?.message}
        </p>
      )}

      {/* Meses sin intereses */}
      {showInstallments && amount >= 300 && (
        <div className="space-y-2">
          <Label>Meses sin intereses</Label>
          <Select
            defaultValue="1"
            onValueChange={(value) => setValue('installments', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Pago único</SelectItem>
              {amount >= 900 && <SelectItem value="3">3 meses sin intereses</SelectItem>}
              {amount >= 1800 && <SelectItem value="6">6 meses sin intereses</SelectItem>}
              {amount >= 2700 && <SelectItem value="9">9 meses sin intereses</SelectItem>}
              {amount >= 3600 && <SelectItem value="12">12 meses sin intereses</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Pagar ${amount.toLocaleString('es-MX')}
            </>
          )}
        </Button>
      </div>

      {/* Mensaje de seguridad */}
      <p className="text-xs text-center text-muted-foreground">
        <Lock className="inline-block w-3 h-3 mr-1" />
        Pago seguro procesado por Clip. Tus datos están protegidos.
      </p>
    </form>
  );
}
