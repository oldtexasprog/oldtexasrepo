import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración para Firebase/Firestore
      staleTime: 1000 * 60 * 5, // 5 minutos - Los datos se consideran frescos
      gcTime: 1000 * 60 * 30, // 30 minutos - Garbage collection
      retry: 3, // Reintentar 3 veces en caso de error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refetch al volver a la ventana
      refetchOnReconnect: true, // Refetch al reconectar
      refetchOnMount: true, // Refetch al montar componente
    },
    mutations: {
      retry: 1, // Reintentar mutations solo 1 vez
      retryDelay: 1000,
    },
  },
});
