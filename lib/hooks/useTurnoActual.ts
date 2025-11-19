'use client';

import { useState, useEffect } from 'react';
import { turnosService } from '@/lib/services';
import type { Turno } from '@/lib/types/firestore';

export function useTurnoActual() {
  const [turno, setTurno] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTurnoActual();
  }, []);

  const loadTurnoActual = async () => {
    try {
      setLoading(true);
      setError(null);
      const turnoActual = await turnosService.getTurnoActual();
      setTurno(turnoActual);
    } catch (err: any) {
      console.error('Error cargando turno actual:', err);
      setError(err?.message || 'Error al cargar el turno actual');
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    loadTurnoActual();
  };

  return {
    turno,
    loading,
    error,
    reload,
  };
}
