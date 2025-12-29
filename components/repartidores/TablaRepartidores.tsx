'use client';

import { useState } from 'react';
import { Repartidor } from '@/lib/types/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from 'lucide-react';
import { repartidoresService } from '@/lib/services/repartidores.service';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatters';

interface TablaRepartidoresProps {
  repartidores: Repartidor[];
  onEdit: (repartidor: Repartidor) => void;
  onRefresh: () => void;
}

export function TablaRepartidores({
  repartidores,
  onEdit,
  onRefresh,
}: TablaRepartidoresProps) {
  const [repartidorAEliminar, setRepartidorAEliminar] = useState<Repartidor | null>(
    null
  );
  const [eliminando, setEliminando] = useState(false);

  const handleToggleActivo = async (repartidor: Repartidor) => {
    try {
      await repartidoresService.toggleActivo(repartidor.id, !repartidor.activo);
      toast.success(
        `Repartidor ${repartidor.activo ? 'desactivado' : 'activado'} correctamente`
      );
      onRefresh();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error('Error al cambiar el estado del repartidor');
    }
  };

  const handleToggleDisponible = async (repartidor: Repartidor) => {
    if (!repartidor.activo) {
      toast.error('No puedes cambiar la disponibilidad de un repartidor inactivo');
      return;
    }

    try {
      await repartidoresService.toggleDisponibilidad(
        repartidor.id,
        !repartidor.disponible
      );
      toast.success(
        `Repartidor marcado como ${repartidor.disponible ? 'no disponible' : 'disponible'}`
      );
      onRefresh();
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      toast.error('Error al cambiar la disponibilidad del repartidor');
    }
  };

  const handleEliminar = async () => {
    if (!repartidorAEliminar) return;

    try {
      setEliminando(true);
      await repartidoresService.delete(repartidorAEliminar.id);
      toast.success('Repartidor eliminado correctamente');
      setRepartidorAEliminar(null);
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar repartidor:', error);
      toast.error('Error al eliminar el repartidor');
    } finally {
      setEliminando(false);
    }
  };

  if (repartidores.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No hay repartidores registrados. Crea uno para comenzar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Comisión</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repartidores.map((repartidor) => (
              <TableRow key={repartidor.id}>
                {/* Nombre */}
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">
                      {repartidor.nombre} {repartidor.apellido}
                    </p>
                    {repartidor.usuarioId ? (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <p className="text-xs text-green-700">
                          Acceso al sistema
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3 text-orange-600" />
                        <p className="text-xs text-orange-700">
                          Sin acceso
                        </p>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Teléfono */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {repartidor.telefono}
                  </div>
                </TableCell>

                {/* Comisión */}
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {repartidor.tipoComision === 'fijo'
                      ? formatCurrency(repartidor.comisionPorDefecto)
                      : `${repartidor.comisionPorDefecto}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {repartidor.tipoComision === 'fijo' ? 'Fijo' : 'Porcentaje'}
                  </p>
                </TableCell>

                {/* Pedidos */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="font-medium">
                        {repartidor.pedidosCompletados}
                      </span>
                      <span className="text-muted-foreground">completados</span>
                    </div>
                    {repartidor.pedidosCancelados > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span>{repartidor.pedidosCancelados} cancelados</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Saldo Pendiente */}
                <TableCell>
                  <div className="space-y-1">
                    <p
                      className={`font-semibold ${
                        repartidor.saldoPendiente > 0
                          ? 'text-orange-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatCurrency(repartidor.saldoPendiente)}
                    </p>
                    {repartidor.ultimaLiquidacion && (
                      <p className="text-xs text-muted-foreground">
                        Última liq:{' '}
                        {repartidor.ultimaLiquidacion.toDate().toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={repartidor.activo ? 'default' : 'secondary'}
                      className="w-fit"
                    >
                      {repartidor.activo ? (
                        <>
                          <UserCheck className="mr-1 h-3 w-3" />
                          Activo
                        </>
                      ) : (
                        <>
                          <UserX className="mr-1 h-3 w-3" />
                          Inactivo
                        </>
                      )}
                    </Badge>

                    {repartidor.activo && (
                      <Badge
                        variant={repartidor.disponible ? 'outline' : 'secondary'}
                        className={
                          repartidor.disponible
                            ? 'border-green-500 text-green-700'
                            : ''
                        }
                      >
                        {repartidor.disponible ? 'Disponible' : 'No disponible'}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => onEdit(repartidor)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleToggleActivo(repartidor)}
                      >
                        {repartidor.activo ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>

                      {repartidor.activo && (
                        <DropdownMenuItem
                          onClick={() => handleToggleDisponible(repartidor)}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Marcar como{' '}
                          {repartidor.disponible ? 'no disponible' : 'disponible'}
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => setRepartidorAEliminar(repartidor)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={!!repartidorAEliminar}
        onOpenChange={(open) => !open && setRepartidorAEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar al repartidor{' '}
              <strong>
                {repartidorAEliminar?.nombre} {repartidorAEliminar?.apellido}
              </strong>
              . Esta acción no se puede deshacer.
              {repartidorAEliminar && repartidorAEliminar.saldoPendiente > 0 && (
                <div className="mt-2 rounded-md bg-orange-50 p-3 text-orange-900">
                  ⚠️ Este repartidor tiene un saldo pendiente de{' '}
                  <strong>
                    {formatCurrency(repartidorAEliminar.saldoPendiente)}
                  </strong>
                  . Asegúrate de liquidar antes de eliminar.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEliminar}
              disabled={eliminando}
              className="bg-red-600 hover:bg-red-700"
            >
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
