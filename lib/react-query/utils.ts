import { queryClient } from './client';
import type { EstadoPedido } from '@/lib/types';

/**
 * Utilidades para manejar cache de TanStack Query
 */

/**
 * Prefetch de datos para mejor UX
 */
export async function prefetchOrders(filters?: {
  estado?: EstadoPedido;
  fecha?: Date;
  repartidor?: string;
}) {
  const { orderKeys } = await import('@/lib/hooks/useOrders');
  const { orderService } = await import('@/lib/services/orderService');

  await queryClient.prefetchQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderService.getAll(filters),
  });
}

/**
 * Invalida todas las queries de pedidos
 */
export function invalidateAllOrders() {
  const { orderKeys } = require('@/lib/hooks/useOrders');
  queryClient.invalidateQueries({ queryKey: orderKeys.all });
}

/**
 * Invalidar query específica por ID
 */
export function invalidateOrder(id: string) {
  const { orderKeys } = require('@/lib/hooks/useOrders');
  queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
}

/**
 * Actualización optimista manual
 */
export function updateOrderInCache(id: string, updater: (old: any) => any) {
  const { orderKeys } = require('@/lib/hooks/useOrders');
  queryClient.setQueryData(orderKeys.detail(id), updater);
}

/**
 * Limpiar cache antiguo
 */
export function clearOldCache() {
  queryClient.clear();
}

/**
 * Obtener datos del cache sin hacer fetch
 */
export function getOrderFromCache(id: string) {
  const { orderKeys } = require('@/lib/hooks/useOrders');
  return queryClient.getQueryData(orderKeys.detail(id));
}
