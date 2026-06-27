/**
 * useConceptosFinancieros
 * Old Texas BBQ - CRM
 *
 * React Query wrapper para la colección ConceptosFinancieros.
 * Usado por RegistroMovimiento para renderizar el Select de conceptos.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getConceptosPorTipo,
  getTodosLosConceptos,
} from '@/lib/services/conceptosFinancieros.service';

export const conceptosKeys = {
  porTipo: (tipo: 'ingreso' | 'egreso') => ['conceptos-financieros', tipo] as const,
  todos: ['conceptos-financieros', 'todos'] as const,
};

/** Conceptos activos por tipo (para el select en RegistroMovimiento). */
export function useConceptosPorTipo(tipo: 'ingreso' | 'egreso') {
  return useQuery({
    queryKey: conceptosKeys.porTipo(tipo),
    queryFn: () => getConceptosPorTipo(tipo),
    staleTime: 5 * 60_000, // 5 min — los conceptos cambian poco
  });
}

/** Todos los conceptos (para panel de administración). */
export function useTodosLosConceptos() {
  return useQuery({
    queryKey: conceptosKeys.todos,
    queryFn: () => getTodosLosConceptos(),
    staleTime: 5 * 60_000,
  });
}
