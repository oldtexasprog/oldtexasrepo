import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        {/* Hero Section */}
        <div className="bg-texas-gradient text-white rounded-2xl p-12 max-w-2xl w-full shadow-texas">
          <h1 className="text-6xl font-bold text-center mb-4">
            🍖 Old Texas BBQ
          </h1>
          <p className="text-xl text-center opacity-90 mb-8">
            Sistema de Gestión Integral - CRM
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="bg-card text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              Entrar al Sistema
            </Link>
            <Link
              href="/docs"
              className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition"
            >
              Documentación
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-texas transition">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="font-bold text-lg mb-2">Gestión de Pedidos</h3>
            <p className="text-sm text-muted-foreground">
              Captura y seguimiento de pedidos en tiempo real desde múltiples canales
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-texas transition">
            <div className="text-4xl mb-4">👨‍🍳</div>
            <h3 className="font-bold text-lg mb-2">Vista de Cocina</h3>
            <p className="text-sm text-muted-foreground">
              Tablero tipo Kanban para gestión eficiente de comandas
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-texas transition">
            <div className="text-4xl mb-4">🛵</div>
            <h3 className="font-bold text-lg mb-2">Control de Reparto</h3>
            <p className="text-sm text-muted-foreground">
              Asignación y tracking de entregas con liquidaciones
            </p>
          </div>
        </div>
      </main>

      <ThemeToggle />
    </>
  );
}
