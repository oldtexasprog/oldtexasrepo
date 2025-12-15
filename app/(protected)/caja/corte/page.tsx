import { CorteCaja } from '@/components/caja/CorteCaja';

export default function CorteCajaPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Corte de Caja - Histórico</h1>
        <p className="text-muted-foreground">
          Consulta y exporta los cortes de caja de turnos anteriores
        </p>
      </div>

      <CorteCaja />
    </div>
  );
}
