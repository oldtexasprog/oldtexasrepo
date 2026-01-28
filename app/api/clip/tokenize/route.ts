/**
 * API Route: Tokenizar Tarjeta con Clip
 * POST /api/clip/tokenize
 *
 * NOTA: En producción, la tokenización debe hacerse directamente
 * desde el frontend usando el SDK de Clip para cumplir con PCI DSS.
 * Este endpoint es principalmente para testing en sandbox.
 */

import { NextRequest, NextResponse } from 'next/server';
import { clipService, ClipApiError, isSandbox } from '@/lib/clip';

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

    // Tokenizar la tarjeta
    const token = await clipService.tokenizeCard({
      cardNumber,
      cardHolderName,
      expirationMonth,
      expirationYear,
      cvv,
    });

    return NextResponse.json({
      success: true,
      token: token.id,
      cardType: token.cardType,
      lastFourDigits: token.lastFourDigits,
    });

  } catch (error) {
    console.error('Error tokenizando tarjeta:', error);

    if (error instanceof ClipApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
