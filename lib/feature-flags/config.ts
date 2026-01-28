/**
 * Configuración de Feature Flags
 * Old Texas BBQ - CRM
 *
 * Sistema para controlar la activación de funcionalidades por fecha/hora
 *
 * Variables de entorno:
 * - NEXT_PUBLIC_FEATURE_ACTIVATION_DATE: Fecha de activación (ISO 8601)
 * - NEXT_PUBLIC_FEATURE_FLAGS_OVERRIDE: Lista de flags a activar manualmente
 * - NEXT_PUBLIC_FEATURE_FLAGS_ENABLED: "true" para activar todo inmediatamente
 */

export interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  activationDate?: Date; // Fecha de activación automática
  expirationDate?: Date; // Fecha de expiración (opcional)
}

/**
 * Zona horaria de México (Central)
 */
const TIMEZONE = 'America/Mexico_City';

/**
 * Obtiene la fecha de activación desde variable de entorno o usa default
 * Formato: ISO 8601 (ej: 2026-01-31T17:00:00-06:00)
 */
function getActivationDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_FEATURE_ACTIVATION_DATE;

  if (envDate) {
    const parsed = new Date(envDate);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    console.warn('NEXT_PUBLIC_FEATURE_ACTIVATION_DATE inválida, usando default');
  }

  // Default: Viernes 31 de Enero 2026 a las 5:00 PM (hora de México)
  return new Date('2026-01-31T17:00:00-06:00');
}

/**
 * Verifica si todas las features están habilitadas globalmente
 */
function isGloballyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FEATURE_FLAGS_ENABLED === 'true';
}

const ACTIVATION_DATE = getActivationDate();

/**
 * Definición de todas las feature flags del sistema
 */
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Integración de pagos con Clip
  CLIP_PAYMENTS: {
    name: 'clip_payments',
    description: 'Integración de pagos con tarjeta via Clip',
    enabled: isGloballyEnabled(),
    activationDate: ACTIVATION_DATE,
  },

  // Nuevos manuales de usuario
  USER_MANUALS: {
    name: 'user_manuals',
    description: 'Acceso a manuales de usuario en la documentación',
    enabled: isGloballyEnabled(),
    activationDate: ACTIVATION_DATE,
  },

  // Todas las nuevas funcionalidades de esta semana
  WEEK_RELEASE_JAN_31: {
    name: 'week_release_jan_31',
    description: 'Release semanal del 31 de enero 2026',
    enabled: isGloballyEnabled(),
    activationDate: ACTIVATION_DATE,
  },
};

/**
 * Verifica si una feature flag está activa
 * Considera tanto el estado `enabled` como la fecha de activación
 */
export function isFeatureEnabled(flagKey: keyof typeof FEATURE_FLAGS): boolean {
  const flag = FEATURE_FLAGS[flagKey];

  if (!flag) {
    console.warn(`Feature flag '${flagKey}' no existe`);
    return false;
  }

  // Si está explícitamente habilitada, retornar true
  if (flag.enabled) {
    return true;
  }

  // Verificar si ya pasó la fecha de activación
  if (flag.activationDate) {
    const now = new Date();
    if (now >= flag.activationDate) {
      return true;
    }
  }

  // Verificar si ya expiró
  if (flag.expirationDate) {
    const now = new Date();
    if (now > flag.expirationDate) {
      return false;
    }
  }

  return false;
}

/**
 * Obtiene el tiempo restante hasta la activación de una feature
 * Retorna null si ya está activa o no tiene fecha de activación
 */
export function getTimeUntilActivation(flagKey: keyof typeof FEATURE_FLAGS): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} | null {
  const flag = FEATURE_FLAGS[flagKey];

  if (!flag || !flag.activationDate) {
    return null;
  }

  if (isFeatureEnabled(flagKey)) {
    return null;
  }

  const now = new Date();
  const diff = flag.activationDate.getTime() - now.getTime();

  if (diff <= 0) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, totalMs: diff };
}

/**
 * Formatea la fecha de activación para mostrar
 */
export function getActivationDateFormatted(flagKey: keyof typeof FEATURE_FLAGS): string | null {
  const flag = FEATURE_FLAGS[flagKey];

  if (!flag || !flag.activationDate) {
    return null;
  }

  return flag.activationDate.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
  });
}

/**
 * Override manual via variable de entorno
 * Útil para testing o activación de emergencia
 *
 * FEATURE_FLAGS_OVERRIDE=clip_payments,user_manuals
 */
export function isFeatureOverridden(flagKey: keyof typeof FEATURE_FLAGS): boolean {
  if (typeof process === 'undefined') return false;

  const overrides = process.env.NEXT_PUBLIC_FEATURE_FLAGS_OVERRIDE || '';
  const flag = FEATURE_FLAGS[flagKey];

  return overrides.split(',').includes(flag.name);
}

/**
 * Verifica si una feature está activa (incluyendo overrides)
 */
export function checkFeature(flagKey: keyof typeof FEATURE_FLAGS): boolean {
  // Primero verificar override manual
  if (isFeatureOverridden(flagKey)) {
    return true;
  }

  // Luego verificar la configuración normal
  return isFeatureEnabled(flagKey);
}
