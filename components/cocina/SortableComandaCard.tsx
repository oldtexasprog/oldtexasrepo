'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComandaCard } from './ComandaCard';
import type { Pedido, ItemPedido } from '@/lib/types/firestore';

interface SortableComandaCardProps {
  pedido: Pedido;
  items: ItemPedido[];
  onIniciarPreparacion?: (pedidoId: string) => void;
  onMarcarListo?: (pedidoId: string) => void;
  loading?: boolean;
}

export function SortableComandaCard({
  pedido,
  items,
  onIniciarPreparacion,
  onMarcarListo,
  loading,
}: SortableComandaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: pedido.id,
    data: {
      type: 'comanda',
      pedido,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ComandaCard
        pedido={pedido}
        items={items}
        onIniciarPreparacion={onIniciarPreparacion}
        onMarcarListo={onMarcarListo}
        loading={loading}
      />
    </div>
  );
}
