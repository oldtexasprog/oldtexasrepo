/**
 * Hook para Feature Flags
 * Old Texas BBQ - CRM
 *
 * Permite verificar feature flags con actualización en tiempo real
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FEATURE_FLAGS,
  checkFeature,
  getTimeUntilActivation,
  getActivationDateFormatted,
} from '@/lib/feature-flags';

type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

interface UseFeatureFlagReturn {
  isEnabled: boolean;
  isLoading: boolean;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  activationDate: string | null;
}

/**
 * Hook para verificar si una feature flag está activa
 * Actualiza automáticamente cuando llega la fecha de activación
 */
export function useFeatureFlag(flagKey: FeatureFlagKey): UseFeatureFlagReturn {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<UseFeatureFlagReturn['timeRemaining']>(null);

  // Verificar el estado de la feature
  const checkStatus = useCallback(() => {
    const enabled = checkFeature(flagKey);
    setIsEnabled(enabled);
    setIsLoading(false);

    if (!enabled) {
      const remaining = getTimeUntilActivation(flagKey);
      setTimeRemaining(remaining);
    } else {
      setTimeRemaining(null);
    }
  }, [flagKey]);

  useEffect(() => {
    // Verificar inmediatamente
    checkStatus();

    // Si no está activa y tiene fecha de activación, actualizar cada segundo
    const flag = FEATURE_FLAGS[flagKey];
    if (flag?.activationDate) {
      const interval = setInterval(() => {
        checkStatus();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [flagKey, checkStatus]);

  return {
    isEnabled,
    isLoading,
    timeRemaining,
    activationDate: getActivationDateFormatted(flagKey),
  };
}

/**
 * Hook para el countdown del release semanal
 */
export function useWeeklyReleaseCountdown() {
  return useFeatureFlag('WEEK_RELEASE_JAN_31');
}

/**
 * Hook específico para Clip Payments
 */
export function useClipPaymentsFlag() {
  return useFeatureFlag('CLIP_PAYMENTS');
}
