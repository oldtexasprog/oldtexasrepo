/**
 * Servicio de Clip Payment Gateway
 * Old Texas BBQ - CRM
 *
 * Este servicio maneja todas las operaciones con la API de Clip:
 * - Tokenización de tarjetas
 * - Procesamiento de pagos
 * - Consulta de transacciones
 * - Reembolsos
 * - Validación de webhooks
 */

import {
  ClipPaymentRequest,
  ClipPaymentResponse,
  ClipPaymentLinkRequest,
  ClipPaymentLinkResponse,
  ClipRefundRequest,
  ClipRefundResponse,
  ClipTransaction,
  ClipTransactionListResponse,
  ClipWebhookPayload,
  ClipApiError,
  ClipCardToken,
  CLIP_ERROR_CODES,
} from './types';
import {
  getClipConfig,
  generateAuthToken,
  getClipHeaders,
  CLIP_LIMITS,
} from './config';
import crypto from 'crypto';

class ClipService {
  private authToken: string | null = null;
  private baseUrl: string = '';

  /**
   * Inicializa el servicio con las credenciales
   */
  private initialize(): void {
    if (this.authToken) return;

    const config = getClipConfig();
    this.authToken = generateAuthToken(config.apiKey, config.secretKey);
    this.baseUrl = config.baseUrl;
  }

  /**
   * Realiza una petición a la API de Clip
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> {
    this.initialize();

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: getClipHeaders(this.authToken!),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ClipApiError(
          data.error?.code || CLIP_ERROR_CODES.UNKNOWN_ERROR,
          data.error?.message || 'Error en la API de Clip',
          response.status,
          data.error?.details
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ClipApiError) {
        throw error;
      }

      throw new ClipApiError(
        CLIP_ERROR_CODES.NETWORK_ERROR,
        'Error de conexión con Clip',
        500
      );
    }
  }

  // ===========================================================================
  // TOKENIZACIÓN
  // ===========================================================================

  /**
   * Tokeniza una tarjeta (generalmente se hace en el frontend)
   * Este método es principalmente para testing en sandbox
   */
  async tokenizeCard(cardData: {
    cardNumber: string;
    cardHolderName: string;
    expirationMonth: string;
    expirationYear: string;
    cvv: string;
  }): Promise<ClipCardToken> {
    return this.request<ClipCardToken>('/tokens', 'POST', {
      card_number: cardData.cardNumber.replace(/\s/g, ''),
      card_holder_name: cardData.cardHolderName,
      expiration_month: cardData.expirationMonth,
      expiration_year: cardData.expirationYear,
      cvv: cardData.cvv,
    });
  }

  // ===========================================================================
  // PAGOS (CHECKOUT TRANSPARENTE)
  // ===========================================================================

  /**
   * Procesa un pago con tarjeta tokenizada
   */
  async createPayment(paymentData: ClipPaymentRequest): Promise<ClipPaymentResponse> {
    // Validaciones
    if (paymentData.amount < CLIP_LIMITS.minAmount) {
      throw new ClipApiError(
        CLIP_ERROR_CODES.INVALID_AMOUNT,
        `El monto mínimo es $${CLIP_LIMITS.minAmount} MXN`,
        400
      );
    }

    if (paymentData.amount > CLIP_LIMITS.maxAmount) {
      throw new ClipApiError(
        CLIP_ERROR_CODES.INVALID_AMOUNT,
        `El monto máximo es $${CLIP_LIMITS.maxAmount} MXN`,
        400
      );
    }

    if (
      paymentData.installments &&
      !CLIP_LIMITS.allowedInstallments.includes(paymentData.installments)
    ) {
      throw new ClipApiError(
        CLIP_ERROR_CODES.INVALID_AMOUNT,
        `Meses sin intereses permitidos: ${CLIP_LIMITS.allowedInstallments.join(', ')}`,
        400
      );
    }

    const requestBody: Record<string, unknown> = {
      amount: Math.round(paymentData.amount * 100), // Clip usa centavos
      currency: paymentData.currency || 'MXN',
      description: paymentData.description,
      source: paymentData.cardToken,
    };

    if (paymentData.orderId) {
      requestBody.order_id = paymentData.orderId;
    }

    if (paymentData.customerEmail) {
      requestBody.customer_email = paymentData.customerEmail;
    }

    if (paymentData.customerPhone) {
      requestBody.customer_phone = paymentData.customerPhone;
    }

    if (paymentData.metadata) {
      requestBody.metadata = paymentData.metadata;
    }

    if (paymentData.use3ds) {
      requestBody.three_d_secure = {
        required: true,
        return_url: paymentData.returnUrl,
      };
    }

    if (paymentData.installments) {
      requestBody.installments = paymentData.installments;
    }

    const response = await this.request<Record<string, unknown>>('/charges', 'POST', requestBody);

    return this.mapPaymentResponse(response);
  }

  /**
   * Obtiene detalles de un pago
   */
  async getPayment(paymentId: string): Promise<ClipPaymentResponse> {
    const response = await this.request<Record<string, unknown>>(`/charges/${paymentId}`);
    return this.mapPaymentResponse(response);
  }

  /**
   * Mapea la respuesta de Clip al formato interno
   */
  private mapPaymentResponse(data: Record<string, unknown>): ClipPaymentResponse {
    return {
      id: data.id as string,
      status: this.mapStatus(data.status as string),
      amount: (data.amount as number) / 100, // Convertir de centavos a pesos
      currency: data.currency as string,
      description: data.description as string,
      cardType: (data.card as any)?.brand || '',
      lastFourDigits: (data.card as any)?.last_four || '',
      authorizationCode: data.authorization_code as string | undefined,
      referenceNumber: data.reference_number as string | undefined,
      orderId: data.order_id as string | undefined,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
      requires3ds: (data.three_d_secure as any)?.required || false,
      redirectUrl: (data.three_d_secure as any)?.redirect_url,
      errorCode: (data.error as any)?.code,
      errorMessage: (data.error as any)?.message,
    };
  }

  private mapStatus(status: string): ClipPaymentResponse['status'] {
    const statusMap: Record<string, ClipPaymentResponse['status']> = {
      pending: 'pending',
      approved: 'approved',
      paid: 'approved',
      declined: 'declined',
      cancelled: 'cancelled',
      refunded: 'refunded',
      partially_refunded: 'partially_refunded',
      failed: 'error',
    };
    return statusMap[status] || 'error';
  }

  // ===========================================================================
  // LINKS DE PAGO (CHECKOUT REDIRECCIONADO)
  // ===========================================================================

  /**
   * Crea un link de pago
   */
  async createPaymentLink(linkData: ClipPaymentLinkRequest): Promise<ClipPaymentLinkResponse> {
    const requestBody: Record<string, unknown> = {
      amount: Math.round(linkData.amount * 100),
      currency: linkData.currency || 'MXN',
      description: linkData.description,
    };

    if (linkData.orderId) {
      requestBody.order_id = linkData.orderId;
    }

    if (linkData.customerEmail) {
      requestBody.customer_email = linkData.customerEmail;
    }

    if (linkData.expiresAt) {
      requestBody.expires_at = linkData.expiresAt;
    }

    if (linkData.redirectUrl) {
      requestBody.redirect_url = linkData.redirectUrl;
    }

    if (linkData.metadata) {
      requestBody.metadata = linkData.metadata;
    }

    const response = await this.request<Record<string, unknown>>('/payment-links', 'POST', requestBody);

    return {
      id: response.id as string,
      url: response.url as string,
      shortUrl: response.short_url as string,
      amount: (response.amount as number) / 100,
      currency: response.currency as string,
      description: response.description as string,
      status: response.status as 'active' | 'paid' | 'expired' | 'cancelled',
      expiresAt: response.expires_at as string,
      createdAt: response.created_at as string,
    };
  }

  /**
   * Obtiene el estado de un link de pago
   */
  async getPaymentLink(linkId: string): Promise<ClipPaymentLinkResponse> {
    const response = await this.request<Record<string, unknown>>(`/payment-links/${linkId}`);

    return {
      id: response.id as string,
      url: response.url as string,
      shortUrl: response.short_url as string,
      amount: (response.amount as number) / 100,
      currency: response.currency as string,
      description: response.description as string,
      status: response.status as 'active' | 'paid' | 'expired' | 'cancelled',
      expiresAt: response.expires_at as string,
      createdAt: response.created_at as string,
    };
  }

  /**
   * Cancela un link de pago
   */
  async cancelPaymentLink(linkId: string): Promise<void> {
    await this.request(`/payment-links/${linkId}/cancel`, 'POST');
  }

  // ===========================================================================
  // REEMBOLSOS
  // ===========================================================================

  /**
   * Crea un reembolso
   */
  async createRefund(refundData: ClipRefundRequest): Promise<ClipRefundResponse> {
    const requestBody: Record<string, unknown> = {};

    if (refundData.amount) {
      requestBody.amount = Math.round(refundData.amount * 100);
    }

    if (refundData.reason) {
      requestBody.reason = refundData.reason;
    }

    const response = await this.request<Record<string, unknown>>(
      `/charges/${refundData.paymentId}/refunds`,
      'POST',
      requestBody
    );

    return {
      id: response.id as string,
      paymentId: refundData.paymentId,
      amount: (response.amount as number) / 100,
      status: response.status as 'pending' | 'approved' | 'declined',
      reason: response.reason as string | undefined,
      createdAt: response.created_at as string,
    };
  }

  /**
   * Obtiene los reembolsos de un pago
   */
  async getRefunds(paymentId: string): Promise<ClipRefundResponse[]> {
    const response = await this.request<{ data: Record<string, unknown>[] }>(
      `/charges/${paymentId}/refunds`
    );

    return response.data.map((refund) => ({
      id: refund.id as string,
      paymentId,
      amount: (refund.amount as number) / 100,
      status: refund.status as 'pending' | 'approved' | 'declined',
      reason: refund.reason as string | undefined,
      createdAt: refund.created_at as string,
    }));
  }

  // ===========================================================================
  // TRANSACCIONES
  // ===========================================================================

  /**
   * Lista transacciones con paginación
   */
  async listTransactions(options?: {
    page?: number;
    limit?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ClipTransactionListResponse> {
    const params = new URLSearchParams();

    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.fromDate) params.append('from_date', options.fromDate);
    if (options?.toDate) params.append('to_date', options.toDate);

    const queryString = params.toString();
    const endpoint = `/charges${queryString ? `?${queryString}` : ''}`;

    const response = await this.request<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(endpoint);

    return {
      data: response.data.map((t) => this.mapTransaction(t)),
      pagination: {
        total: response.pagination.total as number,
        page: response.pagination.page as number,
        limit: response.pagination.limit as number,
        hasMore: response.pagination.has_more as boolean,
      },
    };
  }

  private mapTransaction(data: Record<string, unknown>): ClipTransaction {
    return {
      id: data.id as string,
      type: data.type as 'payment' | 'refund' | 'chargeback',
      status: this.mapStatus(data.status as string),
      amount: (data.amount as number) / 100,
      currency: data.currency as string,
      description: data.description as string,
      cardType: (data.card as any)?.brand,
      lastFourDigits: (data.card as any)?.last_four,
      authorizationCode: data.authorization_code as string | undefined,
      orderId: data.order_id as string | undefined,
      createdAt: data.created_at as string,
      metadata: data.metadata as Record<string, string> | undefined,
    };
  }

  // ===========================================================================
  // WEBHOOKS
  // ===========================================================================

  /**
   * Verifica la firma de un webhook de Clip
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    webhookSecret: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Parsea y valida un webhook de Clip
   */
  parseWebhook(
    payload: string,
    signature: string,
    webhookSecret: string
  ): ClipWebhookPayload {
    if (!this.verifyWebhookSignature(payload, signature, webhookSecret)) {
      throw new ClipApiError(
        'invalid_signature',
        'Firma de webhook inválida',
        401
      );
    }

    try {
      const data = JSON.parse(payload);
      return {
        eventType: data.event_type,
        eventId: data.event_id,
        timestamp: data.timestamp,
        data: {
          id: data.data.id,
          amount: data.data.amount / 100,
          currency: data.data.currency,
          status: data.data.status,
          orderId: data.data.order_id,
          metadata: data.data.metadata,
        },
        signature,
      };
    } catch {
      throw new ClipApiError(
        'invalid_payload',
        'Payload de webhook inválido',
        400
      );
    }
  }
}

// Exportar instancia singleton
export const clipService = new ClipService();
