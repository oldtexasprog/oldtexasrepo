/**
 * Tipos para la integración con Clip Payment Gateway
 * Old Texas BBQ - CRM
 *
 * Documentación: https://developer.clip.mx
 */

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

export interface ClipConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

// =============================================================================
// AUTENTICACIÓN
// =============================================================================

export interface ClipAuthToken {
  token: string;
  expiresAt: Date;
}

// =============================================================================
// CHECKOUT TRANSPARENTE
// =============================================================================

/**
 * Datos de tarjeta para tokenización
 * NOTA: Nunca almacenar datos de tarjeta en el servidor
 */
export interface ClipCardData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string; // MM
  expirationYear: string; // YYYY
  cvv: string;
}

/**
 * Token de tarjeta generado por Clip
 */
export interface ClipCardToken {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'other';
  lastFourDigits: string;
  expirationMonth: string;
  expirationYear: string;
  cardHolderName: string;
}

/**
 * Datos para crear un pago
 */
export interface ClipPaymentRequest {
  amount: number; // En pesos mexicanos (MXN)
  currency?: 'MXN' | 'USD';
  description: string;
  cardToken: string;
  orderId?: string; // ID interno del pedido
  customerEmail?: string;
  customerPhone?: string;
  metadata?: Record<string, string>;
  // 3DS Authentication
  use3ds?: boolean;
  returnUrl?: string;
  // Meses sin intereses
  installments?: 3 | 6 | 9 | 12;
}

/**
 * Respuesta de creación de pago
 */
export interface ClipPaymentResponse {
  id: string;
  status: ClipPaymentStatus;
  amount: number;
  currency: string;
  description: string;
  cardType: string;
  lastFourDigits: string;
  authorizationCode?: string;
  referenceNumber?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  // 3DS
  requires3ds?: boolean;
  redirectUrl?: string;
  // Error info
  errorCode?: string;
  errorMessage?: string;
}

export type ClipPaymentStatus =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'
  | 'error';

// =============================================================================
// CHECKOUT REDIRECCIONADO (PAYMENT LINKS)
// =============================================================================

/**
 * Datos para crear un link de pago
 */
export interface ClipPaymentLinkRequest {
  amount: number;
  currency?: 'MXN' | 'USD';
  description: string;
  orderId?: string;
  customerEmail?: string;
  expiresAt?: string; // ISO date
  redirectUrl?: string;
  metadata?: Record<string, string>;
}

/**
 * Respuesta de creación de link de pago
 */
export interface ClipPaymentLinkResponse {
  id: string;
  url: string;
  shortUrl: string;
  amount: number;
  currency: string;
  description: string;
  status: 'active' | 'paid' | 'expired' | 'cancelled';
  expiresAt: string;
  createdAt: string;
}

// =============================================================================
// REEMBOLSOS
// =============================================================================

export interface ClipRefundRequest {
  paymentId: string;
  amount?: number; // Para reembolso parcial, si no se envía es total
  reason?: string;
}

export interface ClipRefundResponse {
  id: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'approved' | 'declined';
  reason?: string;
  createdAt: string;
}

// =============================================================================
// TRANSACCIONES
// =============================================================================

export interface ClipTransaction {
  id: string;
  type: 'payment' | 'refund' | 'chargeback';
  status: ClipPaymentStatus;
  amount: number;
  currency: string;
  description: string;
  cardType?: string;
  lastFourDigits?: string;
  authorizationCode?: string;
  orderId?: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface ClipTransactionListResponse {
  data: ClipTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// =============================================================================
// WEBHOOKS
// =============================================================================

export type ClipWebhookEventType =
  | 'payment.approved'
  | 'payment.declined'
  | 'payment.cancelled'
  | 'payment.refunded'
  | 'payment.chargeback'
  | 'payment_link.paid'
  | 'payment_link.expired';

export interface ClipWebhookPayload {
  eventType: ClipWebhookEventType;
  eventId: string;
  timestamp: string;
  data: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    orderId?: string;
    metadata?: Record<string, string>;
  };
  signature: string;
}

// =============================================================================
// ERRORES
// =============================================================================

export interface ClipError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ClipApiError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ClipApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// =============================================================================
// INTEGRACION CON PEDIDOS
// =============================================================================

/**
 * Datos de pago Clip asociados a un pedido
 */
export interface ClipPagoInfo {
  clipPaymentId: string;
  status: ClipPaymentStatus;
  amount: number;
  cardType?: string;
  lastFourDigits?: string;
  authorizationCode?: string;
  paidAt?: Date;
  refundedAmount?: number;
  refundedAt?: Date;
}

/**
 * Estado del proceso de pago en el frontend
 */
export interface ClipPaymentState {
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  paymentResult: ClipPaymentResponse | null;
  requires3ds: boolean;
  redirectUrl: string | null;
}

// =============================================================================
// CÓDIGOS DE ERROR COMUNES
// =============================================================================

export const CLIP_ERROR_CODES = {
  INVALID_CARD: 'invalid_card',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  CARD_DECLINED: 'card_declined',
  EXPIRED_CARD: 'expired_card',
  INVALID_CVV: 'invalid_cvv',
  INVALID_AMOUNT: 'invalid_amount',
  DUPLICATE_TRANSACTION: 'duplicate_transaction',
  FRAUD_SUSPECTED: 'fraud_suspected',
  AUTHENTICATION_REQUIRED: '3ds_required',
  AUTHENTICATION_FAILED: '3ds_failed',
  NETWORK_ERROR: 'network_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

export const CLIP_ERROR_MESSAGES: Record<string, string> = {
  [CLIP_ERROR_CODES.INVALID_CARD]: 'Tarjeta inválida. Verifica los datos ingresados.',
  [CLIP_ERROR_CODES.INSUFFICIENT_FUNDS]: 'Fondos insuficientes en la tarjeta.',
  [CLIP_ERROR_CODES.CARD_DECLINED]: 'Tarjeta rechazada. Contacta a tu banco.',
  [CLIP_ERROR_CODES.EXPIRED_CARD]: 'La tarjeta ha expirado.',
  [CLIP_ERROR_CODES.INVALID_CVV]: 'Código de seguridad (CVV) inválido.',
  [CLIP_ERROR_CODES.INVALID_AMOUNT]: 'Monto inválido para la transacción.',
  [CLIP_ERROR_CODES.DUPLICATE_TRANSACTION]: 'Transacción duplicada detectada.',
  [CLIP_ERROR_CODES.FRAUD_SUSPECTED]: 'Transacción rechazada por medidas de seguridad.',
  [CLIP_ERROR_CODES.AUTHENTICATION_REQUIRED]: 'Se requiere autenticación 3D Secure.',
  [CLIP_ERROR_CODES.AUTHENTICATION_FAILED]: 'Falló la autenticación 3D Secure.',
  [CLIP_ERROR_CODES.NETWORK_ERROR]: 'Error de conexión. Intenta de nuevo.',
  [CLIP_ERROR_CODES.UNKNOWN_ERROR]: 'Error desconocido. Contacta soporte.',
};
