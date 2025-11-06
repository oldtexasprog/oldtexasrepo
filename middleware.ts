import { NextResponse, type NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS: RegExp[] = [
  /^\/$/,
  /^\/login(?:\/)??$/,
  /^\/unauthorized(?:\/)??$/,
  /^\/public\//,
];

// ⚠️ SEGURIDAD: Rutas /dev/* solo permitidas en desarrollo
const DEV_PATHS: RegExp[] = [/^\/dev\//];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ⚠️ SEGURIDAD: Bloquear rutas /dev/* en producción
  if (DEV_PATHS.some((re) => re.test(pathname))) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Not Found', { status: 404 });
    }
    // En desarrollo, permitir acceso (la protección real está en dev-auth.ts)
    return NextResponse.next();
  }

  // Permitir rutas públicas
  if (PUBLIC_PATHS.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // Nota: Sin backend de sesiones, no podemos verificar Firebase Auth en middleware.
  // Este middleware actúa como capa suave; la protección real ocurre en cliente con ProtectedRoute.
  // Si en el futuro se agrega una cookie de sesión, validar aquí y redirigir a /login cuando falte.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};


