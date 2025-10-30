'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Rol } from '@/lib/types/firestore';

/**
 * HOC para proteger componentes por rol
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Rol[]
) {
  return function WithRoleComponent(props: P) {
    const { userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && userData) {
        if (!allowedRoles.includes(userData.rol)) {
          router.push('/unauthorized');
        }
      }
    }, [userData, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!userData || !allowedRoles.includes(userData.rol)) {
      return null;
    }

    return <Component {...props} />;
  };
}
