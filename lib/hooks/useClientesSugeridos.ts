'use client';

import { useState, useEffect } from 'react';
import { ClientePedido } from '@/lib/types/firestore';

const STORAGE_KEY = 'clientes-recientes';
const MAX_CLIENTES = 50; // Mantener últimos 50 clientes

interface ClienteGuardado extends ClientePedido {
  ultimaVez: string; // ISO timestamp
  vecesUsado: number;
}

export function useClientesSugeridos() {
  const [clientes, setClientes] = useState<ClienteGuardado[]>([]);

  // Cargar clientes del localStorage al montar
  useEffect(() => {
    try {
      const clientesGuardados = localStorage.getItem(STORAGE_KEY);
      if (clientesGuardados) {
        const parsed = JSON.parse(clientesGuardados);
        setClientes(parsed);
      }
    } catch (error) {
      console.error('Error cargando clientes guardados:', error);
    }
  }, []);

  // Guardar un cliente (al crear pedido)
  const guardarCliente = (cliente: ClientePedido) => {
    try {
      // Buscar si el cliente ya existe (por teléfono)
      const clienteExistenteIndex = clientes.findIndex(
        (c) => c.telefono === cliente.telefono
      );

      let nuevosClientes: ClienteGuardado[];

      if (clienteExistenteIndex !== -1) {
        // Cliente ya existe, actualizar sus datos y vecesUsado
        nuevosClientes = [...clientes];
        nuevosClientes[clienteExistenteIndex] = {
          ...cliente,
          ultimaVez: new Date().toISOString(),
          vecesUsado: clientes[clienteExistenteIndex].vecesUsado + 1,
        };
      } else {
        // Cliente nuevo, agregarlo
        const nuevoCliente: ClienteGuardado = {
          ...cliente,
          ultimaVez: new Date().toISOString(),
          vecesUsado: 1,
        };
        nuevosClientes = [nuevoCliente, ...clientes];
      }

      // Ordenar por última vez usado (más recientes primero)
      nuevosClientes.sort(
        (a, b) =>
          new Date(b.ultimaVez).getTime() - new Date(a.ultimaVez).getTime()
      );

      // Limitar a MAX_CLIENTES
      if (nuevosClientes.length > MAX_CLIENTES) {
        nuevosClientes = nuevosClientes.slice(0, MAX_CLIENTES);
      }

      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosClientes));
      setClientes(nuevosClientes);
    } catch (error) {
      console.error('Error guardando cliente:', error);
    }
  };

  // Buscar clientes por término (nombre o teléfono)
  const buscarClientes = (termino: string): ClienteGuardado[] => {
    if (!termino || termino.length < 2) return [];

    const terminoLower = termino.toLowerCase();

    return clientes
      .filter(
        (c) =>
          c.nombre.toLowerCase().includes(terminoLower) ||
          c.telefono.includes(termino)
      )
      .slice(0, 10); // Máximo 10 sugerencias
  };

  // Obtener los clientes más frecuentes
  const getClientesFrecuentes = (limit: number = 5): ClienteGuardado[] => {
    return [...clientes]
      .sort((a, b) => b.vecesUsado - a.vecesUsado)
      .slice(0, limit);
  };

  // Limpiar un cliente específico
  const eliminarCliente = (telefono: string) => {
    try {
      const nuevosClientes = clientes.filter((c) => c.telefono !== telefono);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosClientes));
      setClientes(nuevosClientes);
    } catch (error) {
      console.error('Error eliminando cliente:', error);
    }
  };

  // Limpiar todos los clientes
  const limpiarTodos = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setClientes([]);
    } catch (error) {
      console.error('Error limpiando clientes:', error);
    }
  };

  return {
    clientes,
    guardarCliente,
    buscarClientes,
    getClientesFrecuentes,
    eliminarCliente,
    limpiarTodos,
  };
}
