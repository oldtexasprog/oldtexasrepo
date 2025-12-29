import { FormularioPedidoPublico } from '@/components/publico/FormularioPedidoPublico';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hacer Pedido - Old Texas BBQ',
  description:
    'Ordena tu BBQ favorito en línea. Deliciosas costillas, brisket y más al estilo Texas.',
};

export default function PedirPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-white">
                🍖 Old Texas BBQ
              </h1>
              <p className="text-white/90 mt-1">
                Auténtico sabor del sur de Texas
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-white/80">Monterrey Nuevo Leon, Mexico</p>
              <p className="text-lg font-semibold text-white">📞 878-XXX-XXXX</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <FormularioPedidoPublico />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 bottom-0 w-full text-gray-300 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Old Texas BBQ. Todos los derechos
            reservados.
          </p>
          <p className="text-xs mt-2 text-gray-400">
            El mejor BBQ estilo Texas en Piedras Negras
          </p>
        </div>
      </footer>
    </div>
  );
}
