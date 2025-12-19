'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { pedidosService } from '@/lib/services';
import type { Pedido, TipoTurno } from '@/lib/types/firestore';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  FileText,
  Download,
  Calendar,
  Loader2,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export function BitacoraDigital() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [turnoFiltro, setTurnoFiltro] = useState<TipoTurno | 'todos'>('todos');

  // Cargar pedidos en tiempo real
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = () => {
      setLoading(true);

      unsubscribe = pedidosService.onCollectionChange(
        (pedidosData) => {
          setPedidos(pedidosData);
          setLoading(false);
        },
        {
          orderByField: 'fechaCreacion',
          orderDirection: 'desc',
          limitCount: 1000,
        },
        (error) => {
          console.error('Error cargando pedidos:', error);
          toast.error('Error al cargar la bitácora');
          setLoading(false);
        }
      );
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Filtrar pedidos
  const pedidosFiltrados = useMemo(() => {
    let resultado = pedidos.filter((p) => {
      const fechaPedido = p.fechaCreacion.toDate().toISOString().split('T')[0];
      return fechaPedido === fecha;
    });

    if (turnoFiltro !== 'todos') {
      resultado = resultado.filter((p) => {
        const hora = p.fechaCreacion.toDate().getHours();
        if (turnoFiltro === 'matutino') {
          return hora >= 6 && hora < 15;
        } else {
          return hora >= 15 || hora < 6;
        }
      });
    }

    return resultado;
  }, [pedidos, fecha, turnoFiltro]);

  // Calcular totales
  const totales = useMemo(() => {
    const efectivo = pedidosFiltrados
      .filter((p) => p.pago.metodo === 'efectivo' && p.estado !== 'cancelado')
      .reduce((sum, p) => sum + p.totales.total, 0);

    const tarjeta = pedidosFiltrados
      .filter((p) => p.pago.metodo === 'tarjeta' && p.estado !== 'cancelado')
      .reduce((sum, p) => sum + p.totales.total, 0);

    const transferencia = pedidosFiltrados
      .filter(
        (p) => p.pago.metodo === 'transferencia' && p.estado !== 'cancelado'
      )
      .reduce((sum, p) => sum + p.totales.total, 0);

    const totalEnvios = pedidosFiltrados
      .filter((p) => p.estado !== 'cancelado')
      .reduce((sum, p) => sum + (p.totales.envio || 0), 0);

    const totalCambio = pedidosFiltrados
      .filter((p) => p.pago.metodo === 'efectivo' && p.estado !== 'cancelado')
      .reduce((sum, p) => sum + (p.pago.cambio || 0), 0);

    const total = efectivo + tarjeta + transferencia;

    return {
      efectivo,
      tarjeta,
      transferencia,
      totalEnvios,
      totalCambio,
      total,
      cantidad: pedidosFiltrados.filter((p) => p.estado !== 'cancelado').length,
    };
  }, [pedidosFiltrados]);

  const exportarExcel = () => {
    // Preparar datos para CSV
    const headers = [
      'ID Pedido',
      'Número',
      'Cliente',
      'Teléfono',
      'Colonia',
      'Monto',
      'Método Pago',
      'Cambio',
      'Envío',
      'Repartidor',
      'Estado',
      'Hora',
    ];

    const rows = pedidosFiltrados.map((p) => [
      p.id.slice(-8),
      p.numeroPedido,
      p.cliente.nombre,
      p.cliente.telefono,
      p.cliente.colonia || 'N/A',
      p.totales.total,
      p.pago.metodo.toUpperCase(),
      p.pago.cambio || 0,
      p.totales.envio || 0,
      p.reparto?.repartidorNombre || 'Sin asignar',
      p.estado,
      p.fechaCreacion.toDate().toLocaleTimeString('es-MX'),
    ]);

    // Agregar fila de totales
    rows.push([
      '',
      '',
      '',
      '',
      'TOTALES',
      totales.total,
      '',
      totales.totalCambio,
      totales.totalEnvios,
      '',
      `${totales.cantidad} pedidos`,
      '',
    ]);

    // Convertir a CSV
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bitacora_${fecha}_${turnoFiltro}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Bitácora exportada exitosamente');
  };

  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando bitácora...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y acciones */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Bitácora Digital</h2>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Tiempo Real
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Fecha</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Turno</Label>
            <Select
              value={turnoFiltro}
              onValueChange={(value) => setTurnoFiltro(value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los turnos</SelectItem>
                <SelectItem value="matutino">Matutino (6am - 3pm)</SelectItem>
                <SelectItem value="vespertino">Vespertino (3pm - 6am)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={exportarExcel}
              className="flex-1 gap-2"
              disabled={pedidosFiltrados.length === 0}
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Resumen de totales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Efectivo</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totales.efectivo)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tarjeta</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(totales.tarjeta)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Transferencia</p>
            <p className="text-xl font-bold text-purple-600">
              {formatCurrency(totales.transferencia)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{formatCurrency(totales.total)}</p>
          </div>
        </div>
      </Card>

      {/* Tabla de pedidos */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Colonia</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Cambio</TableHead>
                <TableHead className="text-right">Envío</TableHead>
                <TableHead>Repartidor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-12 w-12 opacity-50" />
                      <p>No hay pedidos para esta fecha/turno</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <TableRow
                    key={pedido.id}
                    className={
                      pedido.estado === 'cancelado' ? 'opacity-50' : ''
                    }
                  >
                    <TableCell className="font-mono text-xs">
                      {pedido.id.slice(-8)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {pedido.numeroPedido}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pedido.cliente.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {pedido.cliente.telefono}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{pedido.cliente.colonia || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(pedido.totales.total)}
                      </div>
                      {pedido.totales.descuento > 0 && (
                        <div className="text-xs text-green-600">
                          Desc: -{formatCurrency(pedido.totales.descuento)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {pedido.pago.metodo.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pedido.pago.cambio
                        ? formatCurrency(pedido.pago.cambio)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {pedido.totales.envio
                        ? formatCurrency(pedido.totales.envio)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {pedido.reparto?.repartidorNombre || (
                        <span className="text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pedido.estado === 'entregado'
                            ? 'default'
                            : pedido.estado === 'cancelado'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {pedido.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {pedido.fechaCreacion
                        .toDate()
                        .toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {pedidosFiltrados.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="font-bold">
                    TOTALES ({totales.cantidad} pedidos)
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totales.total)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totales.totalCambio)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totales.totalEnvios)}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </Card>
    </div>
  );
}
