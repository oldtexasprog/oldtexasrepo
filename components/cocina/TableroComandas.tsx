'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Pedido, ItemPedido, EstadoPedido } from '@/lib/types/firestore';
import { ComandaCard } from './ComandaCard';
import { SortableComandaCard } from './SortableComandaCard';
import { pedidosService } from '@/lib/services/pedidos.service';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNotificacionSonido } from '@/lib/hooks/useNotificacionSonido';

interface TableroComandasProps {
  pedidosIniciales?: Pedido[];
}

type ColumnId = 'pendiente' | 'en_preparacion' | 'listo';

const COLUMNS: Array<{
  id: ColumnId;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = [
  {
    id: 'pendiente',
    title: 'Pendiente',
    icon: <Clock className="h-5 w-5" />,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  {
    id: 'en_preparacion',
    title: 'En Preparación',
    icon: <ChefHat className="h-5 w-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'listo',
    title: 'Listo',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
];

export function TableroComandas({ pedidosIniciales = [] }: TableroComandasProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
  const [itemsPorPedido, setItemsPorPedido] = useState<
    Record<string, ItemPedido[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [loadingAccion, setLoadingAccion] = useState<string | null>(null);

  // Para detectar nuevos pedidos
  const pedidosAnterioresRef = useRef<string[]>([]);
  const { reproducirAlerta, reproducirUrgente } = useNotificacionSonido();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimiento para activar drag
      },
    })
  );

  // Cargar pedidos en tiempo real
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupRealtimeListener = () => {
      unsubscribe = pedidosService.onCollectionChange(
        (pedidosData) => {
          // Filtrar solo pedidos de cocina (pendiente, en_preparacion, listo)
          const pedidosCocina = pedidosData.filter(
            (p) =>
              p.estado === 'pendiente' ||
              p.estado === 'en_preparacion' ||
              p.estado === 'listo'
          );

          // Detectar nuevos pedidos y reproducir sonido
          if (!loading && pedidosAnterioresRef.current.length > 0) {
            const idsAnteriores = new Set(pedidosAnterioresRef.current);
            const pedidosNuevos = pedidosCocina.filter(
              (p) => !idsAnteriores.has(p.id) && p.estado === 'pendiente'
            );

            if (pedidosNuevos.length > 0) {
              // Verificar si algún pedido es urgente (>30 min)
              const hayUrgente = pedidosNuevos.some((p) => {
                const minutos =
                  (Date.now() - p.fechaCreacion.toDate().getTime()) / 60000;
                return minutos >= 30;
              });

              if (hayUrgente) {
                reproducirUrgente();
                toast.warning(
                  `¡${pedidosNuevos.length} pedido(s) nuevo(s) URGENTE(S)!`,
                  {
                    duration: 5000,
                  }
                );
              } else {
                reproducirAlerta();
                toast.info(
                  `${pedidosNuevos.length} pedido(s) nuevo(s) en cocina`,
                  {
                    duration: 3000,
                  }
                );
              }
            }
          }

          // Actualizar referencia de IDs
          pedidosAnterioresRef.current = pedidosCocina.map((p) => p.id);

          setPedidos(pedidosCocina);
          setLoading(false);
        },
        {
          orderByField: 'fechaCreacion',
          orderDirection: 'asc', // Más antiguos primero
          limitCount: 100,
        },
        (error) => {
          console.error('Error cargando pedidos:', error);
          toast.error('Error al cargar los pedidos');
          setLoading(false);
        }
      );
    };

    setupRealtimeListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Cargar items de cada pedido
  useEffect(() => {
    const cargarItems = async () => {
      const itemsMap: Record<string, ItemPedido[]> = {};

      for (const pedido of pedidos) {
        try {
          const items = await pedidosService.getItems(pedido.id);
          itemsMap[pedido.id] = items;
        } catch (error) {
          console.error(`Error cargando items del pedido ${pedido.id}:`, error);
        }
      }

      setItemsPorPedido(itemsMap);
    };

    if (pedidos.length > 0) {
      cargarItems();
    }
  }, [pedidos]);

  // Organizar pedidos por columna
  const pedidosPorColumna = useMemo(() => {
    const columnas: Record<ColumnId, Pedido[]> = {
      pendiente: [],
      en_preparacion: [],
      listo: [],
    };

    pedidos.forEach((pedido) => {
      if (pedido.estado in columnas) {
        columnas[pedido.estado as ColumnId].push(pedido);
      }
    });

    return columnas;
  }, [pedidos]);

  // Cambiar estado de un pedido
  const cambiarEstadoPedido = useCallback(
    async (pedidoId: string, nuevoEstado: EstadoPedido) => {
      setLoadingAccion(pedidoId);

      try {
        await pedidosService.updateEstado(pedidoId, nuevoEstado);

        toast.success('Estado actualizado correctamente');
      } catch (error) {
        console.error('Error actualizando estado:', error);
        toast.error('Error al actualizar el estado');
      } finally {
        setLoadingAccion(null);
      }
    },
    []
  );

  // Handlers de drag & drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const pedidoId = active.id as string;
    const nuevaColumna = over.id as ColumnId;

    const pedidoActual = pedidos.find((p) => p.id === pedidoId);
    if (!pedidoActual) return;

    // Solo cambiar si es diferente columna
    if (pedidoActual.estado !== nuevaColumna) {
      cambiarEstadoPedido(pedidoId, nuevaColumna);
    }
  };

  const pedidoActivo = activeDragId
    ? pedidos.find((p) => p.id === activeDragId)
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {COLUMNS.map((column) => {
          const pedidosColumna = pedidosPorColumna[column.id];

          return (
            <div key={column.id} className="flex flex-col h-full">
              {/* Header de columna */}
              <div
                className={`${column.bgColor} border-2 rounded-t-lg p-4 sticky top-0 z-10`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={column.color}>{column.icon}</div>
                    <h3 className={`font-bold text-lg ${column.color}`}>
                      {column.title}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="h-7 px-2.5">
                    {pedidosColumna.length}
                  </Badge>
                </div>
              </div>

              {/* Lista de comandas - Drop zone */}
              <SortableContext
                id={column.id}
                items={pedidosColumna.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className={`flex-1 border-2 border-t-0 rounded-b-lg p-4 space-y-3 min-h-[400px] ${column.bgColor} overflow-y-auto`}
                >
                  {pedidosColumna.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                      No hay pedidos en esta columna
                    </div>
                  ) : (
                    pedidosColumna.map((pedido) => (
                      <SortableComandaCard
                        key={pedido.id}
                        pedido={pedido}
                        items={itemsPorPedido[pedido.id] || []}
                        onIniciarPreparacion={
                          column.id === 'pendiente'
                            ? (id) => cambiarEstadoPedido(id, 'en_preparacion')
                            : undefined
                        }
                        onMarcarListo={
                          column.id === 'en_preparacion'
                            ? (id) => cambiarEstadoPedido(id, 'listo')
                            : undefined
                        }
                        loading={loadingAccion === pedido.id}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      {/* Overlay para drag & drop */}
      <DragOverlay>
        {pedidoActivo ? (
          <div className="opacity-80 rotate-3 scale-105">
            <ComandaCard
              pedido={pedidoActivo}
              items={itemsPorPedido[pedidoActivo.id] || []}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
