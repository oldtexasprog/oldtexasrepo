import { BitacoraDigital } from '@/components/pedidos/BitacoraDigital';

export default function BitacoraPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bitácora Digital</h1>
          <p className="text-muted-foreground">
            Registro completo de pedidos del día con totales automáticos
          </p>
        </div>
      </div>
      <BitacoraDigital />
    </div>
  );
}
