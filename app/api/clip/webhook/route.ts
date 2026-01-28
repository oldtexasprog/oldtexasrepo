/**
 * API Route: Webhook de Clip
 * POST /api/clip/webhook
 *
 * Este endpoint recibe notificaciones de Clip sobre cambios en pagos
 */

import { NextRequest, NextResponse } from 'next/server';
import { clipService, ClipWebhookPayload, ClipApiError } from '@/lib/clip';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, Timestamp, collection, addDoc } from 'firebase/firestore';

// Secret para validar webhooks (configurar en variables de entorno)
const WEBHOOK_SECRET = process.env.CLIP_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Obtener payload raw y signature
    const payload = await request.text();
    const signature = request.headers.get('x-clip-signature') || '';

    // Validar secret configurado
    if (!WEBHOOK_SECRET) {
      console.error('CLIP_WEBHOOK_SECRET no configurado');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Parsear y validar webhook
    let webhookData: ClipWebhookPayload;
    try {
      webhookData = clipService.parseWebhook(payload, signature, WEBHOOK_SECRET);
    } catch (error) {
      console.error('Webhook inválido:', error);
      return NextResponse.json(
        { error: 'Webhook inválido' },
        { status: 401 }
      );
    }

    // Registrar evento en log
    await logWebhookEvent(webhookData);

    // Procesar según tipo de evento
    switch (webhookData.eventType) {
      case 'payment.approved':
        await handlePaymentApproved(webhookData);
        break;

      case 'payment.declined':
        await handlePaymentDeclined(webhookData);
        break;

      case 'payment.cancelled':
        await handlePaymentCancelled(webhookData);
        break;

      case 'payment.refunded':
        await handlePaymentRefunded(webhookData);
        break;

      case 'payment.chargeback':
        await handlePaymentChargeback(webhookData);
        break;

      case 'payment_link.paid':
        await handlePaymentLinkPaid(webhookData);
        break;

      case 'payment_link.expired':
        await handlePaymentLinkExpired(webhookData);
        break;

      default:
        console.log('Evento de webhook no manejado:', webhookData.eventType);
    }

    // Siempre responder 200 para que Clip no reintente
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error procesando webhook Clip:', error);
    // Responder 200 aunque haya error para evitar reintentos
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

/**
 * Registra el evento de webhook en Firestore
 */
async function logWebhookEvent(webhook: ClipWebhookPayload): Promise<void> {
  try {
    const webhookLogsRef = collection(db, 'clip_webhook_logs');
    await addDoc(webhookLogsRef, {
      eventType: webhook.eventType,
      eventId: webhook.eventId,
      paymentId: webhook.data.id,
      orderId: webhook.data.orderId,
      amount: webhook.data.amount,
      status: webhook.data.status,
      timestamp: Timestamp.now(),
      rawTimestamp: webhook.timestamp,
    });
  } catch (error) {
    console.error('Error registrando webhook log:', error);
  }
}

/**
 * Maneja pago aprobado
 */
async function handlePaymentApproved(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: paymentId, amount } = webhook.data;

  if (!orderId) return;

  try {
    // Actualizar pedido con información del pago
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipPaymentId': paymentId,
      'pago.clipStatus': 'approved',
      'pago.clipAmount': amount,
      'pago.clipPaidAt': Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });

    console.log(`Pago aprobado para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido aprobado:', error);
  }
}

/**
 * Maneja pago rechazado
 */
async function handlePaymentDeclined(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: paymentId } = webhook.data;

  if (!orderId) return;

  try {
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipPaymentId': paymentId,
      'pago.clipStatus': 'declined',
      'pago.clipDeclinedAt': Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });

    console.log(`Pago rechazado para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido rechazado:', error);
  }
}

/**
 * Maneja pago cancelado
 */
async function handlePaymentCancelled(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: paymentId } = webhook.data;

  if (!orderId) return;

  try {
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipPaymentId': paymentId,
      'pago.clipStatus': 'cancelled',
      fechaActualizacion: Timestamp.now(),
    });

    console.log(`Pago cancelado para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido cancelado:', error);
  }
}

/**
 * Maneja reembolso
 */
async function handlePaymentRefunded(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: paymentId, amount } = webhook.data;

  if (!orderId) return;

  try {
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipStatus': 'refunded',
      'pago.clipRefundedAmount': amount,
      'pago.clipRefundedAt': Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });

    console.log(`Reembolso procesado para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido reembolsado:', error);
  }
}

/**
 * Maneja contracargo
 */
async function handlePaymentChargeback(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: paymentId, amount } = webhook.data;

  if (!orderId) return;

  try {
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipStatus': 'chargeback',
      'pago.clipChargebackAt': Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });

    // TODO: Notificar a admin sobre contracargo
    console.warn(`ALERTA: Contracargo para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido con contracargo:', error);
  }
}

/**
 * Maneja link de pago pagado
 */
async function handlePaymentLinkPaid(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: linkId, amount } = webhook.data;

  if (!orderId) return;

  try {
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipPaymentLinkId': linkId,
      'pago.clipStatus': 'approved',
      'pago.clipAmount': amount,
      'pago.clipPaidAt': Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });

    console.log(`Link de pago completado para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido con link pagado:', error);
  }
}

/**
 * Maneja link de pago expirado
 */
async function handlePaymentLinkExpired(webhook: ClipWebhookPayload): Promise<void> {
  const { orderId, id: linkId } = webhook.data;

  if (!orderId) return;

  try {
    const pedidoRef = doc(db, 'pedidos', orderId);
    await updateDoc(pedidoRef, {
      'pago.clipPaymentLinkExpired': true,
      fechaActualizacion: Timestamp.now(),
    });

    console.log(`Link de pago expirado para pedido ${orderId}`);
  } catch (error) {
    console.error('Error actualizando pedido con link expirado:', error);
  }
}
