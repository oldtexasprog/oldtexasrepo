# Integración con Clip - Sistema de Pagos

## Old Texas BBQ - CRM

---

## Contenido

1. [Introducción](#introducción)
2. [Configuración](#configuración)
3. [Arquitectura](#arquitectura)
4. [Uso de Componentes](#uso-de-componentes)
5. [API Endpoints](#api-endpoints)
6. [Webhooks](#webhooks)
7. [Seguridad](#seguridad)
8. [Testing](#testing)
9. [Producción](#producción)
10. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Esta integración permite procesar pagos con tarjeta de crédito/débito usando el gateway de pagos **Clip**.

### Funcionalidades

- Pago directo con tarjeta (Checkout Transparente)
- Links de pago compartibles (Checkout Redireccionado)
- Meses sin intereses (3, 6, 9, 12 MSI)
- Autenticación 3D Secure
- Reembolsos parciales y totales
- Webhooks para notificaciones
- Soporte para Sandbox y Producción

### Métodos de Pago Soportados

- Visa
- Mastercard
- American Express

---

## Configuración

### 1. Obtener Credenciales de Clip

1. Regístrate en [developer.clip.mx](https://developer.clip.mx)
2. Crea una aplicación en el Dashboard
3. Obtén las credenciales:
   - **API Key**
   - **Secret Key**
   - **Public Key** (para tokenización frontend)
   - **Webhook Secret** (para validar webhooks)

### 2. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Clip Payment Gateway
CLIP_API_KEY=your_api_key_here
CLIP_SECRET_KEY=your_secret_key_here
CLIP_ENVIRONMENT=sandbox  # o 'production'
CLIP_WEBHOOK_SECRET=your_webhook_secret_here

# Public key para el frontend
NEXT_PUBLIC_CLIP_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_CLIP_ENVIRONMENT=sandbox
```

### 3. Variables de Producción

Para producción, usa variables separadas:

```env
# Producción
CLIP_API_KEY=prod_api_key
CLIP_SECRET_KEY=prod_secret_key
CLIP_ENVIRONMENT=production
CLIP_WEBHOOK_SECRET=prod_webhook_secret

NEXT_PUBLIC_CLIP_PUBLIC_KEY=prod_public_key
NEXT_PUBLIC_CLIP_ENVIRONMENT=production
```

---

## Arquitectura

### Estructura de Archivos

```
lib/clip/
├── types.ts          # Tipos TypeScript
├── config.ts         # Configuración y constantes
├── clip.service.ts   # Servicio principal
└── index.ts          # Exports

app/api/clip/
├── payment/route.ts       # Procesar pagos
├── payment-link/route.ts  # Links de pago
├── refund/route.ts        # Reembolsos
├── tokenize/route.ts      # Tokenización (sandbox)
└── webhook/route.ts       # Webhooks

components/payments/
├── ClipCardForm.tsx          # Formulario de tarjeta
├── ClipPaymentModal.tsx      # Modal de pago
├── ClipPaymentButton.tsx     # Botón simple
├── ClipPaymentLinkButton.tsx # Botón para links
└── index.ts                  # Exports

lib/hooks/
└── useClipPayment.ts    # Hook para pagos
```

### Flujo de Pago

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │────>│   Frontend  │────>│  API Route  │
│ Ingresa     │     │  Tokeniza   │     │  Procesa    │
│ tarjeta     │     │  tarjeta    │     │  pago       │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               v
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Firestore  │<────│   Webhook   │<────│   Clip API  │
│  Actualiza  │     │  Notifica   │     │  Responde   │
│  pedido     │     │  resultado  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Uso de Componentes

### Botón de Pago Simple

```tsx
import { ClipPaymentButton } from '@/components/payments';

function CheckoutPage() {
  const handleSuccess = (paymentId: string) => {
    console.log('Pago exitoso:', paymentId);
    // Redirigir a confirmación
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
    // Mostrar mensaje de error
  };

  return (
    <ClipPaymentButton
      amount={350}
      description="Pedido #123 - Old Texas BBQ"
      orderId="pedido-123"
      customerEmail="cliente@email.com"
      onPaymentSuccess={handleSuccess}
      onPaymentError={handleError}
      showInstallments={true}
    />
  );
}
```

### Botón de Link de Pago

```tsx
import { ClipPaymentLinkButton } from '@/components/payments';

function OrderPage() {
  const handleLinkCreated = (link) => {
    // Enviar link al cliente por WhatsApp
    const whatsappUrl = `https://wa.me/52${telefono}?text=Paga tu pedido aquí: ${link.shortUrl}`;
    window.open(whatsappUrl);
  };

  return (
    <ClipPaymentLinkButton
      amount={450}
      description="Pedido #456"
      orderId="pedido-456"
      onLinkCreated={handleLinkCreated}
      expiresInHours={24}
    />
  );
}
```

### Modal de Pago Personalizado

```tsx
import { useState } from 'react';
import { ClipPaymentModal } from '@/components/payments';

function CustomCheckout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Pagar con tarjeta
      </button>

      <ClipPaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        amount={250}
        description="Mi compra"
        orderId="order-123"
        showInstallments={true}
        onPaymentSuccess={(id) => {
          console.log('Pagado:', id);
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

### Hook Personalizado

```tsx
import { useClipPayment } from '@/lib/hooks/useClipPayment';

function MyPaymentForm() {
  const { state, processPayment, reset } = useClipPayment();

  const handleSubmit = async (cardToken: string) => {
    const result = await processPayment({
      amount: 500,
      cardToken,
      description: 'Mi pago',
      orderId: 'order-789',
    });

    if (result?.status === 'approved') {
      // Éxito
    }
  };

  if (state.isProcessing) {
    return <div>Procesando...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return <MyForm onSubmit={handleSubmit} />;
}
```

---

## API Endpoints

### POST /api/clip/payment

Procesa un pago con tarjeta.

**Request:**
```json
{
  "amount": 350.00,
  "cardToken": "tok_xxx",
  "description": "Pedido #123",
  "orderId": "pedido-123",
  "customerEmail": "cliente@email.com",
  "use3ds": true,
  "installments": 6
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "pay_xxx",
    "status": "approved",
    "amount": 350.00,
    "authorizationCode": "123456",
    "lastFourDigits": "4242"
  }
}
```

### POST /api/clip/payment-link

Crea un link de pago.

**Request:**
```json
{
  "amount": 450.00,
  "description": "Pedido #456",
  "orderId": "pedido-456",
  "customerEmail": "cliente@email.com",
  "expiresAt": "2026-02-01T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "paymentLink": {
    "id": "link_xxx",
    "url": "https://checkout.clip.mx/xxx",
    "shortUrl": "https://clip.mx/p/xxx",
    "status": "active",
    "expiresAt": "2026-02-01T00:00:00Z"
  }
}
```

### POST /api/clip/refund

Procesa un reembolso (solo admin/encargado).

**Request:**
```json
{
  "paymentId": "pay_xxx",
  "amount": 100.00,
  "reason": "Producto no disponible"
}
```

### POST /api/clip/webhook

Recibe notificaciones de Clip (configurar URL en Dashboard).

---

## Webhooks

### Configurar Webhook en Clip

1. Ve al Dashboard de Clip
2. Configura el webhook URL: `https://tu-dominio.com/api/clip/webhook`
3. Selecciona los eventos a recibir
4. Guarda el Webhook Secret en las variables de entorno

### Eventos Soportados

| Evento | Descripción |
|--------|-------------|
| `payment.approved` | Pago aprobado |
| `payment.declined` | Pago rechazado |
| `payment.cancelled` | Pago cancelado |
| `payment.refunded` | Reembolso procesado |
| `payment.chargeback` | Contracargo recibido |
| `payment_link.paid` | Link de pago completado |
| `payment_link.expired` | Link de pago expirado |

### Manejo de Eventos

Los webhooks actualizan automáticamente:

1. El campo `pago.clipStatus` en el pedido
2. Los montos y fechas de pago/reembolso
3. El log de webhooks en `clip_webhook_logs`

---

## Seguridad

### PCI DSS Compliance

- Los datos de tarjeta NUNCA se almacenan en nuestros servidores
- La tokenización se hace en el frontend (producción)
- Solo manejamos tokens de tarjeta
- Las API keys están protegidas en variables de entorno

### Validación de Webhooks

```typescript
// Los webhooks se validan con HMAC-SHA256
const isValid = clipService.verifyWebhookSignature(
  payload,
  signature,
  webhookSecret
);
```

### Autenticación de API

- Todos los endpoints requieren autenticación del usuario
- Los reembolsos solo pueden hacerlos admin/encargado
- Las sesiones se validan en cada request

---

## Testing

### Tarjetas de Prueba (Sandbox)

| Tarjeta | Número | Resultado |
|---------|--------|-----------|
| Visa OK | 4242 4242 4242 4242 | Aprobada |
| MC OK | 5555 5555 5555 4444 | Aprobada |
| Visa Rechazada | 4000 0000 0000 0002 | Rechazada |
| 3DS | 4000 0000 0000 3220 | Requiere 3DS |
| Sin Fondos | 4000 0000 0000 9995 | Fondos insuficientes |

**Para todas las tarjetas de prueba:**
- CVV: cualquier 3 dígitos
- Fecha: cualquier fecha futura
- Nombre: cualquier nombre

### Probar Webhooks Localmente

Usa ngrok para exponer tu servidor local:

```bash
ngrok http 3000
# Configura la URL de ngrok en el Dashboard de Clip
```

---

## Producción

### Checklist Pre-Producción

- [ ] Variables de entorno de producción configuradas
- [ ] Webhook URL configurado en Dashboard de Clip
- [ ] Tokenización desde frontend implementada
- [ ] Manejo de errores completo
- [ ] Logs de transacciones activos
- [ ] Pruebas E2E completadas
- [ ] Monitoreo de pagos configurado

### Monitoreo

Revisa periódicamente:

1. Logs de webhooks en `clip_webhook_logs`
2. Transacciones fallidas
3. Contracargos
4. Tiempo de respuesta de la API

---

## Solución de Problemas

### Error: "Invalid card"

- Verifica que el número de tarjeta sea correcto
- Verifica la fecha de expiración
- En sandbox, usa las tarjetas de prueba

### Error: "Declined"

- El banco rechazó la transacción
- Solicita al cliente usar otra tarjeta
- En sandbox, usa tarjeta que aprueba

### Error: "3DS Required"

- El banco requiere autenticación adicional
- El usuario será redirigido automáticamente
- Asegúrate de configurar `returnUrl`

### Webhook no llega

1. Verifica la URL en el Dashboard de Clip
2. Verifica que el servidor sea accesible desde internet
3. Revisa el Webhook Secret
4. Consulta los logs de Clip

### El pago quedó pendiente

1. Verifica el estado en el Dashboard de Clip
2. El webhook debería actualizar el estado
3. Consulta `clip_webhook_logs` en Firestore

---

## Soporte

- **Documentación Clip:** https://developer.clip.mx
- **Soporte Clip:** soporte@clip.mx
- **Dashboard:** https://dashboard.clip.mx

---

**Versión:** 1.0
**Última actualización:** Enero 2026
