/**
 * Utilidad para autenticación de páginas de desarrollo
 *
 * Protege las páginas /dev/* con una clave de acceso
 */

const DEV_ACCESS_COOKIE = 'dev_access_granted';
// ⚠️ SEGURIDAD: No usar fallback. En producción, NEXT_PUBLIC_DEV_ACCESS_KEY debe estar configurado.
const DEV_ACCESS_KEY = process.env.NEXT_PUBLIC_DEV_ACCESS_KEY;

/**
 * Verifica si el usuario tiene acceso a las páginas de desarrollo
 */
export function hasDevAccess(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const cookies = document.cookie.split(';');
  const devCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${DEV_ACCESS_COOKIE}=`)
  );

  return devCookie?.split('=')[1] === 'true';
}

/**
 * Valida una clave de acceso
 * ⚠️ SEGURIDAD: Si DEV_ACCESS_KEY no está configurado, deniega acceso
 */
export function validateDevKey(key: string): boolean {
  if (!DEV_ACCESS_KEY) {
    console.warn('⚠️ DEV_ACCESS_KEY no está configurado. Acceso denegado a páginas de desarrollo.');
    return false;
  }
  return key === DEV_ACCESS_KEY;
}

/**
 * Otorga acceso a las páginas de desarrollo
 */
export function grantDevAccess(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Cookie expira en 7 días
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  document.cookie = `${DEV_ACCESS_COOKIE}=true; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Revoca el acceso a las páginas de desarrollo
 */
export function revokeDevAccess(): void {
  if (typeof window === 'undefined') {
    return;
  }

  document.cookie = `${DEV_ACCESS_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

/**
 * Verifica acceso y redirige si es necesario
 * Usar solo en componentes cliente (use client)
 */
export function checkAndRedirectDevAccess(): {
  hasAccess: boolean;
  isChecking: boolean;
} {
  if (typeof window === 'undefined') {
    return { hasAccess: false, isChecking: true };
  }

  const hasAccess = hasDevAccess();

  // Si no tiene acceso y no está en la página de acceso, redirigir
  if (!hasAccess && !window.location.pathname.includes('/dev/access')) {
    window.location.href = '/dev/access';
    return { hasAccess: false, isChecking: true };
  }

  return { hasAccess, isChecking: false };
}
