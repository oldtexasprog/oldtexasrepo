/**
 * Modal de Pago con Clip
 * Old Texas BBQ - CRM
 *
 * Modal que contiene el formulario de tarjeta y maneja el flujo de pago completo
 */

'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipCardForm } from './ClipCardForm';
import { useClipPayment } from '@/lib/hooks/useClipPayment';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClipPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  orderId?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
  showInstallments?: boolean;
}

type PaymentStep = 'form' | 'processing' | 'success' | 'error' | '3ds';

export function ClipPaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  orderId,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
  onPaymentError,
  showInstallments = false,
}: ClipPaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('form');
  const { state, processPayment, reset } = useClipPayment();

  const handleSubmit = useCallback(
    async (cardToken: string, installments?: number) => {
      setStep('processing');

      const payment = await processPayment({
        amount,
        cardToken,
        description,
        orderId,
        customerEmail,
        customerPhone,
        installments: installments as 3 | 6 | 9 | 12 | undefined,
        use3ds: true,
        returnUrl: window.location.href,
      });

      if (!payment) {
        setStep('error');
        onPaymentError?.(state.error || 'Error procesando el pago');
        return;
      }

      if (payment.requires3ds) {
        setStep('3ds');
        // La redirección a 3DS se maneja en el hook
        return;
      }

      if (payment.status === 'approved') {
        setStep('success');
        onPaymentSuccess?.(payment.id);
      } else {
        setStep('error');
        onPaymentError?.(payment.errorMessage || 'Pago rechazado');
      }
    },
    [
      amount,
      description,
      orderId,
      customerEmail,
      customerPhone,
      processPayment,
      onPaymentSuccess,
      onPaymentError,
      state.error,
    ]
  );

  const handleClose = useCallback(() => {
    if (step === 'processing' || step === '3ds') {
      // No permitir cerrar durante el procesamiento
      return;
    }
    reset();
    setStep('form');
    onClose();
  }, [step, reset, onClose]);

  const handleRetry = useCallback(() => {
    reset();
    setStep('form');
  }, [reset]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' && 'Pago con Tarjeta'}
            {step === 'processing' && 'Procesando Pago'}
            {step === '3ds' && 'Autenticación Requerida'}
            {step === 'success' && 'Pago Exitoso'}
            {step === 'error' && 'Error en el Pago'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' && `Pago seguro para: ${description}`}
            {step === 'processing' && 'Por favor espera mientras procesamos tu pago...'}
            {step === '3ds' && 'Serás redirigido para autenticar tu tarjeta...'}
            {step === 'success' && 'Tu pago ha sido procesado correctamente.'}
            {step === 'error' && 'Hubo un problema con tu pago.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Formulario de tarjeta */}
          {step === 'form' && (
            <ClipCardForm
              amount={amount}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              isLoading={state.isLoading}
              showInstallments={showInstallments}
            />
          )}

          {/* Procesando */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Procesando tu pago...</p>
              <p className="text-sm text-muted-foreground mt-2">
                No cierres esta ventana
              </p>
            </div>
          )}

          {/* Autenticación 3DS */}
          {step === '3ds' && (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <p className="text-center mb-4">
                Tu banco requiere autenticación adicional.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Serás redirigido a la página de tu banco para completar la verificación.
              </p>
            </div>
          )}

          {/* Pago exitoso */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-lg font-semibold text-green-600 mb-2">
                Pago Aprobado
              </p>
              <p className="text-muted-foreground text-center mb-4">
                El pago de ${amount.toLocaleString('es-MX')} MXN ha sido procesado correctamente.
              </p>
              {state.paymentResult && (
                <div className="bg-muted p-3 rounded-lg text-sm w-full">
                  <p>
                    <span className="text-muted-foreground">Autorización:</span>{' '}
                    {state.paymentResult.authorizationCode || 'N/A'}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tarjeta:</span>{' '}
                    **** {state.paymentResult.lastFourDigits}
                  </p>
                </div>
              )}
              <Button onClick={handleClose} className="mt-4 w-full">
                Cerrar
              </Button>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="w-16 h-16 text-destructive mb-4" />
              <p className="text-lg font-semibold text-destructive mb-2">
                Pago Rechazado
              </p>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {state.error || 'No pudimos procesar tu pago. Por favor intenta de nuevo.'}
                </AlertDescription>
              </Alert>
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleRetry} className="flex-1">
                  Intentar de nuevo
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
