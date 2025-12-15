'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { pedidosService } from '@/lib/services/pedidos.service';
import { repartidoresService } from '@/lib/services/repartidores.service';
import { Pedido } from '@/lib/types/firestore';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  Calendar,
  DollarSign,
  Package,
  User,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

type PeriodoFiltro = 'hoy' | 'semana' | 'mes' | 'todo';

interface LiquidacionAgrupada {
  repartidorId: string;
  repartidorNombre: string;
  pedidos: Pedido[];
  totalPedidos: number;
  montoTotal: number;
  comisionTotal: number;
  montoEntregado: number;
  ultimaLiquidacion: Date;
}

export function HistorialLiquidaciones() {
  const { userData } = useAuth();
  const [liquidaciones, setLiquidaciones] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('semana');

  useEffect(() => {
    loadLiquidaciones();
  }, [userData, periodo]);

  const loadLiquidaciones = async () => {
    if (!userData?.id) return;

    try {
      setLoading(true);

      // Calcular rango de fechas según el periodo
      const now = new Date();
      let fechaInicio: Date;

      switch (periodo) {
        case 'hoy':
          fechaInicio = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'semana':
          fechaInicio = startOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'mes':
          fechaInicio = startOfMonth(now);
          break;
        case 'todo':
        default:
          fechaInicio = new Date(0); // Desde el inicio de los tiempos
          break;
      }

      let pedidos: Pedido[] = [];

      if (userData.rol === 'repartidor') {
        // Buscar el repartidor asociado
        const repartidores = await repartidoresService.search([
          { field: 'usuarioId', operator: '==', value: userData.id }
        ]);

        if (repartidores.length > 0) {
          const repartidor = repartidores[0];
          const todosPedidos = await pedidosService.search([
            { field: 'reparto.repartidorId', operator: '==', value: repartidor.id },
            { field: 'reparto.liquidado', operator: '==', value: true },
          ]);

          // Filtrar por fecha
          pedidos = todosPedidos.filter((p) => {
            const fechaLiquidacion = p.reparto?.fechaLiquidacion?.toDate();
            return fechaLiquidacion && fechaLiquidacion >= fechaInicio;
          });
        }
      } else {
        // Cajera o admin: todos los liquidados
        const todosPedidos = await pedidosService.search([
          { field: 'reparto.liquidado', operator: '==', value: true },
        ]);

        // Filtrar por fecha
        pedidos = todosPedidos.filter((p) => {
          const fechaLiquidacion = p.reparto?.fechaLiquidacion?.toDate();
          return fechaLiquidacion && fechaLiquidacion >= fechaInicio;
        });
      }

      // Ordenar por fecha de liquidación (más recientes primero)
      pedidos.sort((a, b) => {
        const fechaA = a.reparto?.fechaLiquidacion?.toDate() || new Date(0);
        const fechaB = b.reparto?.fechaLiquidacion?.toDate() || new Date(0);
        return fechaB.getTime() - fechaA.getTime();
      });

      setLiquidaciones(pedidos);
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast.error('Error al cargar historial de liquidaciones');
    } finally {
      setLoading(false);
    }
  };

  // Agrupar por repartidor
  const agruparPorRepartidor = (): LiquidacionAgrupada[] => {
    const grupos = new Map<string, LiquidacionAgrupada>();

    liquidaciones.forEach((pedido) => {
      const repartidorId = pedido.reparto?.repartidorId || '';
      const repartidorNombre = pedido.reparto?.repartidorNombre || 'Desconocido';

      if (!grupos.has(repartidorId)) {
        grupos.set(repartidorId, {
          repartidorId,
          repartidorNombre,
          pedidos: [],
          totalPedidos: 0,
          montoTotal: 0,
          comisionTotal: 0,
          montoEntregado: 0,
          ultimaLiquidacion: new Date(0),
        });
      }

      const grupo = grupos.get(repartidorId)!;
      grupo.pedidos.push(pedido);
      grupo.totalPedidos += 1;
      grupo.montoTotal += pedido.totales.total;
      grupo.comisionTotal += pedido.reparto?.comisionRepartidor || 0;
      grupo.montoEntregado += pedido.totales.total - (pedido.reparto?.comisionRepartidor || 0);

      const fechaLiquidacion = pedido.reparto?.fechaLiquidacion?.toDate() || new Date(0);
      if (fechaLiquidacion > grupo.ultimaLiquidacion) {
        grupo.ultimaLiquidacion = fechaLiquidacion;
      }
    });

    return Array.from(grupos.values()).sort(
      (a, b) => b.ultimaLiquidacion.getTime() - a.ultimaLiquidacion.getTime()
    );
  };

  const liquidacionesAgrupadas = agruparPorRepartidor();

  // Calcular totales generales
  const totalesGenerales = {
    totalPedidos: liquidaciones.length,
    montoTotal: liquidaciones.reduce((acc, p) => acc + p.totales.total, 0),
    comisionTotal: liquidaciones.reduce(
      (acc, p) => acc + (p.reparto?.comisionRepartidor || 0),
      0
    ),
  };

  const handleExportar = () => {
    // TODO: Implementar exportación a CSV o PDF
    toast.info('Funcionalidad de exportación próximamente');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (liquidaciones.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No hay liquidaciones en este periodo
          </h3>
          <p className="text-muted-foreground">
            Cambia el filtro de periodo para ver más resultados
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles superiores */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Filtro de periodo */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex gap-2">
            {(['hoy', 'semana', 'mes', 'todo'] as PeriodoFiltro[]).map((p) => (
              <Button
                key={p}
                variant={periodo === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriodo(p)}
              >
                {p === 'hoy' && 'Hoy'}
                {p === 'semana' && 'Esta Semana'}
                {p === 'mes' && 'Este Mes'}
                {p === 'todo' && 'Todo'}
              </Button>
            ))}
          </div>
        </div>

        {/* Botón exportar */}
        <Button variant="outline" onClick={handleExportar}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Total Liquidados
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {totalesGenerales.totalPedidos}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Monto Total
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(totalesGenerales.montoTotal)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Comisiones
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {formatCurrency(totalesGenerales.comisionTotal)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liquidaciones agrupadas por repartidor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Por Repartidor
        </h3>

        {liquidacionesAgrupadas.map((grupo) => (
          <Card key={grupo.repartidorId} className="p-6">
            <div className="space-y-4">
              {/* Header del repartidor */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{grupo.repartidorNombre}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Última liquidación:{' '}
                      {format(grupo.ultimaLiquidacion, "dd/MM/yyyy 'a las' HH:mm", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {grupo.totalPedidos} pedido(s)
                </Badge>
              </div>

              {/* Resumen del repartidor */}
              <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Monto Total</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(grupo.montoTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Comisión</p>
                  <p className="font-bold text-lg text-orange-600">
                    {formatCurrency(grupo.comisionTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entregado</p>
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(grupo.montoEntregado)}
                  </p>
                </div>
              </div>

              {/* Lista de pedidos del repartidor */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline list-none flex items-center gap-2">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Ver detalle de pedidos ({grupo.pedidos.length})
                </summary>

                <div className="mt-3 space-y-2 pl-6">
                  {grupo.pedidos.map((pedido) => {
                    const comision = pedido.reparto?.comisionRepartidor || 0;
                    const entregado = pedido.totales.total - comision;

                    return (
                      <div
                        key={pedido.id}
                        className="flex items-center justify-between p-3 bg-background border rounded-lg text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{pedido.numeroPedido}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              pedido.reparto?.fechaLiquidacion?.toDate() || new Date(),
                              'dd/MM/yyyy HH:mm',
                              { locale: es }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="font-medium">
                              {formatCurrency(pedido.totales.total)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Comisión</p>
                            <p className="font-medium text-orange-600">
                              {formatCurrency(comision)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Entregado</p>
                            <p className="font-bold text-green-600">
                              {formatCurrency(entregado)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
