/**
 * Componente Feature Gate
 * Old Texas BBQ - CRM
 *
 * Muestra u oculta contenido basándose en feature flags
 */

'use client';

import { ReactNode } from 'react';
import { useFeatureFlag } from '@/lib/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { Loader2 } from 'lucide-react';

type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

interface FeatureGateProps {
  feature: FeatureFlagKey;
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: boolean;
}

/**
 * Componente que muestra/oculta contenido basándose en un feature flag
 *
 * @example
 * <FeatureGate feature="CLIP_PAYMENTS">
 *   <ClipPaymentButton amount={100} />
 * </FeatureGate>
 */
export function FeatureGate({
  feature,
  children,
  fallback = null,
  showLoading = false,
}: FeatureGateProps) {
  const { isEnabled, isLoading } = useFeatureFlag(feature);

  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Gate específico para Clip Payments
 */
export function ClipPaymentGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <FeatureGate feature="CLIP_PAYMENTS" fallback={fallback}>
      {children}
    </FeatureGate>
  );
}
