/**
 * Hook useNotificationPermission
 * Old Texas BBQ - CRM
 *
 * Gestiona el estado de permisos de notificaciones
 * y proporciona funciones para activarlas
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  requestNotificationPermission,
  isNotificationSupported,
  getNotificationPermissionStatus,
  areNotificationsEnabled,
  initializeFCM,
} from '@/lib/notifications/fcm';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface NotificationPermissionState {
  /** Si el navegador soporta notificaciones */
  supported: boolean;

  /** Estado actual del permiso: 'granted', 'denied', 'default' */
  permission: NotificationPermission;

  /** Si las notificaciones están habilitadas (granted) */
  enabled: boolean;

  /** Si se está solicitando permiso actualmente */
  requesting: boolean;

  /** Si se está inicializando FCM */
  initializing: boolean;

  /** Error si hubo alguno */
  error: string | null;
}

export interface NotificationPermissionActions {
  /** Solicita permiso para notificaciones */
  requestPermission: () => Promise<boolean>;

  /** Verifica y actualiza el estado */
  checkPermission: () => void;

  /** Inicializa FCM para el usuario actual */
  enableNotifications: () => Promise<boolean>;
}

/**
 * Hook que gestiona el estado de permisos de notificaciones
 *
 * @example
 * ```tsx
 * const { state, actions } = useNotificationPermission();
 *
 * if (!state.enabled && state.supported) {
 *   return (
 *     <Button onClick={actions.enableNotifications}>
 *       Activar Notificaciones
 *     </Button>
 *   );
 * }
 * ```
 */
export function useNotificationPermission(): {
  state: NotificationPermissionState;
  actions: NotificationPermissionActions;
} {
  const { user } = useAuth();

  const [state, setState] = useState<NotificationPermissionState>({
    supported: false,
    permission: 'default',
    enabled: false,
    requesting: false,
    initializing: false,
    error: null,
  });

  /**
   * Verifica y actualiza el estado de permisos
   */
  const checkPermission = useCallback(() => {
    const supported = isNotificationSupported();
    const permission = getNotificationPermissionStatus();
    const enabled = areNotificationsEnabled();

    setState((prev) => ({
      ...prev,
      supported,
      permission,
      enabled,
      error: supported ? null : 'Notificaciones no soportadas en este navegador',
    }));
  }, []);

  /**
   * Solicita permiso para notificaciones
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isNotificationSupported()) {
      toast.error('Tu navegador no soporta notificaciones');
      return false;
    }

    setState((prev) => ({ ...prev, requesting: true, error: null }));

    try {
      const granted = await requestNotificationPermission();

      if (granted) {
        toast.success('Notificaciones activadas', {
          description: 'Ahora recibirás notificaciones de pedidos y alertas',
        });

        // Actualizar estado
        checkPermission();
        return true;
      } else {
        // El usuario negó el permiso o ya estaba denegado
        setState((prev) => ({
          ...prev,
          error:
            state.permission === 'denied'
              ? 'Notificaciones bloqueadas. Habilítalas en la configuración del navegador.'
              : 'Permiso denegado',
        }));

        return false;
      }
    } catch (error: any) {
      console.error('Error al solicitar permiso:', error);
      setState((prev) => ({
        ...prev,
        error: 'Error al solicitar permisos de notificación',
      }));
      toast.error('Error al activar notificaciones');
      return false;
    } finally {
      setState((prev) => ({ ...prev, requesting: false }));
    }
  }, [checkPermission, state.permission]);

  /**
   * Inicializa FCM completo (solicita permisos + obtiene token + guarda)
   */
  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast.error('Debes iniciar sesión para activar notificaciones');
      return false;
    }

    setState((prev) => ({ ...prev, initializing: true, error: null }));

    try {
      // Inicializar FCM (solicita permisos, obtiene token, y lo guarda)
      const token = await initializeFCM(user.uid);

      if (token) {
        toast.success('Notificaciones configuradas correctamente', {
          description: 'Recibirás alertas de pedidos en tiempo real',
        });

        // Actualizar estado
        checkPermission();
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: 'No se pudo obtener el token de notificaciones',
        }));
        toast.error('Error al configurar notificaciones');
        return false;
      }
    } catch (error: any) {
      console.error('Error al inicializar FCM:', error);
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al configurar notificaciones',
      }));
      toast.error('Error al configurar notificaciones');
      return false;
    } finally {
      setState((prev) => ({ ...prev, initializing: false }));
    }
  }, [user, checkPermission]);

  /**
   * Verificar estado inicial y escuchar cambios
   */
  useEffect(() => {
    // Verificar estado inicial
    checkPermission();

    // Escuchar cambios en el estado de permisos
    // (El navegador puede cambiar el permiso en cualquier momento)
    const interval = setInterval(checkPermission, 5000); // Cada 5 segundos

    return () => {
      clearInterval(interval);
    };
  }, [checkPermission]);

  /**
   * Auto-inicializar FCM si el usuario ya dio permiso previamente
   */
  useEffect(() => {
    if (user && state.enabled && !state.initializing) {
      // Si las notificaciones ya están habilitadas, asegurar que FCM esté inicializado
      initializeFCM(user.uid).catch((error) => {
        console.error('Error al auto-inicializar FCM:', error);
      });
    }
  }, [user, state.enabled, state.initializing]);

  return {
    state,
    actions: {
      requestPermission,
      checkPermission,
      enableNotifications,
    },
  };
}
