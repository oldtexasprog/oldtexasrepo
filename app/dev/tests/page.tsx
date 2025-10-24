'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Package,
  Users,
  CreditCard,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ShoppingCart,
  Bike,
  ChefHat,
} from 'lucide-react';

export default function DevTestsPage() {
  const [loading, setLoading] = useState(false);

  const handleTestAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg shadow-orange-500/20">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Pruebas de Componentes
          </h1>
        </div>
        <p className="text-slate-400 ml-14">
          Visualiza y prueba todos los componentes UI del sistema
        </p>
      </div>

      <Tabs defaultValue="buttons" className="space-y-4">
        <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 backdrop-blur-sm">
          <TabsTrigger
            value="buttons"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            Botones
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="badges"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            Badges
          </TabsTrigger>
          <TabsTrigger
            value="forms"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            Formularios
          </TabsTrigger>
        </TabsList>

        {/* Botones */}
        <TabsContent value="buttons" className="space-y-4">
          <Card className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Variantes de Botones</CardTitle>
              <CardDescription className="text-slate-400">
                Diferentes estilos de botones usados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Botones Primarios
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    <Flame className="w-4 h-4 mr-2" />
                    Nuevo Pedido
                  </Button>
                  <Button
                    disabled
                    className="bg-gradient-to-r from-orange-500 to-red-600"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    Deshabilitado
                  </Button>
                  <Button
                    onClick={handleTestAction}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Con Loading
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Botones Secundarios
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Ver Clientes
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:bg-slate-800"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Productos
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Botones de Acción
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-700 text-green-400 hover:bg-green-950/20"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-700 text-red-400 hover:bg-red-950/20"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-700 text-blue-400 hover:bg-blue-950/20"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notificar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards */}
        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card de Pedido */}
            <Card className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">
                        Pedido #123
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Hace 5 minutos
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                    Pendiente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-300">
                  <p className="font-medium">Juan Pérez</p>
                  <p className="text-slate-400">2x Costillas BBQ</p>
                  <p className="text-slate-400">1x Alitas</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400">Total</span>
                  <span className="text-xl font-bold text-orange-500">
                    $45.00
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card de Cocina */}
            <Card className="border-green-800/50 bg-gradient-to-br from-green-950/30 to-green-900/10 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">
                        En Cocina
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Pedido #456
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    10 min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-300">
                  <p className="font-medium">María González</p>
                  <p className="text-slate-400">1x Pulled Pork</p>
                  <p className="text-slate-400">1x Ensalada</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-green-700/30">
                  <span className="text-sm text-slate-400">
                    Tiempo restante
                  </span>
                  <span className="text-sm font-bold text-green-400">
                    ~15 min
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card de Repartidor */}
            <Card className="border-blue-800/50 bg-gradient-to-br from-blue-950/30 to-blue-900/10 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Bike className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">
                        En Camino
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Pedido #789
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    <Bike className="w-3 h-3 mr-1" />
                    En ruta
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-300">
                  <p className="font-medium">Carlos Rodríguez</p>
                  <p className="text-slate-400">Repartidor: José Luis</p>
                  <p className="text-slate-400">Calle Principal #123</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-blue-700/30">
                  <span className="text-sm text-slate-400">Distancia</span>
                  <span className="text-sm font-bold text-blue-400">
                    2.3 km
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Badges */}
        <TabsContent value="badges" className="space-y-4">
          <Card className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Estados y Badges</CardTitle>
              <CardDescription className="text-slate-400">
                Diferentes estados visuales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Estados de Pedidos
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Pendiente
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    <ChefHat className="w-3 h-3 mr-1" />
                    En Cocina
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    <Package className="w-3 h-3 mr-1" />
                    Listo
                  </Badge>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                    <Bike className="w-3 h-3 mr-1" />
                    En Camino
                  </Badge>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Entregado
                  </Badge>
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                    <XCircle className="w-3 h-3 mr-1" />
                    Cancelado
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Prioridades
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-400"
                  >
                    Baja
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-600 text-blue-400"
                  >
                    Media
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-orange-600 text-orange-400"
                  >
                    Alta
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-red-600 text-red-400"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Urgente
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  Tipos de Pago
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Efectivo
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Tarjeta
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Transferencia
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formularios */}
        <TabsContent value="forms" className="space-y-4">
          <Card className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                Componentes de Formulario
              </CardTitle>
              <CardDescription className="text-slate-400">
                Inputs, selects y otros elementos de formulario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300 font-medium">
                    Nombre del Cliente
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ingresa el nombre..."
                    className="bg-slate-800/50 border-slate-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300 font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="555-1234"
                    className="bg-slate-800/50 border-slate-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    className="bg-slate-800/50 border-slate-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-slate-300 font-medium"
                  >
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    placeholder="Calle Principal #123"
                    className="bg-slate-800/50 border-slate-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
