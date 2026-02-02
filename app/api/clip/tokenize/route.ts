/**
 * API Route: Tokenizar Tarjeta con Clip
 * POST /api/clip/tokenize
 *
 * NOTA: En producción, la tokenización debe hacerse directamente
 * desde el frontend usando el SDK de Clip para cumplir con PCI DSS.
 * Este endpoint es principalmente para testing en sandbox.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSandbox, CLIP_TEST_CARDS } from '@/lib/clip';
import crypto from 'crypto';

// Tarjetas de prueba válidas en sandbox
const TEST_CARD_NUMBERS = [
  CLIP_TEST_CARDS.visa_approved.number.replace(/\s/g, ''),
  CLIP_TEST_CARDS.mastercard_approved.number.replace(/\s/g, ''),
  CLIP_TEST_CARDS.visa_declined.number.replace(/\s/g, ''),
  CLIP_TEST_CARDS.visa_3ds.number.replace(/\s/g, ''),
  CLIP_TEST_CARDS.insufficient_funds.number.replace(/\s/g, ''),
];

function detectCardType(number: string): 'visa' | 'mastercard' | 'amex' | 'other' {
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  return 'other';
}

export async function POST(request: NextRequest) {
  try {
    // Solo permitir en sandbox
    if (!isSandbox()) {
      return NextResponse.json(
        {
          error: 'La tokenización del servidor solo está disponible en sandbox. ' +
                 'En producción, usa el SDK de Clip en el frontend.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { cardNumber, cardHolderName, expirationMonth, expirationYear, cvv } = body;

    // Validar campos requeridos
    if (!cardNumber || !cardHolderName || !expirationMonth || !expirationYear || !cvv) {
      return NextResponse.json(
        { error: 'Todos los campos de la tarjeta son requeridos' },
        { status: 400 }
      );
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    // Validar longitud del número de tarjeta
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return NextResponse.json(
        { error: 'Número de tarjeta inválido' },
        { status: 400 }
      );
    }

    // Validar CVV
    if (!/^\d{3,4}$/.test(cvv)) {
      return NextResponse.json(
        { error: 'CVV inválido' },
        { status: 400 }
      );
    }

    // Validar fecha de expiración
    const expMonth = parseInt(expirationMonth);
    const expYear = parseInt(expirationYear);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return NextResponse.json(
        { error: 'Tarjeta expirada' },
        { status: 400 }
      );
    }

    // En sandbox, generar token simulado
    // El token incluye información codificada de la tarjeta para simular comportamientos
    const cardType = detectCardType(cleanCardNumber);
    const lastFour = cleanCardNumber.slice(-4);

    // Generar un token único basado en los datos
    const tokenData = `${cleanCardNumber}:${expirationMonth}:${expirationYear}:${Date.now()}`;
    const tokenId = `tok_sandbox_${crypto.createHash('sha256').update(tokenData).digest('hex').substring(0, 24)}`;

    // Guardar info del token en el propio token para simular comportamiento
    // En producción, esto se manejaría del lado de Clip
    const tokenPayload = {
      id: tokenId,
      cardNumber: cleanCardNumber,
      cardType,
      lastFour,
      expMonth,
      expYear,
      isTestCard: TEST_CARD_NUMBERS.includes(cleanCardNumber),
    };

    // Codificar el payload en base64 para usarlo como "token"
    const encodedToken = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    return NextResponse.json({
      success: true,
      token: encodedToken,
      cardType,
      lastFourDigits: lastFour,
    });

  } catch (error) {
    console.error('Error tokenizando tarjeta:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
