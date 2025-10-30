'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Rol } from '@/lib/types/firestore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Rol[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no hay usuario autenticado, redirigir a login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Si hay roles permitidos y el usuario no tiene uno válido
      if (allowedRoles && userData) {
        if (!allowedRoles.includes(userData.rol)) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [user, userData, loading, router, redirectTo, allowedRoles]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no renderizar nada (el useEffect ya redirigió)
  if (!user) {
    return null;
  }

  // Si hay roles permitidos y no los tiene, no renderizar
  if (allowedRoles && userData && !allowedRoles.includes(userData.rol)) {
    return null;
  }

  // Usuario autenticado y autorizado, renderizar children
  return <>{children}</>;
}
