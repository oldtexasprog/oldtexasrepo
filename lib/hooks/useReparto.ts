'use client';

import { useState, useEffect, useCallback } from 'react';
import { pedidosService } from '@/lib/services/pedidos.service';
import { notificacionesService } from '@/lib/services/notificaciones.service';
import type { Pedido, EstadoReparto } from '@/lib/types/firestore';
import { useAuth } from '@/lib/auth/useAuth';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

export function useReparto() {
  const { userData } = useAuth();
  const [pedidosListos, setPedidosListos] = useState<Pedido[]>([]);
  const [misPedidos, setMisPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Cargar pedidos listos para recoger (sin repartidor asignado)
  useEffect(() => {
    if (!userData) return;

    const unsubscribe = pedidosService.onPedidosListosParaRecoger((pedidos) => {
      setPedidosListos(pedidos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  // Cargar mis pedidos asignados
  useEffect(() => {
    if (!userData) return;

    const unsubscribe = pedidosService.onPedidosAsignadosARepartidor(
      userData.id,
      (pedidos) => {
        setMisPedidos(pedidos);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userData]);

  // Aceptar un pedido (asignarse como repartidor)
  const aceptarPedido = useCallback(
    async (pedidoId: string) => {
      if (!userData) {
        toast.error('No se puede aceptar el pedido. Usuario no autenticado.');
        return;
      }

      setActionLoading(true);
      try {
        // Asignar repartidor al pedido
        await pedidosService.asignarRepartidor(
          pedidoId,
          userData.id,
          `${userData.nombre} ${userData.apellido}`,
          0, // TODO: Calcular comisión según configuración
          userData.id,
          userData.nombre
        );

        // Actualizar estado del pedido a "en_reparto"
        await pedidosService.actualizarEstado(pedidoId, 'en_reparto', userData.id, userData.nombre);

        // Notificar a cajera
        await notificacionesService.crearParaRol(
          'cajera',
          'info',
          '🛵 Pedido Asignado',
          `${userData.nombre} aceptó el pedido y está en camino`,
          'normal',
          pedidoId
        );

        toast.success('Pedido aceptado exitosamente');
      } catch (error: any) {
        console.error('Error al aceptar pedido:', error);
        toast.error(error.message || 'Error al aceptar el pedido');
      } finally {
        setActionLoading(false);
      }
    },
    [userData]
  );

  // Marcar pedido como entregado
  const marcarComoEntregado = useCallback(
    async (pedidoId: string) => {
      if (!userData) {
        toast.error('No se puede marcar como entregado. Usuario no autenticado.');
        return;
      }

      setActionLoading(true);
      try {
        const pedido = misPedidos.find((p) => p.id === pedidoId);
        if (!pedido) {
          throw new Error('Pedido no encontrado');
        }

        // Actualizar estado a entregado
        await pedidosService.actualizarEstado(pedidoId, 'entregado', userData.id, userData.nombre);

        // Actualizar estado de reparto
        if (pedido.reparto) {
          await pedidosService.update(pedidoId, {
            'reparto.estadoReparto': 'entregado',
            'reparto.horaEntrega': Timestamp.now(),
          } as any);
        }

        // Notificar a cajera
        await notificacionesService.crearParaRol(
          'cajera',
          'pedido_entregado',
          '✅ Pedido Entregado',
          `Pedido #${pedido.numeroPedido} entregado por ${userData.nombre}`,
          'normal',
          pedidoId
        );

        toast.success('Pedido marcado como entregado');
      } catch (error: any) {
        console.error('Error al marcar como entregado:', error);
        toast.error(error.message || 'Error al marcar el pedido como entregado');
      } finally {
        setActionLoading(false);
      }
    },
    [userData, misPedidos]
  );

  // Reportar incidencia
  const reportarIncidencia = useCallback(
    async (pedidoId: string) => {
      if (!userData) {
        toast.error('No se puede reportar incidencia. Usuario no autenticado.');
        return;
      }

      const motivo = window.prompt(
        '¿Qué incidencia quieres reportar?\n(Ej: Cliente no responde, dirección incorrecta, etc.)'
      );

      if (!motivo || motivo.trim() === '') {
        return; // Usuario canceló
      }

      setActionLoading(true);
      try {
        const pedido = misPedidos.find((p) => p.id === pedidoId);
        if (!pedido) {
          throw new Error('Pedido no encontrado');
        }

        // Agregar observación interna
        await pedidosService.update(pedidoId, {
          observacionesInternas: `[INCIDENCIA - ${userData.nombre}] ${motivo}`,
        });

        // Notificar a encargado/admin
        await notificacionesService.crearParaRol(
          'encargado',
          'alerta',
          '⚠️ Incidencia Reportada',
          `${userData.nombre} reportó: "${motivo}" en pedido #${pedido.numeroPedido}`,
          'alta',
          pedidoId
        );

        await notificacionesService.crearParaRol(
          'admin',
          'alerta',
          '⚠️ Incidencia Reportada',
          `${userData.nombre} reportó: "${motivo}" en pedido #${pedido.numeroPedido}`,
          'alta',
          pedidoId
        );

        toast.success('Incidencia reportada al encargado');
      } catch (error: any) {
        console.error('Error al reportar incidencia:', error);
        toast.error(error.message || 'Error al reportar la incidencia');
      } finally {
        setActionLoading(false);
      }
    },
    [userData, misPedidos]
  );

  return {
    pedidosListos,
    misPedidos,
    loading,
    actionLoading,
    aceptarPedido,
    marcarComoEntregado,
    reportarIncidencia,
  };
}
