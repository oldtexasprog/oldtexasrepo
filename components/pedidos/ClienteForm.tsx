'use client';

import { useState, useEffect } from 'react';
import { ClientePedido } from '@/lib/types/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useClientesSugeridos } from '@/lib/hooks/useClientesSugeridos';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, Phone, MapPin, Home, Info, Search, Clock } from 'lucide-react';
import { pedidosService } from '@/lib/services/pedidos.service';

interface ClienteFormProps {
  value: ClientePedido;
  onChange: (cliente: ClientePedido) => void;
}

interface ClienteEncontrado extends ClientePedido {
  ultimoPedido?: Date;
  totalPedidos?: number;
}

export function ClienteForm({ value, onChange }: ClienteFormProps) {
  const [busquedaTelefono, setBusquedaTelefono] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [clientesEncontrados, setClientesEncontrados] = useState<ClienteEncontrado[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const { buscarClientes, getClientesFrecuentes } = useClientesSugeridos();

  const handleChange = (field: keyof ClientePedido, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  // Buscar clientes por teléfono
  const buscarCliente = async (telefono: string) => {
    if (telefono.length < 4) {
      setClientesEncontrados([]);
      return;
    }

    try {
      setBuscando(true);
      // Buscar pedidos con ese teléfono
      const pedidos = await pedidosService.getAll({
        filters: [
          { field: 'cliente.telefono', operator: '>=', value: telefono },
          { field: 'cliente.telefono', operator: '<=', value: telefono + '\uf8ff' },
        ],
        limitCount: 10,
      });

      // Agrupar por teléfono único
      const clientesMap = new Map<string, ClienteEncontrado>();

      pedidos.forEach((pedido) => {
        const tel = pedido.cliente.telefono;
        if (clientesMap.has(tel)) {
          const existing = clientesMap.get(tel)!;
          existing.totalPedidos = (existing.totalPedidos || 0) + 1;
          // Actualizar con el pedido más reciente
          if (
            pedido.fechaCreacion.toDate() >
            (existing.ultimoPedido || new Date(0))
          ) {
            existing.ultimoPedido = pedido.fechaCreacion.toDate();
          }
        } else {
          clientesMap.set(tel, {
            ...pedido.cliente,
            ultimoPedido: pedido.fechaCreacion.toDate(),
            totalPedidos: 1,
          });
        }
      });

      const clientes = Array.from(clientesMap.values());
      setClientesEncontrados(clientes);
    } catch (error) {
      console.error('Error buscando cliente:', error);
    } finally {
      setBuscando(false);
    }
  };

  // Buscar cuando cambia el teléfono en el modal
  useEffect(() => {
    if (!modalAbierto) return;

    const timer = setTimeout(() => {
      if (busquedaTelefono) {
        // Primero buscar en localStorage (instantáneo)
        const clientesLocales = buscarClientes(busquedaTelefono);

        if (clientesLocales.length > 0) {
          // Si hay resultados en localStorage, mostrarlos inmediatamente
          setClientesEncontrados(
            clientesLocales.map((c) => ({
              ...c,
              ultimoPedido: new Date(c.ultimaVez),
              totalPedidos: c.vecesUsado,
            }))
          );
        } else {
          // Si no hay en localStorage, buscar en Firestore
          buscarCliente(busquedaTelefono);
        }
      } else {
        setClientesEncontrados([]);
      }
    }, 300); // Debounce reducido a 300ms (más rápido)

    return () => clearTimeout(timer);
  }, [busquedaTelefono, modalAbierto]);

  // Seleccionar un cliente encontrado
  const seleccionarCliente = (cliente: ClienteEncontrado) => {
    onChange({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      colonia: cliente.colonia,
      referencia: cliente.referencia,
    });
    setModalAbierto(false);
    setBusquedaTelefono('');
    setClientesEncontrados([]);
  };

  // Reset del modal al cerrar
  const handleModalChange = (open: boolean) => {
    setModalAbierto(open);
    if (!open) {
      setBusquedaTelefono('');
      setClientesEncontrados([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de búsqueda */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Datos del Cliente</h3>

        {/* Modal de búsqueda */}
        <Dialog open={modalAbierto} onOpenChange={handleModalChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Buscar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Buscar Cliente Existente</DialogTitle>
              <DialogDescription>
                Busca por teléfono para autocompletar los datos del cliente
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Input de búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Escribe el teléfono del cliente..."
                  value={busquedaTelefono}
                  onChange={(e) => setBusquedaTelefono(e.target.value)}
                  className="pl-10 text-base"
                  autoFocus
                />
                {buscando && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                💡 Tip: Escribe al menos 4 dígitos para iniciar la búsqueda
              </p>

              {/* Resultados de búsqueda */}
              {busquedaTelefono.length >= 4 && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {clientesEncontrados.length > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {clientesEncontrados.length} cliente(s) encontrado(s):
                      </p>
                      {clientesEncontrados.map((cliente, index) => (
                        <button
                          key={index}
                          onClick={() => seleccionarCliente(cliente)}
                          className="w-full p-4 bg-card hover:bg-muted border border-border rounded-lg text-left transition-all hover:border-primary hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-base">
                                {cliente.nombre}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                📱 {cliente.telefono}
                              </p>
                              {cliente.direccion && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  📍 {cliente.direccion}
                                  {cliente.colonia && `, ${cliente.colonia}`}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">
                                  {cliente.totalPedidos} pedido(s)
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    !buscando && (
                      <div className="p-8 text-center border border-dashed border-border rounded-lg">
                        <p className="text-muted-foreground">
                          No se encontraron clientes con ese teléfono
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Cierra este modal y llena el formulario manualmente
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Estado inicial - Mostrar clientes frecuentes */}
              {busquedaTelefono.length === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Clientes Frecuentes
                  </div>

                  {(() => {
                    const frecuentes = getClientesFrecuentes(5);
                    return frecuentes.length > 0 ? (
                      <div className="space-y-2">
                        {frecuentes.map((cliente, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              seleccionarCliente({
                                ...cliente,
                                ultimoPedido: new Date(cliente.ultimaVez),
                                totalPedidos: cliente.vecesUsado,
                              })
                            }
                            className="w-full p-3 bg-card hover:bg-muted border border-border rounded-lg text-left transition-all hover:border-primary"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {cliente.nombre}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  📱 {cliente.telefono}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                                <span className="font-medium">
                                  {cliente.vecesUsado}×
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center border border-dashed border-border rounded-lg">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">
                          Aún no hay clientes guardados
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Escribe el teléfono para buscar
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Estado buscando sin suficientes dígitos */}
              {busquedaTelefono.length > 0 && busquedaTelefono.length < 4 && (
                <div className="p-6 text-center border border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Escribe al menos 4 dígitos...
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Formulario de datos del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Nombre del Cliente *
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Juan Pérez"
            value={value.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            required
            className="text-base"
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="telefono" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Teléfono *
          </Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="Ej: 8341234567"
            value={value.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            required
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            10 dígitos sin espacios ni guiones
          </p>
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="direccion" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Dirección de Entrega
        </Label>
        <Input
          id="direccion"
          placeholder="Ej: Calle Hidalgo #123, Col. Centro"
          value={value.direccion || ''}
          onChange={(e) => handleChange('direccion', e.target.value)}
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          Solo si es para entrega a domicilio
        </p>
      </div>

      {/* Colonia */}
      <div className="space-y-2">
        <Label htmlFor="colonia" className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Colonia
        </Label>
        <Input
          id="colonia"
          placeholder="Ej: Centro, Modelo, Industrial"
          value={value.colonia || ''}
          onChange={(e) => handleChange('colonia', e.target.value)}
          className="text-base"
        />
      </div>

      {/* Referencia */}
      <div className="space-y-2">
        <Label htmlFor="referencia" className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Referencias
        </Label>
        <Textarea
          id="referencia"
          placeholder="Ej: Casa de dos pisos, portón blanco, frente a la tienda..."
          value={value.referencia || ''}
          onChange={(e) => handleChange('referencia', e.target.value)}
          rows={3}
          className="text-base resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Ayuda al repartidor a encontrar más fácil la dirección
        </p>
      </div>

      {/* Indicador de campos requeridos */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-red-500">*</span>
        <span>Campos obligatorios</span>
      </div>
    </div>
  );
}
