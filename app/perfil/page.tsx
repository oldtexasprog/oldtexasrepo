'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { usuariosService } from '@/lib/services';
import { ProtectedRoute } from '@/components/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { Usuario } from '@/lib/types/firestore';

function PerfilContent() {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!user?.uid) {
      setError('No se pudo obtener el ID del usuario');
      setLoading(false);
      return;
    }

    try {
      await usuariosService.update(user.uid, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 dark:to-muted/10 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-texas-gradient text-white inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4">
            <User className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal
          </p>
        </div>

        {/* Información de cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Cuenta</CardTitle>
            <CardDescription>
              Datos básicos de tu cuenta en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email (solo lectura) */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={userData.email}
                    disabled
                    className="pl-10 bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  El correo no se puede cambiar
                </p>
              </div>

              {/* Rol (solo lectura) */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rol
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={userData.rol}
                    disabled
                    className="pl-10 bg-muted/50 cursor-not-allowed capitalize"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Asignado por el administrador
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información personal editable */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tus datos personales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="text-sm font-medium mb-2 block">
                    Nombre
                  </label>
                  <Input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="apellido" className="text-sm font-medium mb-2 block">
                    Apellido
                  </label>
                  <Input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="text-sm font-medium mb-2 block">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="5512345678"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Success message */}
              {success && (
                <div className="bg-green-100 dark:bg-green-900/20 border border-green-600 dark:border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Perfil actualizado exitosamente
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Contraseña</p>
                  <p className="text-sm text-muted-foreground">
                    Última actualización hace 2 días
                  </p>
                </div>
              </div>
              <Link href="/cambiar-password">
                <Button variant="outline">
                  Cambiar contraseña
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Link al dashboard */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            ← Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <PerfilContent />
    </ProtectedRoute>
  );
}
