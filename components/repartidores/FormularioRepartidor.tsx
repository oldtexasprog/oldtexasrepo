'use client';

import { useState, useEffect } from 'react';
import { Repartidor, NuevoRepartidor, TipoComision } from '@/lib/types/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { User, Phone, DollarSign, Percent, Truck, Mail, Lock } from 'lucide-react';
import { repartidoresService } from '@/lib/services/repartidores.service';
import { usuariosService } from '@/lib/services/usuarios.service';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/useAuth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, getSecondaryAuth } from '@/lib/firebase/config';

interface FormularioRepartidorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repartidor?: Repartidor;
  onSuccess?: () => void;
}

export function FormularioRepartidor({
  open,
  onOpenChange,
  repartidor,
  onSuccess,
}: FormularioRepartidorProps) {
  const { user } = useAuth();
  const isEdit = !!repartidor;

  // Estado del formulario
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    activo: true,
    disponible: true,
    tipoComision: 'fijo' as TipoComision,
    comisionPorDefecto: 0,
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (repartidor) {
      setFormData({
        nombre: repartidor.nombre,
        apellido: repartidor.apellido,
        telefono: repartidor.telefono,
        email: '', // No mostrar email en edición
        password: '', // No mostrar password en edición
        activo: repartidor.activo,
        disponible: repartidor.disponible,
        tipoComision: repartidor.tipoComision,
        comisionPorDefecto: repartidor.comisionPorDefecto,
      });
    } else {
      // Reset form
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        password: '',
        activo: true,
        disponible: true,
        tipoComision: 'fijo',
        comisionPorDefecto: 0,
      });
    }
  }, [repartidor, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    if (!formData.apellido.trim()) {
      toast.error('El apellido es obligatorio');
      return;
    }

    if (!formData.telefono.trim()) {
      toast.error('El teléfono es obligatorio');
      return;
    }

    if (formData.telefono.length < 10) {
      toast.error('El teléfono debe tener al menos 10 dígitos');
      return;
    }

    // Validación de email y password solo para crear
    if (!isEdit) {
      if (!formData.email.trim()) {
        toast.error('El email es obligatorio');
        return;
      }

      if (!formData.email.includes('@')) {
        toast.error('El email no es válido');
        return;
      }

      if (!formData.password || formData.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    if (formData.comisionPorDefecto < 0) {
      toast.error('La comisión no puede ser negativa');
      return;
    }

    if (formData.tipoComision === 'porcentaje' && formData.comisionPorDefecto > 100) {
      toast.error('El porcentaje de comisión no puede ser mayor a 100%');
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // Actualizar repartidor existente
        await repartidoresService.update(repartidor.id, {
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          telefono: formData.telefono.trim(),
          activo: formData.activo,
          disponible: formData.disponible,
          tipoComision: formData.tipoComision,
          comisionPorDefecto: formData.comisionPorDefecto,
        } as any);

        toast.success('Repartidor actualizado correctamente');
      } else {
        // Crear usuario en Firebase Auth usando una instancia secundaria
        // para no afectar la sesión actual del admin/encargado
        let usuarioId: string | undefined;

        try {
          // Usar auth secundario para crear usuario sin afectar sesión principal
          const secondaryAuth = getSecondaryAuth();

          const userCredential = await createUserWithEmailAndPassword(
            secondaryAuth,
            formData.email.trim(),
            formData.password
          );
          usuarioId = userCredential.user.uid;

          // Crear documento de usuario en Firestore
          // NOTA: Esto se ejecuta con la sesión principal (admin/encargado)
          await usuariosService.createWithId(usuarioId, {
            email: formData.email.trim(),
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            telefono: formData.telefono.trim(),
            rol: 'repartidor',
            activo: formData.activo,
            fcmTokens: [],
            creadoPor: user?.uid || 'sistema',
            ultimaConexion: new Date() as any,
          } as any);
        } catch (authError: any) {
          console.error('Error al crear usuario:', authError);
          if (authError.code === 'auth/email-already-in-use') {
            toast.error('El email ya está registrado');
          } else {
            toast.error('Error al crear usuario: ' + authError.message);
          }
          return;
        }

        // Crear repartidor vinculado al usuario
        const nuevoRepartidor: NuevoRepartidor = {
          usuarioId, // Vincular con el usuario creado
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          telefono: formData.telefono.trim(),
          activo: formData.activo,
          disponible: formData.disponible,
          tipoComision: formData.tipoComision,
          comisionPorDefecto: formData.comisionPorDefecto,
          pedidosCompletados: 0,
          pedidosCancelados: 0,
          saldoPendiente: 0,
          creadoPor: user?.uid || 'sistema',
        };

        await repartidoresService.create(nuevoRepartidor);

        toast.success('Repartidor creado correctamente con acceso al sistema');
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar repartidor:', error);
      toast.error('Error al guardar el repartidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {isEdit ? 'Editar Repartidor' : 'Nuevo Repartidor'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del repartidor'
              : 'Completa la información para dar de alta un nuevo repartidor'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange('apellido', e.target.value)}
                  placeholder="Ej: García"
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono *
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="Ej: 8781234567"
                required
              />
            </div>

            {/* Campos de acceso (solo para nuevo) */}
            {!isEdit && (
              <>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Credenciales para acceder al sistema:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Ej: repartidor@oldtexas.com"
                      required={!isEdit}
                    />
                    <p className="text-xs text-muted-foreground">
                      Usará este email para iniciar sesión
                    </p>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Contraseña *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required={!isEdit}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mínimo 6 caracteres
                    </p>
                  </div>
                </div>

                {/* Información */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
                  <p className="font-semibold text-blue-900 mb-1">ℹ️ Información</p>
                  <p className="text-blue-800">
                    El repartidor podrá iniciar sesión con este email y contraseña para ver
                    sus pedidos asignados en la app.
                  </p>
                </div>
              </>
            )}

            {/* Mensaje para edición */}
            {isEdit && repartidor?.usuarioId && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                ℹ️ Este repartidor ya tiene una cuenta vinculada y puede acceder al
                sistema.
              </div>
            )}

            {isEdit && !repartidor?.usuarioId && (
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
                ⚠️ Este repartidor no tiene cuenta vinculada. No podrá acceder al
                sistema.
              </div>
            )}
          </div>

          {/* Comisiones */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Configuración de Comisiones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Comisión */}
              <div className="space-y-2">
                <Label htmlFor="tipoComision" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Tipo de Comisión
                </Label>
                <Select
                  value={formData.tipoComision}
                  onValueChange={(value) =>
                    handleChange('tipoComision', value as TipoComision)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fijo">Fijo (por pedido)</SelectItem>
                    <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comisión */}
              <div className="space-y-2">
                <Label htmlFor="comision" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Comisión por Defecto
                </Label>
                <div className="relative">
                  <Input
                    id="comision"
                    type="number"
                    min="0"
                    step={formData.tipoComision === 'fijo' ? '1' : '0.1'}
                    max={formData.tipoComision === 'porcentaje' ? '100' : undefined}
                    value={formData.comisionPorDefecto}
                    onChange={(e) =>
                      handleChange('comisionPorDefecto', parseFloat(e.target.value) || 0)
                    }
                    placeholder={
                      formData.tipoComision === 'fijo' ? 'Ej: 50' : 'Ej: 10'
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {formData.tipoComision === 'fijo' ? 'MXN' : '%'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.tipoComision === 'fijo'
                    ? 'Monto fijo que se paga por cada pedido entregado'
                    : 'Porcentaje del total del pedido que se paga como comisión'}
                </p>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Estado</h3>

            <div className="flex flex-col gap-4">
              {/* Activo */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="activo" className="text-base">
                    Repartidor Activo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.activo
                      ? 'Este repartidor está activo en el sistema'
                      : 'Este repartidor está inactivo y no aparecerá en listados'}
                  </p>
                </div>
                <Switch
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={(checked) => handleChange('activo', checked)}
                />
              </div>

              {/* Disponible */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="disponible" className="text-base">
                    Disponible para Repartos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.disponible
                      ? 'Este repartidor está disponible para asignar pedidos'
                      : 'Este repartidor no está disponible (descanso, ocupado, etc.)'}
                  </p>
                </div>
                <Switch
                  id="disponible"
                  checked={formData.disponible}
                  onCheckedChange={(checked) => handleChange('disponible', checked)}
                  disabled={!formData.activo}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Guardando...'
                : isEdit
                  ? 'Actualizar Repartidor'
                  : 'Crear Repartidor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
