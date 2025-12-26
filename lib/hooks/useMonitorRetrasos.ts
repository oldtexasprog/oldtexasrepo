/**
 * Hook para Monitoreo de Pedidos Retrasados
 * Old Texas BBQ - CRM
 *
 * Ejecuta verificación periódica de pedidos con más de 30 minutos
 * y notifica automáticamente a encargado
 */

'use client';

import { useEffect, useRef } from 'react';
import { pedidosService } from '@/lib/services/pedidos.service';

interface UseMonitorRetrasosOptions {
  /**
   * Intervalo de verificación en milisegundos
   * @default 600000 (10 minutos)
   */
  intervalo?: number;

  /**
   * Si el monitoreo está habilitado
   * @default true
   */
  habilitado?: boolean;

  /**
   * Callback cuando se detectan retrasos
   */
  onRetrasosDetectados?: (cantidad: number) => void;
}

/**
 * Hook que monitorea pedidos retrasados y notifica automáticamente
 *
 * @example
 * ```tsx
 * // En tu layout principal o componente raíz
 * useMonitorRetrasos({
 *   intervalo: 600000, // 10 minutos
 *   habilitado: true,
 *   onRetrasosDetectados: (cantidad) => {
 *     console.log(`${cantidad} pedidos retrasados detectados`);
 *   }
 * });
 * ```
 */
export function useMonitorRetrasos(options: UseMonitorRetrasosOptions = {}) {
  const {
    intervalo = 600000, // 10 minutos por defecto
    habilitado = true,
    onRetrasosDetectados,
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!habilitado) {
      // Limpiar intervalo si está deshabilitado
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Función de verificación
    const verificarRetrasos = async () => {
      try {
        console.log('🔍 Verificando pedidos retrasados...');
        await pedidosService.verificarYNotificarRetrasos();

        // Si hay callback, llamarlo (puedes modificar para pasar la cantidad)
        if (onRetrasosDetectados) {
          onRetrasosDetectados(0); // TODO: Obtener cantidad real de pedidos retrasados
        }
      } catch (error) {
        console.error('❌ Error en monitoreo de retrasos:', error);
      }
    };

    // Ejecutar inmediatamente al montar
    verificarRetrasos();

    // Configurar intervalo
    intervalRef.current = setInterval(verificarRetrasos, intervalo);

    // Limpiar al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [intervalo, habilitado, onRetrasosDetectados]);

  // Método manual para forzar verificación
  const verificarAhora = async () => {
    try {
      await pedidosService.verificarYNotificarRetrasos();
    } catch (error) {
      console.error('Error al verificar retrasos:', error);
    }
  };

  return {
    verificarAhora,
  };
}
