'use client';

import { useEffect, useMemo, useState } from 'react';
import { Can, ProtectedRoute } from '@/components/auth';
import { usuariosService } from '@/lib/services';
import type { Rol, Usuario } from '@/lib/types/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ROLES: Rol[] = ['admin', 'encargado', 'cajera', 'cocina', 'repartidor'];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    setLoading(true);
    try {
      unsubscribe = usuariosService.onUsuariosActivosChange(
        (items) => {
          setUsuarios(items);
          setLoading(false);
        },
        (err) => {
          setError(err.message || 'Error cargando usuarios');
          setLoading(false);
        }
      );
    } catch (e: any) {
      setError(e?.message || 'Firebase no está configurado');
      setLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const sorted = useMemo(
    () => usuarios.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [usuarios]
  );

  const handleChangeRol = async (userId: string, rol: Rol) => {
    setSavingId(userId);
    try {
      await usuariosService.updateRol(userId, rol);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}> 
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-foreground">Cargando usuarios...</div>
            ) : error ? (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive px-4 py-3 rounded-lg">{error}</div>
            ) : (
              <div className="space-y-3">
                {sorted.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 border-b border-border pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate text-foreground">{u.nombre} {u.apellido}</div>
                      <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Can action="usuarios:update:rol" fallback={<span className="text-sm text-foreground">{u.rol}</span>}>
                        <select
                          className="border border-input rounded px-2 py-1 text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition"
                          value={u.rol}
                          onChange={(e) => handleChangeRol(u.id, e.target.value as Rol)}
                          disabled={savingId === u.id}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </Can>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Can action="usuarios:backfill:rol">
          <Button
            variant="secondary"
            onClick={async () => {
              const updated = await usuariosService.backfillRoles('cajera');
              // simple feedback en consola para evitar dependencia UI adicional
              console.log(`Backfill completado. Usuarios actualizados: ${updated}`);
            }}
          >
            Backfill roles faltantes (cajera)
          </Button>
        </Can>
      </div>
    </ProtectedRoute>
  );
}


