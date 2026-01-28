/**
 * Banner de "Próximamente" con Countdown
 * Old Texas BBQ - CRM
 *
 * Muestra un countdown hasta la fecha de activación de una feature
 */

'use client';

import { useFeatureFlag } from '@/lib/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

interface ComingSoonBannerProps {
  feature: FeatureFlagKey;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
}

/**
 * Banner que muestra countdown hasta la activación de una feature
 *
 * @example
 * <ComingSoonBanner
 *   feature="CLIP_PAYMENTS"
 *   title="Pagos con Tarjeta"
 *   description="Próximamente podrás pagar con tarjeta de crédito/débito"
 * />
 */
export function ComingSoonBanner({
  feature,
  title = 'Nueva Funcionalidad',
  description = 'Esta función estará disponible pronto',
  className,
  variant = 'default',
}: ComingSoonBannerProps) {
  const { isEnabled, timeRemaining, activationDate } = useFeatureFlag(feature);

  // Si ya está activa, no mostrar nada
  if (isEnabled) {
    return null;
  }

  // Formato del countdown
  const formatTime = () => {
    if (!timeRemaining) return null;

    const { days, hours, minutes, seconds } = timeRemaining;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const countdown = formatTime();

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1 rounded-full',
          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
          'text-sm font-medium',
          className
        )}
      >
        <Clock className="w-3 h-3" />
        <span>Disponible en {countdown}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-lg border border-amber-200 dark:border-amber-800',
          'bg-gradient-to-br from-amber-50 to-orange-50',
          'dark:from-amber-900/20 dark:to-orange-900/20',
          'p-6 text-center',
          className
        )}
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-800">
            <Sparkles className="w-8 h-8 text-amber-600 dark:text-amber-300" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
          {title}
        </h3>

        <p className="text-amber-700 dark:text-amber-300 mb-4">
          {description}
        </p>

        {countdown && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 inline-block">
            <p className="text-sm text-muted-foreground mb-1">Disponible en:</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
              {countdown}
            </p>
          </div>
        )}

        {activationDate && (
          <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-3">
            {activationDate}
          </p>
        )}
      </div>
    );
  }

  // Default banner
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-lg',
        'bg-gradient-to-r from-amber-100 to-orange-100',
        'dark:from-amber-900/30 dark:to-orange-900/30',
        'border border-amber-200 dark:border-amber-800',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-200/50 dark:bg-amber-800/50">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-300" />
        </div>
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-amber-100">
            {title}
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {description}
          </p>
        </div>
      </div>

      {countdown && (
        <div className="text-right">
          <p className="text-xs text-amber-600 dark:text-amber-400">Disponible en:</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-200 font-mono">
            {countdown}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Banner específico para el release semanal
 */
export function WeeklyReleaseBanner({ className }: { className?: string }) {
  return (
    <ComingSoonBanner
      feature="WEEK_RELEASE_JAN_31"
      title="Nuevas Funcionalidades"
      description="Se activarán automáticamente el viernes"
      variant="default"
      className={className}
    />
  );
}

/**
 * Banner específico para Clip Payments
 */
export function ClipPaymentComingSoon({ className }: { className?: string }) {
  return (
    <ComingSoonBanner
      feature="CLIP_PAYMENTS"
      title="Pagos con Tarjeta"
      description="Próximamente podrás pagar con tarjeta de crédito/débito"
      variant="card"
      className={className}
    />
  );
}
