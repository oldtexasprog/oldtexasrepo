'use client';

import { Pedido } from '@/lib/types/firestore';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  MapPin,
  DollarSign,
  Package,
  Clock,
  Check,
  AlertTriangle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { PedidoDetalleModal } from '@/components/pedidos/PedidoDetalleModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PedidoRepartoCardProps {
  pedido: Pedido;
  mostrarBotonAceptar?: boolean;
  mostrarBotonEntregado?: boolean;
  mostrarBotonIncidencia?: boolean;
  onAceptar?: (pedidoId: string) => void;
  onMarcarEntregado?: (pedidoId: string) => void;
  onReportarIncidencia?: (pedidoId: string) => void;
  loadingAction?: boolean;
}

export function PedidoRepartoCard({
  pedido,
  mostrarBotonAceptar = false,
  mostrarBotonEntregado = false,
  mostrarBotonIncidencia = false,
  onAceptar,
  onMarcarEntregado,
  onReportarIncidencia,
  loadingAction = false,
}: PedidoRepartoCardProps) {
  const [showDetalleModal, setShowDetalleModal] = useState(false);

  // Calcular tiempo desde que está listo
  const tiempoDesdeCreacion = pedido.fechaCreacion
    ? format(pedido.fechaCreacion.toDate(), "HH:mm", { locale: es })
    : '--:--';

  // Determinar si es urgente (más de 20 minutos)
  const minutosDesdeCreacion = pedido.fechaCreacion
    ? Math.floor((Date.now() - pedido.fechaCreacion.toDate().getTime()) / (1000 * 60))
    : 0;
  const esUrgente = minutosDesdeCreacion > 20;

  return (
    <>
      <Card className={`p-4 hover:shadow-lg transition-shadow ${esUrgente ? 'border-orange-500 border-2' : ''}`}>
        <div className="space-y-4">
          {/* Header: Número de pedido y estado */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  Pedido #{pedido.numeroPedido}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tiempoDesdeCreacion}
                </p>
              </div>
            </div>

            {esUrgente && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Urgente
              </Badge>
            )}
          </div>

          {/* Información del pedido */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Monto total */}
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-lg">{formatCurrency(pedido.totales.total)}</p>
              </div>
            </div>

            {/* Costo de envío */}
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Envío</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(pedido.totales.envio)}
                </p>
              </div>
            </div>

            {/* Colonia */}
            <div className="flex items-start gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Colonia</p>
                <p className="font-medium">{pedido.cliente.colonia || 'No especificada'}</p>
              </div>
            </div>

            {/* Observaciones */}
            {pedido.observaciones && (
              <div className="flex items-start gap-2 col-span-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Observaciones</p>
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    {pedido.observaciones}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Información de pago */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Método de pago:</span>
              <span className="font-medium capitalize">{pedido.pago.metodo}</span>
            </div>
            {pedido.pago.requiereCambio && pedido.pago.cambio && (
              <div className="flex items-center justify-between text-sm mt-2 border-t border-border pt-2">
                <span className="text-muted-foreground">Cambio de:</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(pedido.pago.cambio)}
                </span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            {/* Ver detalles */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetalleModal(true)}
              className="w-full justify-between"
            >
              Ver detalles completos
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Botón Aceptar Pedido */}
            {mostrarBotonAceptar && onAceptar && (
              <Button
                onClick={() => onAceptar(pedido.id)}
                disabled={loadingAction}
                className="w-full"
              >
                <Check className="h-4 w-4 mr-2" />
                {loadingAction ? 'Aceptando...' : 'Aceptar Pedido'}
              </Button>
            )}

            {/* Botón Marcar como Entregado */}
            {mostrarBotonEntregado && onMarcarEntregado && (
              <Button
                onClick={() => onMarcarEntregado(pedido.id)}
                disabled={loadingAction}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                {loadingAction ? 'Procesando...' : 'Marcar como Entregado'}
              </Button>
            )}

            {/* Botón Reportar Incidencia */}
            {mostrarBotonIncidencia && onReportarIncidencia && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReportarIncidencia(pedido.id)}
                disabled={loadingAction}
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reportar Incidencia
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Modal de detalles */}
      {showDetalleModal && (
        <PedidoDetalleModal
          pedido={pedido}
          open={showDetalleModal}
          onClose={() => setShowDetalleModal(false)}
          onCambiarEstado={() => {}}
        />
      )}
    </>
  );
}
