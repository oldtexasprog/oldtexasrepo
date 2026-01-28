/**
 * Hook para manejar pagos con Clip
 * Old Texas BBQ - CRM
 */

'use client';

import { useState, useCallback } from 'react';
import {
  ClipPaymentResponse,
  ClipPaymentState,
  ClipPaymentLinkResponse,
  CLIP_ERROR_MESSAGES,
  CLIP_ERROR_CODES,
} from '@/lib/clip/types';

interface UseClipPaymentReturn {
  state: ClipPaymentState;
  processPayment: (params: ProcessPaymentParams) => Promise<ClipPaymentResponse | null>;
  createPaymentLink: (params: CreatePaymentLinkParams) => Promise<ClipPaymentLinkResponse | null>;
  reset: () => void;
}

interface ProcessPaymentParams {
  amount: number;
  cardToken: string;
  description: string;
  orderId?: string;
  customerEmail?: string;
  customerPhone?: string;
  use3ds?: boolean;
  returnUrl?: string;
  installments?: 3 | 6 | 9 | 12;
}

interface CreatePaymentLinkParams {
  amount: number;
  description: string;
  orderId?: string;
  customerEmail?: string;
  expiresAt?: string;
  redirectUrl?: string;
}

const initialState: ClipPaymentState = {
  isLoading: false,
  isProcessing: false,
  error: null,
  paymentResult: null,
  requires3ds: false,
  redirectUrl: null,
};

export function useClipPayment(): UseClipPaymentReturn {
  const [state, setState] = useState<ClipPaymentState>(initialState);

  /**
   * Procesa un pago con tarjeta
   */
  const processPayment = useCallback(
    async (params: ProcessPaymentParams): Promise<ClipPaymentResponse | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isProcessing: true,
        error: null,
      }));

      try {
        const response = await fetch('/api/clip/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage =
            CLIP_ERROR_MESSAGES[data.code] || data.error || 'Error procesando el pago';

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

  /**
   * Crea un link de pago
   */
  const createPaymentLink = useCallback(
    async (params: CreatePaymentLinkParams): Promise<ClipPaymentLinkResponse | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch('/api/clip/payment-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || 'Error creando link de pago';

          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));

          return null;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        return data.paymentLink as ClipPaymentLinkResponse;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error de conexión';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return null;
      }
    },
    []
  );

  /**
   * Reinicia el estado
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    processPayment,
    createPaymentLink,
    reset,
  };
}

/**
 * Hook para verificar el estado de un pago después de 3DS
 */
export function useClipPaymentStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState<ClipPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPaymentStatus = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clip/payment?id=${paymentId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error verificando pago');
        return null;
      }

      setPayment(data.payment);
      return data.payment as ClipPaymentResponse;
    } catch (err) {
      setError('Error de conexión');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    payment,
    error,
    checkPaymentStatus,
  };
}
