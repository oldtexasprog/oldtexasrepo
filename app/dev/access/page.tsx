'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateDevKey, grantDevAccess, hasDevAccess } from '@/lib/dev-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code2, Lock, Terminal } from 'lucide-react';

export default function DevAccessPage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Si ya tiene acceso, redirigir a /dev/tests
  useEffect(() => {
    if (hasDevAccess()) {
      router.push('/dev/tests');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay para evitar brute force
    setTimeout(() => {
      if (validateDevKey(key)) {
        grantDevAccess();
        router.push('/dev/tests');
      } else {
        setError('Clave incorrecta. Acceso denegado.');
        setKey('');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      {/* Animated blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Card className="w-full max-w-md relative z-10 border-border bg-card/90 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30 transform hover:scale-105 transition-transform">
            <Lock className="w-10 h-10 text-white" />
          </div>

          <div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Acceso a Desarrollo
            </CardTitle>
            <CardDescription className="mt-3 text-base">
              Ingresa la clave de acceso para continuar
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="●●●●●●●●"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={isLoading}
                className="h-12"
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!key || isLoading}
              className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:opacity-90 shadow-lg shadow-accent/30 transform hover:scale-[1.02] transition-all font-semibold text-base"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Acceder al Sistema'
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-border">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Terminal className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Páginas de Desarrollo
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pruebas de código y playground de componentes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Code2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Ambiente Protegido
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Acceso restringido solo para desarrollo
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center border-t border-border">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
            >
              ← Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
