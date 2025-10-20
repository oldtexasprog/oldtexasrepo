'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/lib/services/orderService';
import type { Pedido, EstadoPedido } from '@/lib/types';
import { toast } from 'sonner';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: {
    estado?: EstadoPedido;
    fecha?: Date;
    repartidor?: string;
  }) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  today: () => [...orderKeys.all, 'today'] as const,
};

/**
 * Hook para obtener todos los pedidos con opciones de filtrado
 */
export function useOrders(options?: {
  estado?: EstadoPedido;
  fecha?: Date;
  limit?: number;
}) {
  return useQuery({
    queryKey: orderKeys.list(options),
    queryFn: () => orderService.getAll(options),
    staleTime: 1000 * 30, // 30 segundos para lista de pedidos
  });
}

/**
 * Hook para obtener un pedido específico
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
}

/**
 * Hook para obtener pedidos de hoy
 */
export function useTodayOrders() {
  return useQuery({
    queryKey: orderKeys.today(),
    queryFn: () => orderService.getTodayOrders(),
    refetchInterval: 1000 * 60, // Refetch cada minuto
  });
}

/**
 * Hook para obtener pedidos de un repartidor
 */
export function useRepartidorOrders(repartidorId: string) {
  return useQuery({
    queryKey: [...orderKeys.all, 'repartidor', repartidorId],
    queryFn: () => orderService.getByRepartidor(repartidorId),
    enabled: !!repartidorId,
    refetchInterval: 1000 * 30, // Refetch cada 30 segundos
  });
}

/**
 * Hook para crear pedido
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>) =>
      orderService.create(data),
    onSuccess: (newOrderId) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.today() });
      toast.success('Pedido creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast.error('Error al crear pedido');
    },
  });
}

/**
 * Hook para actualizar pedido
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Pedido, 'id' | 'createdAt'>>;
    }) => orderService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });

      // Snapshot del valor anterior
      const previousOrder = queryClient.getQueryData(orderKeys.detail(id));

      // Actualización optimista
      queryClient.setQueryData(orderKeys.detail(id), (old: Pedido) => ({
        ...old,
        ...data,
      }));

      return { previousOrder };
    },
    onError: (error, { id }, context) => {
      // Rollback en caso de error
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousOrder);
      }
      toast.error('Error al actualizar pedido');
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Pedido actualizado');
    },
  });
}

/**
 * Hook para actualizar estado del pedido
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: EstadoPedido }) =>
      orderService.updateStatus(id, newStatus),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });
}

/**
 * Hook para eliminar pedido (soft delete)
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Pedido cancelado');
    },
    onError: () => {
      toast.error('Error al cancelar pedido');
    },
  });
}
