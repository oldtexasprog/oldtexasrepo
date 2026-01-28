/**
 * Botón para Crear Link de Pago con Clip
 * Old Texas BBQ - CRM
 *
 * Crea un link de pago que se puede compartir con el cliente
 * Controlado por feature flag - se activa viernes 31 enero 5pm
 */

'use client';

import { useState, useCallback } from 'react';
import { Link2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useClipPaymentsFlag } from '@/lib/hooks/useFeatureFlag';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClipPayment } from '@/lib/hooks/useClipPayment';
import { ClipPaymentLinkResponse } from '@/lib/clip/types';
import { toast } from 'sonner';

interface ClipPaymentLinkButtonProps extends Omit<ButtonProps, 'onClick'> {
  amount: number;
  description: string;
  orderId?: string;
  customerEmail?: string;
  expiresInHours?: number;
  onLinkCreated?: (link: ClipPaymentLinkResponse) => void;
  buttonText?: string;
}

export function ClipPaymentLinkButton({
  amount,
  description,
  orderId,
  customerEmail,
  expiresInHours = 24,
  onLinkCreated,
  buttonText,
  children,
  ...buttonProps
}: ClipPaymentLinkButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState<ClipPaymentLinkResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const { state, createPaymentLink } = useClipPayment();
  const { isEnabled: isClipEnabled } = useClipPaymentsFlag();

  // Si el feature flag no está activo, no mostrar el botón
  if (!isClipEnabled) {
    return null;
  }

  const handleCreateLink = useCallback(async () => {
    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const link = await createPaymentLink({
      amount,
      description,
      orderId,
      customerEmail,
      expiresAt: expiresAt.toISOString(),
      redirectUrl: window.location.origin + '/pago-confirmado',
    });

    if (link) {
      setPaymentLink(link);
      onLinkCreated?.(link);
    }
  }, [amount, description, orderId, customerEmail, expiresInHours, createPaymentLink, onLinkCreated]);

  const handleCopyLink = useCallback(async () => {
    if (!paymentLink) return;

    try {
      await navigator.clipboard.writeText(paymentLink.shortUrl || paymentLink.url);
      setCopied(true);
      toast.success('Link copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el link');
    }
  }, [paymentLink]);

  const handleOpenLink = useCallback(() => {
    if (!paymentLink) return;
    window.open(paymentLink.url, '_blank');
  }, [paymentLink]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setPaymentLink(null);
    setCopied(false);
  }, []);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} {...buttonProps}>
        {children || (
          <>
            <Link2 className="w-4 h-4 mr-2" />
            {buttonText || 'Crear Link de Pago'}
          </>
        )}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentLink ? 'Link de Pago Creado' : 'Crear Link de Pago'}
            </DialogTitle>
            <DialogDescription>
              {paymentLink
                ? 'Comparte este link con el cliente para que realice el pago.'
                : 'Se creará un link de pago que podrás compartir.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Resumen del pago */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Monto</span>
                <span className="font-semibold">
                  ${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Descripción</span>
                <span className="text-sm">{description}</span>
              </div>
              {orderId && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Pedido</span>
                  <span className="text-sm">#{orderId}</span>
                </div>
              )}
            </div>

            {/* Error */}
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {/* Link creado */}
            {paymentLink ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Link de Pago</Label>
                  <div className="flex gap-2">
                    <Input
                      value={paymentLink.shortUrl || paymentLink.url}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Expira: {new Date(paymentLink.expiresAt).toLocaleString('es-MX')}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cerrar
                  </Button>
                  <Button onClick={handleOpenLink} className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Link
                  </Button>
                </div>
              </div>
            ) : (
              /* Botón para crear */
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateLink}
                  disabled={state.isLoading}
                  className="flex-1"
                >
                  {state.isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 mr-2" />
                      Crear Link
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
