'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Pedido, EstadoPedido } from '@/lib/types/firestore';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Eye,
  ChefHat,
  CheckCircle,
  Package,
  XCircle,
} from 'lucide-react';

interface PedidoCardProps {
  pedido: Pedido;
  onVerDetalles: (pedido: Pedido) => void;
  onCambiarEstado: (pedidoId: string, nuevoEstado: EstadoPedido) => void;
  loadingAccion?: boolean;
}

const CANALES_ICONS: Record<string, string> = {
  whatsapp: '📱',
  mostrador: '🏪',
  uber: '🚗',
  didi: '🚕',
  llamada: '📞',
  web: '🌐',
};

const ESTADOS_CONFIG: Record<
  EstadoPedido,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    icon: <Clock className="h-3 w-3" />,
  },
  en_preparacion: {
    label: 'En Preparación',
    color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    icon: <ChefHat className="h-3 w-3" />,
  },
  listo: {
    label: 'Listo',
    color: 'bg-green-500/10 text-green-700 border-green-500/20',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  en_reparto: {
    label: 'En Reparto',
    color: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    icon: <Truck className="h-3 w-3" />,
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    icon: <Package className="h-3 w-3" />,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-500/10 text-red-700 border-red-500/20',
    icon: <XCircle className="h-3 w-3" />,
  },
};

// Botones de acción según el estado actual
const ACCIONES_POR_ESTADO: Record<EstadoPedido, EstadoPedido | null> = {
  pendiente: 'en_preparacion',
  en_preparacion: 'listo',
  listo: 'en_reparto',
  en_reparto: 'entregado',
  entregado: null,
  cancelado: null,
};

const LABELS_ACCION: Record<EstadoPedido, string> = {
  pendiente: 'Iniciar Preparación',
  en_preparacion: 'Marcar Listo',
  listo: 'Enviar a Reparto',
  en_reparto: 'Marcar Entregado',
  entregado: '',
  cancelado: '',
};

export function PedidoCard({
  pedido,
  onVerDetalles,
  onCambiarEstado,
  loadingAccion,
}: PedidoCardProps) {
  const estadoConfig = ESTADOS_CONFIG[pedido.estado] || {
    label: 'Desconocido',
    color: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    icon: <Package className="h-3 w-3" />,
  };
  const siguienteEstado = ACCIONES_POR_ESTADO[pedido.estado];
  const tiempoTranscurrido = calcularTiempoTranscurrido(
    pedido.fechaCreacion.toDate()
  );

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4" style={{
      borderLeftColor: pedido.estado === 'cancelado' ? 'rgb(239 68 68)' :
        pedido.estado === 'entregado' ? 'rgb(16 185 129)' :
        pedido.estado === 'pendiente' ? 'rgb(234 179 8)' :
        pedido.estado === 'en_preparacion' ? 'rgb(59 130 246)' :
        pedido.estado === 'listo' ? 'rgb(34 197 94)' :
        'rgb(168 85 247)'
    }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CANALES_ICONS[pedido.canal] || '📦'}</span>
          <div>
            <h3 className="font-bold text-lg">#{pedido.numeroPedido}</h3>
            <p className="text-xs text-muted-foreground">{tiempoTranscurrido}</p>
          </div>
        </div>
        <Badge className={`${estadoConfig.color} gap-1`}>
          {estadoConfig.icon}
          {estadoConfig.label}
        </Badge>
      </div>

      {/* Info del cliente */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{pedido.cliente.nombre}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{pedido.cliente.telefono}</span>
        </div>

        {pedido.cliente.direccion && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {pedido.cliente.direccion}
              {pedido.cliente.colonia && `, ${pedido.cliente.colonia}`}
            </span>
          </div>
        )}
      </div>

      {/* Totales y pago */}
      <div className="flex items-center justify-between py-2 border-t border-b mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium uppercase">{pedido.pago.metodo}</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{formatCurrency(pedido.totales.total)}</p>
          {pedido.totales.envio > 0 && (
            <p className="text-xs text-muted-foreground">
              (Envío: {formatCurrency(pedido.totales.envio)})
            </p>
          )}
        </div>
      </div>

      {/* Repartidor si está asignado */}
      {pedido.reparto?.repartidorNombre && (
        <div className="flex items-center gap-2 text-sm mb-3 p-2 bg-muted/50 rounded">
          <Truck className="h-4 w-4 text-purple-600" />
          <span>
            <span className="text-muted-foreground">Repartidor:</span>{' '}
            <span className="font-medium">{pedido.reparto.repartidorNombre}</span>
          </span>
        </div>
      )}

      {/* Observaciones si existen */}
      {pedido.observaciones && (
        <div className="text-sm p-2 bg-yellow-500/10 rounded mb-3">
          <span className="font-medium">Nota:</span> {pedido.observaciones}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1"
          onClick={() => onVerDetalles(pedido)}
        >
          <Eye className="h-4 w-4" />
          Ver Detalles
        </Button>

        {siguienteEstado && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onCambiarEstado(pedido.id, siguienteEstado)}
            disabled={loadingAccion}
          >
            {LABELS_ACCION[pedido.estado]}
          </Button>
        )}

        {pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onCambiarEstado(pedido.id, 'cancelado')}
            disabled={loadingAccion}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}

function calcularTiempoTranscurrido(fecha: Date): string {
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} min`;

  const diffHoras = Math.floor(diffMins / 60);
  if (diffHoras < 24) return `Hace ${diffHoras}h ${diffMins % 60}m`;

  const diffDias = Math.floor(diffHoras / 24);
  return `Hace ${diffDias} día(s)`;
}
