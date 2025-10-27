/**
 * React Query Hooks para Pedidos
 * Old Texas BBQ - CRM
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidosService } from '@/lib/services';
import type {
  Pedido,
  ItemPedido,
  EstadoPedido,
  NuevoPedido,
  PedidoConDatos,
} from '@/lib/types/firestore';
import { useEffect, useState } from 'react';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const pedidosKeys = {
  all: ['pedidos'] as const,
  lists: () => [...pedidosKeys.all, 'list'] as const,
  list: (filters?: any) => [...pedidosKeys.lists(), filters] as const,
  details: () => [...pedidosKeys.all, 'detail'] as const,
  detail: (id: string) => [...pedidosKeys.details(), id] as const,
  byEstado: (estado: EstadoPedido) => [...pedidosKeys.all, 'estado', estado] as const,
  byTurno: (turnoId: string) => [...pedidosKeys.all, 'turno', turnoId] as const,
  byRepartidor: (repartidorId: string) => [...pedidosKeys.all, 'repartidor', repartidorId] as const,
  hoy: () => [...pedidosKeys.all, 'hoy'] as const,
  estadisticas: () => [...pedidosKeys.all, 'estadisticas'] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Obtiene todos los pedidos
 */
export function usePedidos() {
  return useQuery({
    queryKey: pedidosKeys.lists(),
    queryFn: () => pedidosService.getAll(),
  });
}

/**
 * Obtiene un pedido por ID
 */
export function usePedido(pedidoId: string) {
  return useQuery({
    queryKey: pedidosKeys.detail(pedidoId),
    queryFn: () => pedidosService.getById(pedidoId),
    enabled: !!pedidoId,
  });
}

/**
 * Obtiene un pedido con sus items
 */
export function usePedidoConItems(pedidoId: string) {
  return useQuery({
    queryKey: [...pedidosKeys.detail(pedidoId), 'items'],
    queryFn: () => pedidosService.getPedidoConItems(pedidoId),
    enabled: !!pedidoId,
  });
}

/**
 * Obtiene pedidos por estado
 */
export function usePedidosByEstado(estado: EstadoPedido) {
  return useQuery({
    queryKey: pedidosKeys.byEstado(estado),
    queryFn: () => pedidosService.getByEstado(estado),
  });
}

/**
 * Obtiene pedidos del día actual
 */
export function usePedidosHoy() {
  return useQuery({
    queryKey: pedidosKeys.hoy(),
    queryFn: () => pedidosService.getPedidosHoy(),
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

/**
 * Obtiene pedidos de un turno
 */
export function usePedidosByTurno(turnoId: string) {
  return useQuery({
    queryKey: pedidosKeys.byTurno(turnoId),
    queryFn: () => pedidosService.getByTurno(turnoId),
    enabled: !!turnoId,
  });
}

/**
 * Obtiene pedidos de un repartidor
 */
export function usePedidosByRepartidor(repartidorId: string) {
  return useQuery({
    queryKey: pedidosKeys.byRepartidor(repartidorId),
    queryFn: () => pedidosService.getByRepartidor(repartidorId),
    enabled: !!repartidorId,
  });
}

/**
 * Obtiene estadísticas de pedidos del día
 */
export function useEstadisticasPedidos() {
  return useQuery({
    queryKey: pedidosKeys.estadisticas(),
    queryFn: () => pedidosService.getEstadisticasHoy(),
    refetchInterval: 60000, // Refetch cada minuto
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Crea un pedido completo con items
 */
export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pedido,
      items,
    }: {
      pedido: Omit<NuevoPedido, 'numeroPedido'>;
      items: Omit<ItemPedido, 'id'>[];
    }) => pedidosService.crearPedidoCompleto(pedido, items),
    onSuccess: () => {
      // Invalidar todas las queries de pedidos
      queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
    },
  });
}

/**
 * Actualiza el estado de un pedido
 */
export function useActualizarEstadoPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pedidoId,
      nuevoEstado,
      usuarioId,
      usuarioNombre,
      detalles,
    }: {
      pedidoId: string;
      nuevoEstado: EstadoPedido;
      usuarioId: string;
      usuarioNombre: string;
      detalles?: string;
    }) =>
      pedidosService.actualizarEstado(
        pedidoId,
        nuevoEstado,
        usuarioId,
        usuarioNombre,
        detalles
      ),
    onSuccess: (_, variables) => {
      // Invalidar pedido específico y listas
      queryClient.invalidateQueries({ queryKey: pedidosKeys.detail(variables.pedidoId) });
      queryClient.invalidateQueries({ queryKey: pedidosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pedidosKeys.estadisticas() });
    },
  });
}

/**
 * Asigna un repartidor a un pedido
 */
export function useAsignarRepartidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pedidoId,
      repartidorId,
      repartidorNombre,
      comision,
      usuarioId,
      usuarioNombre,
    }: {
      pedidoId: string;
      repartidorId: string;
      repartidorNombre: string;
      comision: number;
      usuarioId: string;
      usuarioNombre: string;
    }) =>
      pedidosService.asignarRepartidor(
        pedidoId,
        repartidorId,
        repartidorNombre,
        comision,
        usuarioId,
        usuarioNombre
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pedidosKeys.detail(variables.pedidoId) });
      queryClient.invalidateQueries({ queryKey: pedidosKeys.lists() });
    },
  });
}

/**
 * Cancela un pedido
 */
export function useCancelarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pedidoId,
      motivo,
      usuarioId,
      usuarioNombre,
    }: {
      pedidoId: string;
      motivo: string;
      usuarioId: string;
      usuarioNombre: string;
    }) => pedidosService.cancelar(pedidoId, motivo, usuarioId, usuarioNombre),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pedidosKeys.detail(variables.pedidoId) });
      queryClient.invalidateQueries({ queryKey: pedidosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pedidosKeys.estadisticas() });
    },
  });
}

/**
 * Liquida pedidos de un repartidor
 */
export function useLiquidarPedidos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pedidoIds,
      usuarioId,
    }: {
      pedidoIds: string[];
      usuarioId: string;
    }) => pedidosService.liquidarPedidos(pedidoIds, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
    },
  });
}

// ============================================================================
// REAL-TIME HOOKS
// ============================================================================

/**
 * Escucha pedidos por estado en tiempo real
 */
export function usePedidosRealTime(estado: EstadoPedido) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = pedidosService.onPedidosByEstadoChange(
      estado,
      (data) => {
        setPedidos(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [estado]);

  return { pedidos, loading, error };
}

/**
 * Escucha pedidos de cocina en tiempo real
 */
export function usePedidosCocinaRealTime() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = pedidosService.onPedidosCocinaChange(
      (data) => {
        setPedidos(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { pedidos, loading, error };
}

/**
 * Escucha un pedido específico en tiempo real
 */
export function usePedidoRealTime(pedidoId: string) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pedidoId) return;

    setLoading(true);
    const unsubscribe = pedidosService.onDocumentChange(
      pedidoId,
      (data) => {
        setPedido(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [pedidoId]);

  return { pedido, loading, error };
}
