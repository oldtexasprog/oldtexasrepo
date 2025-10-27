/**
 * React Query Hooks para Productos
 * Old Texas BBQ - CRM
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '@/lib/services';
import type { Producto, NuevoProducto } from '@/lib/types/firestore';
import { useEffect, useState } from 'react';

// Query Keys
export const productosKeys = {
  all: ['productos'] as const,
  lists: () => [...productosKeys.all, 'list'] as const,
  list: (filters?: any) => [...productosKeys.lists(), filters] as const,
  details: () => [...productosKeys.all, 'detail'] as const,
  detail: (id: string) => [...productosKeys.details(), id] as const,
  byCategoria: (categoriaId: string) => [...productosKeys.all, 'categoria', categoriaId] as const,
  disponibles: () => [...productosKeys.all, 'disponibles'] as const,
  top: (limit: number) => [...productosKeys.all, 'top', limit] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

export function useProductos() {
  return useQuery({
    queryKey: productosKeys.lists(),
    queryFn: () => productosService.getAll(),
  });
}

export function useProducto(productoId: string) {
  return useQuery({
    queryKey: productosKeys.detail(productoId),
    queryFn: () => productosService.getById(productoId),
    enabled: !!productoId,
  });
}

export function useProductosDisponibles() {
  return useQuery({
    queryKey: productosKeys.disponibles(),
    queryFn: () => productosService.getDisponiblesOrdenadosPorMenu(),
  });
}

export function useProductosByCategoria(categoriaId: string) {
  return useQuery({
    queryKey: productosKeys.byCategoria(categoriaId),
    queryFn: () => productosService.getByCategoria(categoriaId),
    enabled: !!categoriaId,
  });
}

export function useTopProductos(limit: number = 10) {
  return useQuery({
    queryKey: productosKeys.top(limit),
    queryFn: () => productosService.getTopProductos(limit),
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: NuevoProducto) => productosService.create(producto as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
    },
  });
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Producto> }) =>
      productosService.update(id, data as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
    },
  });
}

export function useToggleDisponibilidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, disponible }: { id: string; disponible: boolean }) =>
      productosService.toggleDisponibilidad(id, disponible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
    },
  });
}

// ============================================================================
// REAL-TIME HOOKS
// ============================================================================

export function useProductosDisponiblesRealTime() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = productosService.onProductosDisponiblesChange((data) => {
      setProductos(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { productos, loading };
}
