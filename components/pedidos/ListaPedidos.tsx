'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { pedidosService } from '@/lib/services';
import type { Pedido, EstadoPedido, CanalVenta } from '@/lib/types/firestore';
import { Search, Filter, RefreshCw, Loader2, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import Link from 'next/link';

const ESTADOS: { value: EstadoPedido | 'todos'; label: string; color: string }[] = [
  { value: 'todos', label: 'Todos', color: 'secondary' },
  { value: 'pendiente', label: 'Pendiente', color: 'default' },
  { value: 'en_preparacion', label: 'En Preparación', color: 'default' },
  { value: 'listo', label: 'Listo', color: 'default' },
  { value: 'en_reparto', label: 'En Reparto', color: 'default' },
  { value: 'entregado', label: 'Entregado', color: 'default' },
  { value: 'cancelado', label: 'Cancelado', color: 'destructive' },
];

const CANALES: { value: CanalVenta | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos los canales' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'mostrador', label: 'Mostrador' },
  { value: 'uber', label: 'Uber Eats' },
  { value: 'didi', label: 'DiDi Food' },
  { value: 'llamada', label: 'Llamada' },
  { value: 'web', label: 'Web' },
];

export function ListaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: 'todos' as EstadoPedido | 'todos',
    canal: 'todos' as CanalVenta | 'todos',
    fecha: new Date().toISOString().split('T')[0], // Hoy por defecto
  });

  useEffect(() => {
    loadPedidos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, pedidos]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      // Por ahora cargamos todos, en producción implementar paginación
      const data = await pedidosService.getAll({
        orderByField: 'fechaCreacion',
        orderDirection: 'desc',
        limitCount: 100,
      });
      setPedidos(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultados = [...pedidos];

    // Filtro por búsqueda (número de pedido o cliente)
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(
        (p) =>
          p.numeroPedido.toString().includes(busqueda) ||
          p.cliente.nombre.toLowerCase().includes(busqueda) ||
          p.cliente.telefono.includes(busqueda)
      );
    }

    // Filtro por estado
    if (filtros.estado !== 'todos') {
      resultados = resultados.filter((p) => p.estado === filtros.estado);
    }

    // Filtro por canal
    if (filtros.canal !== 'todos') {
      resultados = resultados.filter((p) => p.canal === filtros.canal);
    }

    // Filtro por fecha
    if (filtros.fecha) {
      resultados = resultados.filter((p) => {
        const fechaPedido = p.fechaCreacion.toDate().toISOString().split('T')[0];
        return fechaPedido === filtros.fecha;
      });
    }

    setPedidosFiltrados(resultados);
  };

  const getEstadoBadgeColor = (estado: EstadoPedido) => {
    const colores = {
      pendiente: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      en_preparacion: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      listo: 'bg-green-500/10 text-green-700 border-green-500/20',
      en_reparto: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      entregado: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      cancelado: 'bg-red-500/10 text-red-700 border-red-500/20',
    };
    return colores[estado] || '';
  };

  const getEstadoLabel = (estado: EstadoPedido) => {
    const labels = {
      pendiente: 'Pendiente',
      en_preparacion: 'En Preparación',
      listo: 'Listo',
      en_reparto: 'En Reparto',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return labels[estado] || estado;
  };

  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="space-y-2">
            <Label>Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="# Pedido, cliente, teléfono..."
                value={filtros.busqueda}
                onChange={(e) =>
                  setFiltros({ ...filtros, busqueda: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={filtros.estado}
              onValueChange={(value) =>
                setFiltros({ ...filtros, estado: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Canal */}
          <div className="space-y-2">
            <Label>Canal</Label>
            <Select
              value={filtros.canal}
              onValueChange={(value) =>
                setFiltros({ ...filtros, canal: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CANALES.map((canal) => (
                  <SelectItem key={canal.value} value={canal.value}>
                    {canal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={filtros.fecha}
              onChange={(e) =>
                setFiltros({ ...filtros, fecha: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {pedidosFiltrados.length} pedido(s) encontrado(s)
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPedidos}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">No hay pedidos</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron pedidos con los filtros seleccionados
              </p>
            </div>
            <Button variant="outline" onClick={() => setFiltros({
              busqueda: '',
              estado: 'todos',
              canal: 'todos',
              fecha: new Date().toISOString().split('T')[0],
            })}>
              Limpiar filtros
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                {/* Información principal */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">
                      Pedido #{pedido.numeroPedido}
                    </h3>
                    <Badge className={getEstadoBadgeColor(pedido.estado)}>
                      {getEstadoLabel(pedido.estado)}
                    </Badge>
                    <Badge variant="outline">{pedido.canal.toUpperCase()}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cliente</p>
                      <p className="font-medium">{pedido.cliente.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {pedido.cliente.telefono}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Fecha</p>
                      <p className="font-medium">
                        {pedido.fechaCreacion.toDate().toLocaleDateString('es-MX')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pedido.fechaCreacion.toDate().toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-bold text-lg">
                        {formatCurrency(pedido.totales.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pedido.pago.metodo.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {pedido.cliente.direccion && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Dirección:</p>
                      <p>
                        {pedido.cliente.direccion}
                        {pedido.cliente.colonia && `, ${pedido.cliente.colonia}`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  <Link href={`/pedidos/${pedido.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
