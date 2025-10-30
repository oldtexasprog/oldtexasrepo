import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-4xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-muted-foreground mb-8">
          No tienes permisos suficientes para acceder a esta página.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Ir al Dashboard
          </Link>
          <Link
            href="/"
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
