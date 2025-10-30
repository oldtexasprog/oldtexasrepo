'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { LABELS_ROL } from '@/lib/types/firestore';

function DashboardContent() {
  const { userData, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-texas">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🍖 Dashboard - Old Texas BBQ
              </h1>
              <p className="text-muted-foreground">
                Bienvenido, {userData?.nombre} {userData?.apellido}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg hover:bg-destructive/90 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Info del usuario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-muted-foreground">
              Rol del Usuario
            </h3>
            <p className="text-2xl font-bold text-primary">
              {userData?.rol && LABELS_ROL[userData.rol]}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-muted-foreground">
              Email
            </h3>
            <p className="text-lg font-medium truncate">{userData?.email}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-muted-foreground">
              Estado
            </h3>
            <p className="text-lg font-medium">
              {userData?.activo ? (
                <span className="text-success">✓ Activo</span>
              ) : (
                <span className="text-destructive">✗ Inactivo</span>
              )}
            </p>
          </div>
        </div>

        {/* Contenido según rol */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/pedidos"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-bold mb-1">Pedidos</h3>
              <p className="text-sm text-muted-foreground">
                Gestionar pedidos del restaurante
              </p>
            </a>

            <a
              href="/cocina"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">👨‍🍳</div>
              <h3 className="font-bold mb-1">Cocina</h3>
              <p className="text-sm text-muted-foreground">
                Ver comandas en tiempo real
              </p>
            </a>

            <a
              href="/reparto"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">🛵</div>
              <h3 className="font-bold mb-1">Reparto</h3>
              <p className="text-sm text-muted-foreground">
                Gestión de entregas
              </p>
            </a>

            <a
              href="/reportes"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold mb-1">Reportes</h3>
              <p className="text-sm text-muted-foreground">
                Análisis y métricas
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
