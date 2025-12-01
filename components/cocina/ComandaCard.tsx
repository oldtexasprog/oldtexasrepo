'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Pedido, ItemPedido } from '@/lib/types/firestore';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  Clock,
  User,
  MapPin,
  Flame,
  ChefHat,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ComandaCardProps {
  pedido: Pedido;
  items: ItemPedido[];
  onIniciarPreparacion?: (pedidoId: string) => void;
  onMarcarListo?: (pedidoId: string) => void;
  loading?: boolean;
}

const CANALES_ICONS: Record<string, string> = {
  whatsapp: '📱',
  mostrador: '🏪',
  uber: '🚗',
  didi: '🚕',
  llamada: '📞',
  web: '🌐',
};

const CANALES_COLORS: Record<string, string> = {
  whatsapp: 'bg-green-500/10 text-green-700 border-green-500/20',
  mostrador: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  uber: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  didi: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  llamada: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  web: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
};

const PERSONALIZACION_ICONS: Record<string, string> = {
  salsa: '🌶️',
  presentacion: '📦',
  temperatura: '🌡️',
  extras: '➕',
  sinIngredientes: '➖',
};

/**
 * Calcula el tiempo transcurrido desde la creación del pedido
 */
function calcularTiempoTranscurrido(fechaCreacion: Date): string {
  const ahora = new Date();
  const diferencia = ahora.getTime() - fechaCreacion.getTime();
  const minutos = Math.floor(diferencia / 60000);

  if (minutos < 1) return 'Ahora mismo';
  if (minutos === 1) return '1 minuto';
  if (minutos < 60) return `${minutos} minutos`;

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 1) {
    return minutosRestantes > 0
      ? `1 hora ${minutosRestantes} min`
      : '1 hora';
  }

  return minutosRestantes > 0
    ? `${horas} horas ${minutosRestantes} min`
    : `${horas} horas`;
}

/**
 * Determina el color de alerta según el tiempo transcurrido
 */
function getColorAlerta(minutos: number): string {
  if (minutos < 15) return 'text-green-600';
  if (minutos < 30) return 'text-yellow-600';
  return 'text-red-600 animate-pulse';
}

export function ComandaCard({
  pedido,
  items,
  onIniciarPreparacion,
  onMarcarListo,
  loading = false,
}: ComandaCardProps) {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState('');
  const [minutosTranscurridos, setMinutosTranscurridos] = useState(0);

  // Actualizar tiempo cada minuto
  useEffect(() => {
    const actualizarTiempo = () => {
      const fechaCreacion = pedido.fechaCreacion.toDate();
      setTiempoTranscurrido(calcularTiempoTranscurrido(fechaCreacion));

      const ahora = new Date();
      const minutos = Math.floor(
        (ahora.getTime() - fechaCreacion.getTime()) / 60000
      );
      setMinutosTranscurridos(minutos);
    };

    actualizarTiempo();
    const intervalo = setInterval(actualizarTiempo, 60000); // Actualizar cada minuto

    return () => clearInterval(intervalo);
  }, [pedido.fechaCreacion]);

  const esUrgente = minutosTranscurridos >= 30;

  return (
    <Card
      className={`p-4 transition-all duration-200 hover:shadow-md ${
        esUrgente ? 'border-red-500 border-2 shadow-red-100' : ''
      }`}
    >
      {/* Header con número de pedido y canal */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">
            #{pedido.numeroPedido.toString().padStart(3, '0')}
          </div>
          <Badge className={CANALES_COLORS[pedido.canal]}>
            <span className="mr-1">{CANALES_ICONS[pedido.canal]}</span>
            {pedido.canal.toUpperCase()}
          </Badge>
        </div>

        {/* Tiempo transcurrido con alerta visual */}
        <div className="flex flex-col items-end gap-1">
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${getColorAlerta(minutosTranscurridos)}`}
          >
            <Clock className="h-4 w-4" />
            {tiempoTranscurrido}
          </div>
          {esUrgente && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertCircle className="h-3 w-3" />
              URGENTE
            </Badge>
          )}
        </div>
      </div>

      {/* Cliente */}
      <div className="mb-3 pb-3 border-b">
        <div className="flex items-center gap-2 text-sm mb-1">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{pedido.cliente.nombre}</span>
        </div>

        {pedido.cliente.direccion && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground ml-6">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {pedido.cliente.direccion}
              {pedido.cliente.colonia && `, ${pedido.cliente.colonia}`}
            </span>
          </div>
        )}
      </div>

      {/* Items del pedido */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <ChefHat className="h-3 w-3" />
          Productos ({items.length})
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="bg-muted/50 rounded-lg p-2.5 space-y-1.5"
          >
            {/* Producto y cantidad */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center font-bold">
                  {item.cantidad}x
                </Badge>
                <span className="font-semibold text-sm">
                  {item.productoNombre}
                </span>
              </div>
            </div>

            {/* Personalizaciones destacadas */}
            {item.personalizaciones && (
              <div className="ml-8 space-y-1">
                {/* Salsas */}
                {item.personalizaciones.salsa &&
                  item.personalizaciones.salsa.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-base">
                        {PERSONALIZACION_ICONS.salsa}
                      </span>
                      <span className="font-medium text-orange-700">
                        Salsas:
                      </span>
                      <span className="text-muted-foreground">
                        {item.personalizaciones.salsa.join(', ')}
                      </span>
                    </div>
                  )}

                {/* Extras */}
                {item.personalizaciones.extras &&
                  item.personalizaciones.extras.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-base">
                        {PERSONALIZACION_ICONS.extras}
                      </span>
                      <span className="font-medium text-green-700">
                        Extras:
                      </span>
                      <span className="text-muted-foreground">
                        {item.personalizaciones.extras.join(', ')}
                      </span>
                    </div>
                  )}

                {/* Presentación */}
                {item.personalizaciones.presentacion && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-base">
                      {PERSONALIZACION_ICONS.presentacion}
                    </span>
                    <span className="font-medium text-blue-700">
                      Presentación:
                    </span>
                    <span className="text-muted-foreground">
                      {item.personalizaciones.presentacion}
                    </span>
                  </div>
                )}

                {/* Temperatura */}
                {item.personalizaciones.temperatura && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-base">
                      {PERSONALIZACION_ICONS.temperatura}
                    </span>
                    <span className="font-medium text-red-700">
                      Temperatura:
                    </span>
                    <span className="text-muted-foreground">
                      {item.personalizaciones.temperatura}
                    </span>
                  </div>
                )}

                {/* Sin ingredientes */}
                {item.personalizaciones.sinIngredientes &&
                  item.personalizaciones.sinIngredientes.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-base">
                        {PERSONALIZACION_ICONS.sinIngredientes}
                      </span>
                      <span className="font-medium text-red-700">
                        Sin:
                      </span>
                      <span className="text-muted-foreground">
                        {item.personalizaciones.sinIngredientes.join(', ')}
                      </span>
                    </div>
                  )}
              </div>
            )}

            {/* Notas especiales del item */}
            {item.notas && (
              <div className="ml-8 text-xs text-muted-foreground italic bg-yellow-50 p-1.5 rounded border-l-2 border-yellow-400">
                💬 {item.notas}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Observaciones generales */}
      {pedido.observaciones && (
        <div className="mb-4 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs">
          <div className="font-semibold text-yellow-800 mb-1">
            📝 Observaciones:
          </div>
          <div className="text-yellow-700">{pedido.observaciones}</div>
        </div>
      )}

      {/* Acciones según estado */}
      <div className="flex gap-2">
        {pedido.estado === 'pendiente' && onIniciarPreparacion && (
          <Button
            onClick={() => onIniciarPreparacion(pedido.id)}
            disabled={loading}
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Flame className="h-4 w-4" />
            Iniciar Preparación
          </Button>
        )}

        {pedido.estado === 'en_preparacion' && onMarcarListo && (
          <Button
            onClick={() => onMarcarListo(pedido.id)}
            disabled={loading}
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Marcar como Listo
          </Button>
        )}
      </div>
    </Card>
  );
}
