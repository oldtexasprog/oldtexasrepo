'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { LABELS_ROL } from '@/lib/types/firestore';
import { User, Settings, Lock, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { userData, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

            {/* User menu dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg transition"
              >
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {userData?.nombre?.[0]}{userData?.apellido?.[0]}
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-medium text-sm">{userData?.nombre} {userData?.apellido}</p>
                  <p className="text-xs text-muted-foreground">
                    {userData?.rol && LABELS_ROL[userData.rol]}
                  </p>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <p className="font-medium text-sm">{userData?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {userData?.rol && LABELS_ROL[userData.rol]}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span className="text-sm">Mi Perfil</span>
                      </Link>

                      <Link
                        href="/cambiar-password"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Cambiar Contraseña</span>
                      </Link>

                      <Link
                        href="/dashboard/usuarios"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm">Gestión de Usuarios</span>
                      </Link>
                    </div>

                    <div className="border-t border-border">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-destructive/10 text-destructive transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
              href="/turnos"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-bold mb-1">Turnos</h3>
              <p className="text-sm text-muted-foreground">
                Gestionar turnos del restaurante
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
              href="/bitacora"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-bold mb-1">Bitácora</h3>
              <p className="text-sm text-muted-foreground">
                Registro de pedidos del día
              </p>
            </a>

            <a
              href="/dashboard/usuarios"
              className="p-4 border border-border rounded-lg hover:bg-muted transition"
            >
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-bold mb-1">Usuarios</h3>
              <p className="text-sm text-muted-foreground">
                Gestión de usuarios del restaurante
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
  return <DashboardContent />;
}
