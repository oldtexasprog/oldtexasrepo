'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Flame,
  ShoppingCart,
  ChefHat,
  Bike,
  Clock,
  Package,
  Sparkles,
} from 'lucide-react';

export default function DevPlaygroundPage() {
  const [notificationCount, setNotificationCount] = useState(0);

  // Notificaciones de ejemplo
  const showSuccessToast = () => {
    toast.success('Pedido creado exitosamente', {
      description: 'El pedido #123 ha sido registrado en el sistema',
      icon: <CheckCircle2 className="w-5 h-5" />,
    });
    setNotificationCount((prev) => prev + 1);
  };

  const showErrorToast = () => {
    toast.error('Error al procesar pedido', {
      description: 'No se pudo conectar con el servidor. Intenta nuevamente.',
      icon: <XCircle className="w-5 h-5" />,
    });
    setNotificationCount((prev) => prev + 1);
  };

  const showWarningToast = () => {
    toast.warning('Pedido requiere atención', {
      description: 'El cliente solicitó modificaciones especiales',
      icon: <AlertCircle className="w-5 h-5" />,
    });
    setNotificationCount((prev) => prev + 1);
  };

  const showInfoToast = () => {
    toast.info('Nuevo pedido asignado', {
      description: 'Pedido #456 asignado a la cocina',
      icon: <Info className="w-5 h-5" />,
    });
    setNotificationCount((prev) => prev + 1);
  };

  const showCustomToast = () => {
    toast.custom((t) => (
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Flame className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold">¡Pedido Urgente!</p>
          <p className="text-sm text-white/90">Mesa #5 solicita atención inmediata</p>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    ));
    setNotificationCount((prev) => prev + 1);
  };

  const showLoadingToast = () => {
    const id = toast.loading('Procesando pedido...', {
      description: 'Esto puede tomar unos segundos',
    });

    setTimeout(() => {
      toast.success('Pedido procesado', {
        id,
        description: 'El pedido #789 está listo para entrega',
      });
    }, 3000);
    setNotificationCount((prev) => prev + 1);
  };

  const showPromiseToast = () => {
    const myPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ name: 'Pedido #999' }), 3000);
    });

    toast.promise(myPromise, {
      loading: 'Guardando pedido...',
      success: 'Pedido guardado correctamente',
      error: 'Error al guardar',
    });
    setNotificationCount((prev) => prev + 1);
  };

  // Notificaciones específicas del CRM
  const showNewOrderNotification = () => {
    toast.custom((t) => (
      <Card className="border-orange-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl min-w-[350px] animate-in slide-in-from-right">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-base text-white">Nuevo Pedido</CardTitle>
                <CardDescription className="text-xs">Hace 1 minuto</CardDescription>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-slate-300">
            <p className="font-medium">Cliente: Juan Pérez</p>
            <p className="text-slate-400">2x Costillas BBQ • 1x Alitas</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
              Pendiente
            </Badge>
            <span className="text-lg font-bold text-orange-500">$45.00</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              onClick={() => {
                toast.success('Pedido aceptado');
                toast.dismiss(t);
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Aceptar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-950/20"
              onClick={() => {
                toast.error('Pedido rechazado');
                toast.dismiss(t);
              }}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rechazar
            </Button>
          </div>
        </CardContent>
      </Card>
    ), {
      duration: Infinity,
    });
    setNotificationCount((prev) => prev + 1);
  };

  const showKitchenNotification = () => {
    toast.custom((t) => (
      <Card className="border-green-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl min-w-[350px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-base text-white">Pedido Listo</CardTitle>
                <CardDescription className="text-xs">Pedido #456</CardDescription>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-slate-300">
            <p className="font-medium">Cliente: María González</p>
            <p className="text-slate-400">La orden está lista para entrega</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Preparado en 15 minutos</span>
          </div>
          <Button
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => {
              toast.success('Pedido marcado para entrega');
              toast.dismiss(t);
            }}
          >
            <Package className="w-4 h-4 mr-2" />
            Marcar para Entrega
          </Button>
        </CardContent>
      </Card>
    ), {
      duration: Infinity,
    });
    setNotificationCount((prev) => prev + 1);
  };

  const showDeliveryNotification = () => {
    toast.custom((t) => (
      <Card className="border-blue-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl min-w-[350px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Bike className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base text-white">Pedido en Camino</CardTitle>
                <CardDescription className="text-xs">Pedido #789</CardDescription>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-slate-300">
            <p className="font-medium">Repartidor: José Luis</p>
            <p className="text-slate-400">Destino: Calle Principal #123</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Progreso</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Tiempo estimado: 8 minutos</span>
          </div>
        </CardContent>
      </Card>
    ), {
      duration: Infinity,
    });
    setNotificationCount((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg shadow-orange-500/20">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Playground de Notificaciones
              </h1>
            </div>
            <p className="text-slate-400 ml-14">
              Prueba las notificaciones y efectos visuales del sistema
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-500">{notificationCount}</div>
            <div className="text-xs text-slate-400">Notificaciones enviadas</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 backdrop-blur-sm">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            Básicas
          </TabsTrigger>
          <TabsTrigger
            value="crm"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            CRM
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-600/10 data-[state=active]:border-orange-500/30 data-[state=active]:shadow-lg transition-all"
          >
            Avanzadas
          </TabsTrigger>
        </TabsList>

        {/* Notificaciones Básicas */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                Notificaciones Toast Básicas
              </CardTitle>
              <CardDescription className="text-slate-400">
                Notificaciones estándar del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <Button
                  onClick={showSuccessToast}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Éxito
                </Button>
                <Button
                  onClick={showErrorToast}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Error
                </Button>
                <Button
                  onClick={showWarningToast}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Advertencia
                </Button>
                <Button
                  onClick={showInfoToast}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones CRM */}
        <TabsContent value="crm" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-orange-800/50 bg-gradient-to-br from-orange-950/30 to-orange-900/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" onClick={showNewOrderNotification}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">Nuevo Pedido</CardTitle>
                    <CardDescription className="text-xs">Click para probar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Notificación completa con detalles del pedido y acciones
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-800/50 bg-gradient-to-br from-green-950/30 to-green-900/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" onClick={showKitchenNotification}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">Pedido Listo</CardTitle>
                    <CardDescription className="text-xs">Click para probar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Notificación cuando la cocina completa un pedido
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-800/50 bg-gradient-to-br from-blue-950/30 to-blue-900/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" onClick={showDeliveryNotification}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Bike className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">En Camino</CardTitle>
                    <CardDescription className="text-xs">Click para probar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Seguimiento en tiempo real de la entrega
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notificaciones Avanzadas */}
        <TabsContent value="advanced" className="space-y-4">
          <Card className="border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Notificaciones Avanzadas
              </CardTitle>
              <CardDescription className="text-slate-400">
                Toast personalizados, promesas y estados de carga
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={showCustomToast}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Toast Custom
                </Button>
                <Button
                  onClick={showLoadingToast}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Con Loading
                </Button>
                <Button
                  onClick={showPromiseToast}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Con Promise
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
