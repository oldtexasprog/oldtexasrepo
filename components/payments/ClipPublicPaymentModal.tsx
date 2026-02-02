/**
 * Modal de Pago Público con Clip
 * Para uso en el formulario público /pedir
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
import { useClipPublicPayment } from '@/lib/hooks/useClipPublicPayment';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClipPublicPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  customerPhone?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
  showInstallments?: boolean;
}

type PaymentStep = 'form' | 'processing' | 'success' | 'error' | '3ds';

export function ClipPublicPaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  customerPhone,
  onPaymentSuccess,
  onPaymentError,
  showInstallments = false,
}: ClipPublicPaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('form');
  const { state, processPayment, reset } = useClipPublicPayment();

  const handleSubmit = useCallback(
    async (cardToken: string, installments?: number) => {
      setStep('processing');

      const payment = await processPayment({
        amount,
        cardToken,
        description,
        customerPhone,
        installments: installments as 3 | 6 | 9 | 12 | undefined,
      });

      if (!payment) {
        setStep('error');
        onPaymentError?.(state.error || 'Error procesando el pago');
        return;
      }

      if (payment.requires3ds) {
        setStep('3ds');
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
      customerPhone,
      processPayment,
      onPaymentSuccess,
      onPaymentError,
      state.error,
    ]
  );

  const handleClose = useCallback(() => {
    if (step === 'processing' || step === '3ds') {
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
          <DialogTitle className="flex items-center gap-2">
            {step === 'form' && (
              <>
                <Shield className="h-5 w-5 text-green-600" />
                Pago Seguro
              </>
            )}
            {step === 'processing' && 'Procesando Pago'}
            {step === '3ds' && 'Autenticación Requerida'}
            {step === 'success' && 'Pago Exitoso'}
            {step === 'error' && 'Error en el Pago'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' && (
              <span className="flex items-center gap-2">
                Total a pagar: <strong className="text-foreground">${amount.toFixed(2)} MXN</strong>
              </span>
            )}
            {step === 'processing' && 'Por favor espera mientras procesamos tu pago...'}
            {step === '3ds' && 'Serás redirigido para autenticar tu tarjeta...'}
            {step === 'success' && 'Tu pago ha sido procesado correctamente.'}
            {step === 'error' && 'Hubo un problema con tu pago.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Formulario de tarjeta */}
          {step === 'form' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-green-700 dark:text-green-400">
                    Tus datos están protegidos con encriptación de nivel bancario
                  </p>
                </div>
              </div>

              <ClipCardForm
                amount={amount}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={state.isLoading}
                showInstallments={showInstallments}
              />
            </div>
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
                Continuar
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
