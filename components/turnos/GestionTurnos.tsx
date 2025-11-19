'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTurnoActual } from '@/lib/hooks/useTurnoActual';
import { turnosService } from '@/lib/services';
import { useUserData } from '@/lib/hooks/useUserData';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  LogIn,
  LogOut,
} from 'lucide-react';
import type { TipoTurno } from '@/lib/types/firestore';

export function GestionTurnos() {
  const { turno, loading, reload } = useTurnoActual();
  const { userData } = useUserData();
  const [procesando, setProcesando] = useState(false);

  // Estado para apertura
  const [datosApertura, setDatosApertura] = useState({
    tipo: 'matutino' as TipoTurno,
    fondoInicial: '',
  });

  // Estado para cierre
  const [datosCierre, setDatosCierre] = useState({
    efectivoReal: '',
    observaciones: '',
  });

  const handleAbrirTurno = async () => {
    if (!userData) {
      toast.error('No se pudo obtener la información del usuario');
      return;
    }

    if (!datosApertura.fondoInicial || parseFloat(datosApertura.fondoInicial) < 0) {
      toast.error('Ingresa un fondo inicial válido');
      return;
    }

    try {
      setProcesando(true);

      await turnosService.abrirTurno(
        datosApertura.tipo,
        parseFloat(datosApertura.fondoInicial),
        userData.id,
        userData.nombre,
        userData.id, // Asumiendo que el mismo usuario es cajero y encargado
        userData.nombre
      );

      toast.success('Turno abierto exitosamente');
      setDatosApertura({ tipo: 'matutino', fondoInicial: '' });
      reload();
    } catch (error: any) {
      console.error('Error abriendo turno:', error);
      toast.error(error?.message || 'Error al abrir el turno');
    } finally {
      setProcesando(false);
    }
  };

  const handleCerrarTurno = async () => {
    if (!turno) {
      toast.error('No hay un turno activo para cerrar');
      return;
    }

    if (!datosCierre.efectivoReal || parseFloat(datosCierre.efectivoReal) < 0) {
      toast.error('Ingresa el efectivo real contado');
      return;
    }

    try {
      setProcesando(true);

      await turnosService.cerrarTurno(
        turno.id,
        parseFloat(datosCierre.efectivoReal),
        datosCierre.observaciones
      );

      toast.success('Turno cerrado exitosamente');
      setDatosCierre({ efectivoReal: '', observaciones: '' });
      reload();
    } catch (error: any) {
      console.error('Error cerrando turno:', error);
      toast.error(error?.message || 'Error al cerrar el turno');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando información del turno...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado actual del turno */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Estado del Turno</h2>
          </div>
          {turno ? (
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-lg px-4 py-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Turno Abierto
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-lg px-4 py-1">
              <XCircle className="h-4 w-4 mr-2" />
              Sin Turno Activo
            </Badge>
          )}
        </div>

        {turno ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tipo de Turno
              </p>
              <p className="font-semibold capitalize">{turno.tipo}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora de Inicio
              </p>
              <p className="font-semibold">
                {turno.horaInicio.toDate().toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Cajero
              </p>
              <p className="font-semibold">{turno.cajeroNombre}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Fondo Inicial
              </p>
              <p className="font-semibold">{formatCurrency(turno.fondoInicial)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Ventas</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(turno.totales.totalVentas)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Efectivo</p>
              <p className="font-semibold">{formatCurrency(turno.totales.efectivo)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tarjeta</p>
              <p className="font-semibold">{formatCurrency(turno.totales.tarjeta)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Transferencias</p>
              <p className="font-semibold">{formatCurrency(turno.totales.transferencia)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground">
              No hay un turno activo en este momento
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Abre un nuevo turno para comenzar a operar
            </p>
          </div>
        )}
      </Card>

      {/* Apertura de turno */}
      {!turno && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <LogIn className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold">Abrir Nuevo Turno</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="tipo-turno">Tipo de Turno</Label>
              <Select
                value={datosApertura.tipo}
                onValueChange={(value) =>
                  setDatosApertura({ ...datosApertura, tipo: value as TipoTurno })
                }
              >
                <SelectTrigger id="tipo-turno">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matutino">Matutino</SelectItem>
                  <SelectItem value="vespertino">Vespertino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fondo-inicial">Fondo Inicial</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fondo-inicial"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={datosApertura.fondoInicial}
                  onChange={(e) =>
                    setDatosApertura({ ...datosApertura, fondoInicial: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Cantidad de efectivo inicial en caja
              </p>
            </div>
          </div>

          {userData && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Información del turno:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Cajero:</span> {userData.nombre}
                </div>
                <div>
                  <span className="font-medium">Encargado:</span> {userData.nombre}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={handleAbrirTurno}
              disabled={procesando || !datosApertura.fondoInicial}
              className="gap-2"
            >
              {procesando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Abriendo...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Abrir Turno
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Cierre de turno */}
      {turno && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <LogOut className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold">Cerrar Turno</h2>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="efectivo-real">Efectivo Real Contado *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="efectivo-real"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={datosCierre.efectivoReal}
                  onChange={(e) =>
                    setDatosCierre({ ...datosCierre, efectivoReal: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Cuenta todo el efectivo en caja (incluyendo el fondo inicial)
              </p>
            </div>

            {datosCierre.efectivoReal && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Efectivo esperado:</span>
                  <span className="font-medium">
                    {formatCurrency(turno.fondoInicial + turno.totales.efectivo)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Efectivo contado:</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(datosCierre.efectivoReal))}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Diferencia:</span>
                  <span
                    className={
                      parseFloat(datosCierre.efectivoReal) -
                        (turno.fondoInicial + turno.totales.efectivo) >=
                      0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {formatCurrency(
                      parseFloat(datosCierre.efectivoReal) -
                        (turno.fondoInicial + turno.totales.efectivo)
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="observaciones-cierre">Observaciones</Label>
              <Textarea
                id="observaciones-cierre"
                placeholder="Agrega notas sobre el cierre del turno (opcional)"
                value={datosCierre.observaciones}
                onChange={(e) =>
                  setDatosCierre({ ...datosCierre, observaciones: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDatosCierre({ efectivoReal: '', observaciones: '' })}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCerrarTurno}
              disabled={procesando || !datosCierre.efectivoReal}
              className="gap-2"
            >
              {procesando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Cerrar Turno
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
