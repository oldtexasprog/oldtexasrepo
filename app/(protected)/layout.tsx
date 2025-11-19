'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && !userData) {
      // Usuario no autenticado, redirigir a login
      router.push('/login');
    }
  }, [userData, loading, router]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, no mostrar nada (se redirigirá)
  if (!userData) {
    return null;
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
}
