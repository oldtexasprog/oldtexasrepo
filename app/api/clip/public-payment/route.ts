/**
 * API Route: Procesar Pago Público con Clip
 * POST /api/clip/public-payment
 *
 * Esta ruta permite pagos desde el formulario público /pedir
 * sin requerir autenticación del usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSandbox, CLIP_TEST_CARDS } from '@/lib/clip';
import crypto from 'crypto';

// Rate limiting simple en memoria (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // máximo 5 intentos
const RATE_LIMIT_WINDOW = 60 * 1000; // por minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Simular respuesta de pago en sandbox
function simulateSandboxPayment(
  tokenPayload: {
    cardNumber: string;
    cardType: string;
    lastFour: string;
    expMonth: number;
    expYear: number;
  },
  amount: number,
  description: string
) {
  const { cardNumber, cardType, lastFour } = tokenPayload;

  // Generar ID de pago único
  const paymentId = `pay_sandbox_${crypto.randomBytes(12).toString('hex')}`;
  const authCode = Math.random().toString().substring(2, 8);

  // Determinar resultado basado en tarjeta de prueba
  const visaDeclined = CLIP_TEST_CARDS.visa_declined.number.replace(/\s/g, '');
  const insufficientFunds = CLIP_TEST_CARDS.insufficient_funds.number.replace(/\s/g, '');
  const visa3ds = CLIP_TEST_CARDS.visa_3ds.number.replace(/\s/g, '');

  // Tarjeta rechazada
  if (cardNumber === visaDeclined) {
    return {
      id: paymentId,
      status: 'declined',
      amount,
      lastFourDigits: lastFour,
      cardType,
      authorizationCode: null,
      requires3ds: false,
      redirectUrl: null,
      errorMessage: 'Tarjeta rechazada por el banco emisor',
    };
  }

  // Fondos insuficientes
  if (cardNumber === insufficientFunds) {
    return {
      id: paymentId,
      status: 'declined',
      amount,
      lastFourDigits: lastFour,
      cardType,
      authorizationCode: null,
      requires3ds: false,
      redirectUrl: null,
      errorMessage: 'Fondos insuficientes',
    };
  }

  // Requiere 3DS (simulado como aprobado para simplificar pruebas)
  if (cardNumber === visa3ds) {
    return {
      id: paymentId,
      status: 'approved',
      amount,
      lastFourDigits: lastFour,
      cardType,
      authorizationCode: authCode,
      requires3ds: false, // Simulamos que 3DS pasó
      redirectUrl: null,
      errorMessage: null,
    };
  }

  // Tarjeta aprobada (default para tarjetas de prueba válidas)
  return {
    id: paymentId,
    status: 'approved',
    amount,
    lastFourDigits: lastFour,
    cardType,
    authorizationCode: authCode,
    requires3ds: false,
    redirectUrl: null,
    errorMessage: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Obtener IP para rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Verificar rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento antes de intentar de nuevo.' },
        { status: 429 }
      );
    }

    // Obtener datos del cuerpo
    const body = await request.json();

    // Validar campos requeridos
    const {
      amount,
      cardToken,
      description,
    } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'El monto es requerido y debe ser un número' },
        { status: 400 }
      );
    }

    // Validar monto mínimo y máximo
    if (amount < 10) {
      return NextResponse.json(
        { error: 'El monto mínimo es $10.00 MXN' },
        { status: 400 }
      );
    }

    if (amount > 50000) {
      return NextResponse.json(
        { error: 'El monto máximo para pagos en línea es $50,000.00 MXN' },
        { status: 400 }
      );
    }

    if (!cardToken || typeof cardToken !== 'string') {
      return NextResponse.json(
        { error: 'El token de tarjeta es requerido' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'La descripción es requerida' },
        { status: 400 }
      );
    }

    // En sandbox, decodificar el token simulado y simular respuesta
    if (isSandbox()) {
      try {
        const tokenPayload = JSON.parse(Buffer.from(cardToken, 'base64').toString('utf-8'));
        const payment = simulateSandboxPayment(tokenPayload, amount, description);

        return NextResponse.json({
          success: payment.status === 'approved',
          payment,
        });
      } catch {
        return NextResponse.json(
          { error: 'Token de tarjeta inválido' },
          { status: 400 }
        );
      }
    }

    // En producción, usar el servicio real de Clip
    // TODO: Implementar llamada real a Clip API cuando esté en producción
    return NextResponse.json(
      { error: 'Pagos en producción no configurados aún' },
      { status: 501 }
    );

  } catch (error) {
    console.error('Error procesando pago público Clip:', error);

    return NextResponse.json(
      { error: 'Error procesando el pago. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
