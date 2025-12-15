'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Download, Calendar, Filter } from 'lucide-react';
import { Turno, TipoTurno } from '@/lib/types/firestore';
import { turnosService } from '@/lib/services/turnos.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DetallesTurnoModal } from './DetallesTurnoModal';
import { exportarCortePDF } from '@/lib/utils/pdf-export';
import { toast } from 'sonner';

export function CorteCaja() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnosFiltrados, setTurnosFiltrados] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Filtros
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [tipoTurno, setTipoTurno] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  // Cargar turnos cerrados
  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setLoading(true);
      // Obtener todos los turnos cerrados
      const turnosCerrados = await turnosService.search([
        { field: 'estado', operator: '==', value: 'cerrado' },
      ]);

      // Ordenar por fecha descendente (más recientes primero)
      turnosCerrados.sort((a, b) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });

      setTurnos(turnosCerrados);
      setTurnosFiltrados(turnosCerrados);
    } catch (error) {
      console.error('Error cargando turnos:', error);
      toast.error('Error al cargar los turnos cerrados');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...turnos];

    // Filtro por fecha desde
    if (fechaDesde) {
      resultado = resultado.filter((t) => t.fecha >= fechaDesde);
    }

    // Filtro por fecha hasta
    if (fechaHasta) {
      resultado = resultado.filter((t) => t.fecha <= fechaHasta);
    }

    // Filtro por tipo de turno
    if (tipoTurno !== 'todos') {
      resultado = resultado.filter((t) => t.tipo === tipoTurno);
    }

    // Búsqueda por cajero
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (t) =>
          t.cajeroNombre.toLowerCase().includes(busquedaLower) ||
          t.encargadoNombre?.toLowerCase().includes(busquedaLower)
      );
    }

    setTurnosFiltrados(resultado);
  }, [fechaDesde, fechaHasta, tipoTurno, busqueda, turnos]);

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setTipoTurno('todos');
    setBusqueda('');
  };

  const verDetalles = (turno: Turno) => {
    setTurnoSeleccionado(turno);
    setModalAbierto(true);
  };

  const exportarPDF = async (turno: Turno) => {
    try {
      await exportarCortePDF(turno);
      toast.success('PDF exportado correctamente');
    } catch (error) {
      console.error('Error exportando PDF:', error);
      toast.error('Error al exportar PDF');
    }
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), "dd 'de' MMMM, yyyy", { locale: es });
  };

  const formatearHora = (timestamp: any) => {
    if (!timestamp) return '-';
    const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(fecha, 'HH:mm', { locale: es });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Fecha Desde */}
            <div className="space-y-2">
              <Label htmlFor="fecha-desde">Desde</Label>
              <Input
                id="fecha-desde"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>

            {/* Fecha Hasta */}
            <div className="space-y-2">
              <Label htmlFor="fecha-hasta">Hasta</Label>
              <Input
                id="fecha-hasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>

            {/* Tipo de Turno */}
            <div className="space-y-2">
              <Label htmlFor="tipo-turno">Tipo de Turno</Label>
              <Select value={tipoTurno} onValueChange={setTipoTurno}>
                <SelectTrigger id="tipo-turno">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="matutino">Matutino</SelectItem>
                  <SelectItem value="vespertino">Vespertino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Búsqueda */}
            <div className="space-y-2">
              <Label htmlFor="busqueda">Buscar Cajero</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Nombre del cajero..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de Turnos */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Turnos Cerrados</h3>
            <p className="text-sm text-muted-foreground">
              {turnosFiltrados.length} turnos encontrados
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : turnosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron turnos cerrados con los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cajero</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Total Ventas</TableHead>
                  <TableHead>Efectivo</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turnosFiltrados.map((turno) => (
                  <TableRow key={turno.id}>
                    <TableCell className="font-medium">
                      {formatearFecha(turno.fecha)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={turno.tipo === 'matutino' ? 'default' : 'secondary'}>
                        {turno.tipo === 'matutino' ? '🌅 Matutino' : '🌆 Vespertino'}
                      </Badge>
                    </TableCell>
                    <TableCell>{turno.cajeroNombre}</TableCell>
                    <TableCell>
                      {formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatearMoneda(turno.resumen.totalVentas)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Esperado: </span>
                          {formatearMoneda(turno.corte?.efectivoEsperado || 0)}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Real: </span>
                          {formatearMoneda(turno.corte?.efectivoReal || 0)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          !turno.corte?.diferencia
                            ? 'outline'
                            : turno.corte.diferencia === 0
                            ? 'default'
                            : turno.corte.diferencia > 0
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {formatearMoneda(turno.corte?.diferencia || 0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verDetalles(turno)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportarPDF(turno)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modal de Detalles */}
      {turnoSeleccionado && (
        <DetallesTurnoModal
          turno={turnoSeleccionado}
          open={modalAbierto}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}
