/**
 * Botón de Pago con Clip
 * Old Texas BBQ - CRM
 *
 * Componente simple que abre el modal de pago al hacer clic
 * Controlado por feature flag - se activa viernes 31 enero 5pm
 */

'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ClipPaymentModal } from './ClipPaymentModal';
import { useClipPaymentsFlag } from '@/lib/hooks/useFeatureFlag';

interface ClipPaymentButtonProps extends Omit<ButtonProps, 'onClick'> {
  amount: number;
  description: string;
  orderId?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
  showInstallments?: boolean;
  buttonText?: string;
}

export function ClipPaymentButton({
  amount,
  description,
  orderId,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
  onPaymentError,
  showInstallments = false,
  buttonText,
  children,
  ...buttonProps
}: ClipPaymentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isEnabled: isClipEnabled } = useClipPaymentsFlag();

  const handleSuccess = (paymentId: string) => {
    setIsModalOpen(false);
    onPaymentSuccess?.(paymentId);
  };

  const handleError = (error: string) => {
    onPaymentError?.(error);
    // No cerramos el modal para permitir reintentar
  };

  // Si el feature flag no está activo, no mostrar nada
  if (!isClipEnabled) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} {...buttonProps}>
        {children || (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {buttonText || `Pagar $${amount.toLocaleString('es-MX')}`}
          </>
        )}
      </Button>

      <ClipPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={amount}
        description={description}
        orderId={orderId}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        onPaymentSuccess={handleSuccess}
        onPaymentError={handleError}
        showInstallments={showInstallments}
      />
    </>
  );
}
