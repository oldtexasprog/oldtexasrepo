/**
 * Configuración de Clip Payment Gateway
 * Old Texas BBQ - CRM
 *
 * Variables de entorno requeridas:
 * - CLIP_API_KEY: API Key de Clip
 * - CLIP_SECRET_KEY: Secret Key de Clip
 * - CLIP_ENVIRONMENT: 'sandbox' | 'production'
 * - NEXT_PUBLIC_CLIP_PUBLIC_KEY: Public Key para el frontend
 */

import { ClipConfig } from './types';

// URLs base de la API de Clip
const CLIP_URLS = {
  sandbox: 'https://api-sandbox.clip.mx/v1',
  production: 'https://api.clip.mx/v1',
} as const;

/**
 * Obtiene la configuración de Clip desde variables de entorno
 * Para uso en server-side (API routes)
 */
export function getClipConfig(): ClipConfig {
  const apiKey = process.env.CLIP_API_KEY;
  const secretKey = process.env.CLIP_SECRET_KEY;
  const environment = (process.env.CLIP_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';

  if (!apiKey || !secretKey) {
    throw new Error(
      'Clip configuration error: CLIP_API_KEY and CLIP_SECRET_KEY must be set in environment variables'
    );
  }

  return {
    apiKey,
    secretKey,
    environment,
    baseUrl: CLIP_URLS[environment],
  };
}

/**
 * Genera el token de autenticación Basic para Clip
 * Formato: Basic base64(apiKey:secretKey)
 */
export function generateAuthToken(apiKey: string, secretKey: string): string {
  const credentials = `${apiKey}:${secretKey}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  return `Basic ${base64Credentials}`;
}

/**
 * Configuración pública para el frontend
 * Solo incluye datos seguros para exponer al cliente
 */
export const clipPublicConfig = {
  // Public key para tokenización de tarjetas en el frontend
  publicKey: process.env.NEXT_PUBLIC_CLIP_PUBLIC_KEY || '',
  // Ambiente actual
  environment: (process.env.NEXT_PUBLIC_CLIP_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
  // URL de la API pública de Clip para tokenización
  tokenizeUrl:
    process.env.NEXT_PUBLIC_CLIP_ENVIRONMENT === 'production'
      ? 'https://api.clip.mx/v1/tokens'
      : 'https://api-sandbox.clip.mx/v1/tokens',
};

/**
 * Headers comunes para las peticiones a Clip
 */
export function getClipHeaders(authToken: string): HeadersInit {
  return {
    Authorization: authToken,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * Verifica si el ambiente es sandbox
 */
export function isSandbox(): boolean {
  return process.env.CLIP_ENVIRONMENT !== 'production';
}

/**
 * Datos de prueba para sandbox
 * Documentación: https://developer.clip.mx/reference/tarjetas-de-prueba
 */
export const CLIP_TEST_CARDS = {
  // Tarjetas que aprueban
  visa_approved: {
    number: '4242424242424242',
    cvv: '123',
    expMonth: '12',
    expYear: '2028',
    name: 'Test User',
  },
  mastercard_approved: {
    number: '5555555555554444',
    cvv: '123',
    expMonth: '12',
    expYear: '2028',
    name: 'Test User',
  },
  // Tarjetas que rechazan
  visa_declined: {
    number: '4000000000000002',
    cvv: '123',
    expMonth: '12',
    expYear: '2028',
    name: 'Test Declined',
  },
  // Tarjeta que requiere 3DS
  visa_3ds: {
    number: '4000000000003220',
    cvv: '123',
    expMonth: '12',
    expYear: '2028',
    name: 'Test 3DS',
  },
  // Fondos insuficientes
  insufficient_funds: {
    number: '4000000000009995',
    cvv: '123',
    expMonth: '12',
    expYear: '2028',
    name: 'Test Insufficient',
  },
} as const;

/**
 * Límites de la API
 */
export const CLIP_LIMITS = {
  minAmount: 10, // $10 MXN mínimo
  maxAmount: 999999, // ~$1M MXN máximo
  maxInstallments: 12,
  allowedInstallments: [3, 6, 9, 12] as const,
} as const;

/**
 * Tiempo de expiración de tokens y cache
 */
export const CLIP_TIMEOUTS = {
  cardTokenExpiry: 15 * 60 * 1000, // 15 minutos
  paymentTimeout: 30 * 1000, // 30 segundos
  webhookTimeout: 5 * 1000, // 5 segundos para responder webhooks
} as const;
