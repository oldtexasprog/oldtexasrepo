/**
 * Hook para manejar pagos públicos con Clip
 * Usado en el formulario público /pedir
 */

'use client';

import { useState, useCallback } from 'react';
import {
  ClipPaymentResponse,
  ClipPaymentState,
  CLIP_ERROR_MESSAGES,
} from '@/lib/clip/types';

interface UseClipPublicPaymentReturn {
  state: ClipPaymentState;
  processPayment: (params: ProcessPublicPaymentParams) => Promise<ClipPaymentResponse | null>;
  reset: () => void;
}

interface ProcessPublicPaymentParams {
  amount: number;
  cardToken: string;
  description: string;
  customerPhone?: string;
  installments?: 3 | 6 | 9 | 12;
}

const initialState: ClipPaymentState = {
  isLoading: false,
  isProcessing: false,
  error: null,
  paymentResult: null,
  requires3ds: false,
  redirectUrl: null,
};

export function useClipPublicPayment(): UseClipPublicPaymentReturn {
  const [state, setState] = useState<ClipPaymentState>(initialState);

  const processPayment = useCallback(
    async (params: ProcessPublicPaymentParams): Promise<ClipPaymentResponse | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isProcessing: true,
        error: null,
      }));

      try {
        const response = await fetch('/api/clip/public-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...params,
            use3ds: true,
            returnUrl: window.location.href,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage =
            CLIP_ERROR_MESSAGES[data.code as keyof typeof CLIP_ERROR_MESSAGES] ||
            data.error ||
            'Error procesando el pago';

          setState((prev) => ({
            ...prev,
            isLoading: false,
            isProcessing: false,
            error: errorMessage,
          }));

          return null;
        }

        const payment = data.payment as ClipPaymentResponse;

        // Verificar si requiere 3DS
        if (payment.requires3ds && payment.redirectUrl) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isProcessing: true,
            requires3ds: true,
            redirectUrl: payment.redirectUrl!,
            paymentResult: payment,
          }));

          // Redirigir a 3DS
          window.location.href = payment.redirectUrl;
          return payment;
        }

        // Pago completado
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isProcessing: false,
          paymentResult: payment,
          error: payment.status === 'declined' ? payment.errorMessage || 'Pago rechazado' : null,
        }));

        return payment;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error de conexión';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isProcessing: false,
          error: errorMessage,
        }));

        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    processPayment,
    reset,
  };
}
