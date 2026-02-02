'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipPaymentModal } from '@/components/payments/ClipPaymentModal';
import { ClipPaymentButton } from '@/components/payments/ClipPaymentButton';
import { ClipPaymentLinkButton } from '@/components/payments/ClipPaymentLinkButton';
import { CLIP_TEST_CARDS } from '@/lib/clip/config';
import { CreditCard, Link2, TestTube, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function TestClipPage() {
  const [amount, setAmount] = useState(100);
  const [description, setDescription] = useState('Pedido de prueba Old Texas BBQ');
  const [showModal, setShowModal] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const handlePaymentSuccess = (paymentId: string) => {
    setLastPaymentId(paymentId);
    setLastError(null);
    toast.success(`Pago exitoso: ${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    setLastError(error);
    setLastPaymentId(null);
    toast.error(`Error: ${error}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <TestTube className="h-8 w-8 text-primary" />
            Pruebas de Pago - Clip
          </h1>
          <p className="text-muted-foreground mt-2">
            Ambiente: <span className="font-semibold text-yellow-600">Sandbox</span>
          </p>
        </div>

        {/* Resultado del último pago */}
        {(lastPaymentId || lastError) && (
          <Card className={`p-4 ${lastPaymentId ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}`}>
            <div className="flex items-center gap-3">
              {lastPaymentId ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">Último pago exitoso</p>
                    <p className="text-sm text-green-600 dark:text-green-500">ID: {lastPaymentId}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-400">Último pago fallido</p>
                    <p className="text-sm text-red-600 dark:text-red-500">{lastError}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configuración de prueba */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Configuración de Prueba
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Monto (MXN)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => setShowModal(true)}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Abrir Modal de Pago
                </Button>

                <ClipPaymentButton
                  amount={amount}
                  description={description}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  className="w-full"
                />

                <ClipPaymentLinkButton
                  amount={amount}
                  description={description}
                  onLinkCreated={(link) => toast.success(`Link creado: ${link.id}`)}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Tarjetas de prueba */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Tarjetas de Prueba
            </h2>

            <div className="space-y-4">
              {/* Visa Aprobada */}
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Visa - Aprobada
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número:</span>
                    <button
                      onClick={() => copyToClipboard(CLIP_TEST_CARDS.visa_approved.number)}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      {CLIP_TEST_CARDS.visa_approved.number}
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CVV:</span>
                    <span>{CLIP_TEST_CARDS.visa_approved.cvv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exp:</span>
                    <span>{CLIP_TEST_CARDS.visa_approved.expMonth}/{CLIP_TEST_CARDS.visa_approved.expYear}</span>
                  </div>
                </div>
              </div>

              {/* Mastercard Aprobada */}
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Mastercard - Aprobada
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número:</span>
                    <button
                      onClick={() => copyToClipboard(CLIP_TEST_CARDS.mastercard_approved.number)}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      {CLIP_TEST_CARDS.mastercard_approved.number}
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CVV:</span>
                    <span>{CLIP_TEST_CARDS.mastercard_approved.cvv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exp:</span>
                    <span>{CLIP_TEST_CARDS.mastercard_approved.expMonth}/{CLIP_TEST_CARDS.mastercard_approved.expYear}</span>
                  </div>
                </div>
              </div>

              {/* Visa Rechazada */}
              <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Visa - Rechazada
                  </span>
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número:</span>
                    <button
                      onClick={() => copyToClipboard(CLIP_TEST_CARDS.visa_declined.number)}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      {CLIP_TEST_CARDS.visa_declined.number}
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CVV:</span>
                    <span>{CLIP_TEST_CARDS.visa_declined.cvv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exp:</span>
                    <span>{CLIP_TEST_CARDS.visa_declined.expMonth}/{CLIP_TEST_CARDS.visa_declined.expYear}</span>
                  </div>
                </div>
              </div>

              {/* Fondos insuficientes */}
              <div className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    Fondos Insuficientes
                  </span>
                  <XCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número:</span>
                    <button
                      onClick={() => copyToClipboard(CLIP_TEST_CARDS.insufficient_funds.number)}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      {CLIP_TEST_CARDS.insufficient_funds.number}
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CVV:</span>
                    <span>{CLIP_TEST_CARDS.insufficient_funds.cvv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exp:</span>
                    <span>{CLIP_TEST_CARDS.insufficient_funds.expMonth}/{CLIP_TEST_CARDS.insufficient_funds.expYear}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Información del Ambiente</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">API URL:</p>
              <p className="font-mono text-xs">https://api-sandbox.clip.mx/v1</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ambiente:</p>
              <p className="font-semibold text-yellow-600">Sandbox (Pruebas)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monto mínimo:</p>
              <p>$10.00 MXN</p>
            </div>
            <div>
              <p className="text-muted-foreground">MSI disponibles:</p>
              <p>3, 6, 9, 12 meses</p>
            </div>
          </div>
        </Card>

        {/* Link de regreso */}
        <div className="text-center">
          <a
            href="/"
            className="text-primary hover:underline"
          >
            Volver al inicio
          </a>
        </div>
      </div>

      {/* Modal de pago */}
      <ClipPaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        amount={amount}
        description={description}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        showInstallments={true}
      />
    </div>
  );
}
