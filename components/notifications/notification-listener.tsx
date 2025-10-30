'use client';

import { useEffect, useRef } from 'react';
import { notificacionesService } from '@/lib/services/notificaciones.service';
import { Notificacion } from '@/lib/types/firestore';
import { toast } from 'sonner';
import {
  Bell,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

// Mapa de iconos según tipo de notificación
const NOTIFICATION_ICONS = {
  nuevo_pedido: ShoppingCart,
  pedido_listo: CheckCircle,
  pedido_entregado: CheckCircle,
  pedido_cancelado: AlertCircle,
  alerta: AlertCircle,
  info: Info,
};

export function NotificationListener() {
  const processedNotifications = useRef<Set<string>>(new Set());
  const isInitialized = useRef(false);

  useEffect(() => {
    console.log('🔔 NotificationListener montado');

    // Listener para notificaciones en tiempo real
    const unsubscribe = notificacionesService.listenToRealtime(
      (notificaciones: Notificacion[]) => {
        console.log(
          `📨 Notificaciones recibidas: ${notificaciones.length}`,
          notificaciones
        );

        // En la primera carga, solo registrar las notificaciones existentes sin mostrarlas
        if (!isInitialized.current) {
          notificaciones.forEach((notif) => {
            processedNotifications.current.add(notif.id);
          });
          isInitialized.current = true;
          console.log(
            '✅ NotificationListener inicializado. Notificaciones existentes registradas.'
          );
          return;
        }

        // Procesar solo notificaciones nuevas (no leídas y no procesadas)
        notificaciones
          .filter(
            (notif) =>
              !notif.leida && !processedNotifications.current.has(notif.id)
          )
          .forEach((notif) => {
            // Marcar como procesada
            processedNotifications.current.add(notif.id);

            // Mostrar toast
            mostrarNotificacion(notif);

            // Marcar como leída después de mostrarla
            setTimeout(() => {
              notificacionesService.marcarComoLeida(notif.id);
            }, 1000);
          });
      },
      {
        limit: 50,
        orderBy: { field: 'fechaCreacion', direction: 'desc' },
      }
    );

    return () => {
      console.log('🔕 NotificationListener desmontado');
      unsubscribe();
    };
  }, []);

  return null; // Este componente no renderiza nada
}

// Función para mostrar la notificación como toast
function mostrarNotificacion(notif: Notificacion) {
  const IconComponent = NOTIFICATION_ICONS[notif.tipo] || Bell;

  console.log('🎉 Mostrando notificación:', notif.titulo);

  // Mostrar toast con Sonner
  toast(notif.titulo, {
    description: notif.mensaje,
    icon: <IconComponent className="h-5 w-5" />,
    duration: 5000,
    // Sonido de notificación (opcional)
    onAutoClose: () => {
      console.log('✅ Notificación cerrada:', notif.id);
    },
  });

  // Reproducir sonido de notificación (opcional)
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch((err) => {
      // Ignorar errores de reproducción (puede fallar si el usuario no ha interactuado)
      console.log('No se pudo reproducir el sonido:', err.message);
    });
  } catch (error) {
    // Ignorar si no existe el archivo de sonido
  }
}
