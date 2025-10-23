'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hasDevAccess, revokeDevAccess } from '@/lib/dev-auth';
import { Button } from '@/components/ui/button';
import { Code2, FlaskConical, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar acceso
    const checkAccess = () => {
      const access = hasDevAccess();
      setHasAccess(access);
      setIsChecking(false);

      // Si no tiene acceso y no está en /dev/access, redirigir
      if (!access && !pathname.includes('/dev/access')) {
        router.push('/dev/access');
      }
    };

    checkAccess();
  }, [pathname, router]);

  const handleLogout = () => {
    revokeDevAccess();
    router.push('/');
  };

  // Mientras verifica, mostrar nada
  if (isChecking) {
    return null;
  }

  // Si está en la página de acceso, no mostrar layout
  if (pathname.includes('/dev/access')) {
    return <>{children}</>;
  }

  // Si no tiene acceso, no renderizar nada (ya se redirigió)
  if (!hasAccess) {
    return null;
  }

  const navItems = [
    {
      href: '/dev/tests',
      label: 'Pruebas de Código',
      icon: FlaskConical,
      description: 'Ejecuta y prueba código',
    },
    {
      href: '/dev/playground',
      label: 'Playground',
      icon: Sparkles,
      description: 'Crea componentes UI',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Dev Environment
                </h1>
                <p className="text-xs text-slate-400">
                  Old Texas BBQ - CRM
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Volver al Inicio
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 hover:bg-red-950/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>
              Ambiente de desarrollo protegido
            </p>
            <p>
              Old Texas BBQ - CRM © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
