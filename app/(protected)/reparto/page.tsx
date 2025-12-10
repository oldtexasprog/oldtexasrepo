'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { PedidosListosParaRecoger } from '@/components/reparto/PedidosListosParaRecoger';
import { MisPedidosAsignados } from '@/components/reparto/MisPedidosAsignados';
import { Package, User, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RepartoPage() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'listos' | 'asignados'>('listos');

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-texas">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                Panel de Reparto
              </h1>
              <p className="text-muted-foreground">
                Gestiona tus entregas y pedidos asignados
              </p>
            </div>

            {/* Info del repartidor */}
            {userData && (
              <div className="hidden md:flex items-center gap-3 bg-muted px-4 py-3 rounded-lg">
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {userData.nombre[0]}{userData.apellido[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{userData.nombre} {userData.apellido}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Repartidor
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'listos' | 'asignados')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="listos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pedidos Listos
            </TabsTrigger>
            <TabsTrigger value="asignados" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Mis Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listos">
            <PedidosListosParaRecoger />
          </TabsContent>

          <TabsContent value="asignados">
            <MisPedidosAsignados />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
