'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Colonia } from '@/lib/types/firestore';
import { coloniasService } from '@/lib/services/colonias.service';
import { Plus, Edit, Power, Trash2, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ModalColonia } from './ModalColonia';

export function GestionColonias() {
  const [colonias, setColonias] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [coloniaEditar, setColoniaEditar] = useState<Colonia | null>(null);
  const [accionando, setAccionando] = useState<string | null>(null);

  useEffect(() => {
    cargarColonias();
  }, []);

  const cargarColonias = async () => {
    try {
      setLoading(true);
      const data = await coloniasService.getAll();
      // Ordenar por nombre
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setColonias(data);
    } catch (error) {
      console.error('Error cargando colonias:', error);
      toast.error('Error al cargar las colonias');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaColonia = () => {
    setColoniaEditar(null);
    setModalOpen(true);
  };

  const handleEditarColonia = (colonia: Colonia) => {
    setColoniaEditar(colonia);
    setModalOpen(true);
  };

  const handleToggleActiva = async (colonia: Colonia) => {
    try {
      setAccionando(colonia.id);
      await coloniasService.toggleActiva(colonia.id);
      toast.success(
        `Colonia ${colonia.activa ? 'desactivada' : 'activada'} correctamente`
      );
      await cargarColonias();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast.error('Error al cambiar el estado de la colonia');
    } finally {
      setAccionando(null);
    }
  };

  const handleEliminarColonia = async (colonia: Colonia) => {
    if (
      !confirm(
        `¿Estás seguro de eliminar la colonia "${colonia.nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      setAccionando(colonia.id);
      await coloniasService.delete(colonia.id);
      toast.success('Colonia eliminada correctamente');
      await cargarColonias();
    } catch (error) {
      console.error('Error eliminando colonia:', error);
      toast.error('Error al eliminar la colonia');
    } finally {
      setAccionando(null);
    }
  };

  const handleModalClose = async (actualizado: boolean) => {
    setModalOpen(false);
    setColoniaEditar(null);
    if (actualizado) {
      await cargarColonias();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              Colonias Registradas ({colonias.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Gestiona las colonias con servicio a domicilio
            </p>
          </div>
          <Button onClick={handleNuevaColonia} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Colonia
          </Button>
        </div>

        {/* Tabla */}
        {colonias.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <div className="text-5xl mb-2">📍</div>
              <p className="text-lg font-medium">No hay colonias registradas</p>
              <p className="text-sm">
                Agrega colonias para comenzar a asignar costos de envío
              </p>
            </div>
            <Button onClick={handleNuevaColonia} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Primera Colonia
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Costo de Envío</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colonias.map((colonia) => (
                  <TableRow key={colonia.id}>
                    <TableCell className="font-medium">
                      {colonia.nombre}
                    </TableCell>
                    <TableCell>
                      {colonia.zona ? (
                        <Badge variant="outline">{colonia.zona}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Sin zona
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(colonia.costoEnvio)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={colonia.activa ? 'default' : 'secondary'}
                        className={
                          colonia.activa
                            ? 'bg-green-500/10 text-green-700 border-green-500/20'
                            : ''
                        }
                      >
                        {colonia.activa ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditarColonia(colonia)}
                          disabled={accionando === colonia.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActiva(colonia)}
                          disabled={accionando === colonia.id}
                          className={
                            colonia.activa
                              ? 'hover:bg-yellow-50'
                              : 'hover:bg-green-50'
                          }
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminarColonia(colonia)}
                          disabled={accionando === colonia.id}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="font-medium text-blue-900 mb-1">
            💡 Acerca de las colonias
          </p>
          <ul className="text-blue-700 space-y-1 text-xs list-disc list-inside">
            <li>Solo las colonias activas aparecen en el formulario de pedidos</li>
            <li>El costo de envío se asigna automáticamente al seleccionar la colonia</li>
            <li>Si una colonia no aparece, no hay servicio a esa zona</li>
            <li>Puedes desactivar temporalmente una colonia sin eliminarla</li>
          </ul>
        </div>
      </Card>

      {/* Modal para crear/editar colonia */}
      <ModalColonia
        open={modalOpen}
        colonia={coloniaEditar}
        onClose={handleModalClose}
      />
    </>
  );
}
