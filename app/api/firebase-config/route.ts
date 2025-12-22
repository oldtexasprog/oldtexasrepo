/**
 * API Route: Firebase Configuration
 * Old Texas BBQ - CRM
 *
 * Endpoint seguro que devuelve la configuración pública de Firebase
 * para ser utilizada por el Service Worker
 *
 * IMPORTANTE: Solo devuelve configuración PÚBLICA (no secretos)
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Validar que las variables de entorno existan
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        console.error(`❌ Variable de entorno faltante: ${varName}`);
        return NextResponse.json(
          { error: 'Firebase configuration incomplete' },
          { status: 500 }
        );
      }
    }

    // Configuración pública de Firebase
    // NOTA: Estas son credenciales PÚBLICAS, no secretas
    // Es seguro exponerlas porque Firebase usa reglas de seguridad
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    };

    // Headers de seguridad
    const headers = {
      'Content-Type': 'application/json',
      // Cache por 1 hora (la config no cambia frecuentemente)
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      // Permitir acceso solo desde el mismo origen
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    return NextResponse.json(firebaseConfig, { headers });
  } catch (error) {
    console.error('Error al obtener configuración de Firebase:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Firebase configuration' },
      { status: 500 }
    );
  }
}

// Deshabilitar otras métodos HTTP
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
