'use client';

import { useState, useEffect } from 'react';
import { Repartidor } from '@/lib/types/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Users, TrendingUp, DollarSign } from 'lucide-react';
import { repartidoresService } from '@/lib/services/repartidores.service';
import { FormularioRepartidor } from './FormularioRepartidor';
import { TablaRepartidores } from './TablaRepartidores';
import { toast } from 'sonner';

type FiltroEstado = 'todos' | 'activos' | 'inactivos' | 'disponibles';

export function GestionRepartidores() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [repartidoresFiltrados, setRepartidoresFiltrados] = useState<Repartidor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [repartidorEditando, setRepartidorEditando] = useState<Repartidor | undefined>(
    undefined
  );

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos');

  // Cargar repartidores
  const cargarRepartidores = async () => {
    try {
      setLoading(true);
      const data = await repartidoresService.getAll({
        orderByField: 'nombre',
        orderDirection: 'asc',
      });
      setRepartidores(data);
    } catch (error) {
      console.error('Error al cargar repartidores:', error);
      toast.error('Error al cargar repartidores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRepartidores();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...repartidores];

    // Filtro por búsqueda (nombre, apellido, teléfono)
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (r) =>
          r.nombre.toLowerCase().includes(busquedaLower) ||
          r.apellido.toLowerCase().includes(busquedaLower) ||
          r.telefono.includes(busqueda)
      );
    }

    // Filtro por estado
    switch (filtroEstado) {
      case 'activos':
        resultado = resultado.filter((r) => r.activo);
        break;
      case 'inactivos':
        resultado = resultado.filter((r) => !r.activo);
        break;
      case 'disponibles':
        resultado = resultado.filter((r) => r.activo && r.disponible);
        break;
    }

    setRepartidoresFiltrados(resultado);
  }, [repartidores, busqueda, filtroEstado]);

  const handleNuevoRepartidor = () => {
    setRepartidorEditando(undefined);
    setModalOpen(true);
  };

  const handleEditarRepartidor = (repartidor: Repartidor) => {
    setRepartidorEditando(repartidor);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    cargarRepartidores();
  };

  // Calcular estadísticas
  const stats = {
    total: repartidores.length,
    activos: repartidores.filter((r) => r.activo).length,
    disponibles: repartidores.filter((r) => r.activo && r.disponible).length,
    saldoTotal: repartidores.reduce((sum, r) => sum + r.saldoPendiente, 0),
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-lg bg-muted"></div>
        <div className="h-96 animate-pulse rounded-lg bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Repartidores
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Disponibles
              </p>
              <p className="text-2xl font-bold text-blue-600">{stats.disponibles}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </p>
              <p className="text-2xl font-bold text-orange-600">
                ${stats.saldoTotal.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtro por estado */}
          <Select
            value={filtroEstado}
            onValueChange={(value) => setFiltroEstado(value as FiltroEstado)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activos">Activos</SelectItem>
              <SelectItem value="inactivos">Inactivos</SelectItem>
              <SelectItem value="disponibles">Disponibles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón nuevo repartidor */}
        <Button onClick={handleNuevoRepartidor} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Repartidor
        </Button>
      </div>

      {/* Tabla de repartidores */}
      <TablaRepartidores
        repartidores={repartidoresFiltrados}
        onEdit={handleEditarRepartidor}
        onRefresh={handleSuccess}
      />

      {/* Modal de formulario */}
      <FormularioRepartidor
        open={modalOpen}
        onOpenChange={setModalOpen}
        repartidor={repartidorEditando}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
