'use client';

import { useState, useEffect } from 'react';
import { ClientePedido } from '@/lib/types/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Phone, MapPin, Home, Info, Search, UserPlus, Clock } from 'lucide-react';
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
  const [mostrarResultados, setMostrarResultados] = useState(false);

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
      setMostrarResultados(false);
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

      pedidos.forEach(pedido => {
        const tel = pedido.cliente.telefono;
        if (clientesMap.has(tel)) {
          const existing = clientesMap.get(tel)!;
          existing.totalPedidos = (existing.totalPedidos || 0) + 1;
          // Actualizar con el pedido más reciente
          if (pedido.fechaCreacion.toDate() > (existing.ultimoPedido || new Date(0))) {
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
      setMostrarResultados(clientes.length > 0);
    } catch (error) {
      console.error('Error buscando cliente:', error);
    } finally {
      setBuscando(false);
    }
  };

  // Buscar cuando cambia el teléfono
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busquedaTelefono) {
        buscarCliente(busquedaTelefono);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [busquedaTelefono]);

  // Seleccionar un cliente encontrado
  const seleccionarCliente = (cliente: ClienteEncontrado) => {
    onChange({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      colonia: cliente.colonia,
      referencia: cliente.referencia,
    });
    setBusquedaTelefono('');
    setMostrarResultados(false);
    setClientesEncontrados([]);
  };

  // Crear cliente nuevo
  const crearNuevo = () => {
    onChange({
      nombre: '',
      telefono: busquedaTelefono,
      direccion: '',
      colonia: '',
      referencia: '',
    });
    setBusquedaTelefono('');
    setMostrarResultados(false);
    setClientesEncontrados([]);
  };

  return (
    <div className="space-y-6">
      {/* Buscador de cliente */}
      {!value.telefono && (
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Buscar Cliente Existente</h3>
          </div>

          <div className="relative">
            <Input
              placeholder="Busca por teléfono del cliente..."
              value={busquedaTelefono}
              onChange={(e) => setBusquedaTelefono(e.target.value)}
              className="text-base pr-10"
            />
            {buscando && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Escribe el teléfono para buscar pedidos anteriores y autocompletar los datos
          </p>

          {/* Resultados de búsqueda */}
          {mostrarResultados && clientesEncontrados.length > 0 && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-muted-foreground">
                {clientesEncontrados.length} cliente(s) encontrado(s):
              </p>
              {clientesEncontrados.map((cliente, index) => (
                <button
                  key={index}
                  onClick={() => seleccionarCliente(cliente)}
                  className="w-full p-3 bg-card hover:bg-muted border border-border rounded-lg text-left transition-all hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold">{cliente.nombre}</p>
                      <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
                      {cliente.direccion && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          📍 {cliente.direccion}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{cliente.totalPedidos} pedido(s)</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Opción para crear nuevo */}
              <button
                onClick={crearNuevo}
                className="w-full p-3 bg-primary/10 hover:bg-primary/20 border-2 border-dashed border-primary rounded-lg text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-primary">Cliente nuevo con este teléfono</p>
                    <p className="text-xs text-primary/70">Crear un registro nuevo</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* No se encontraron resultados */}
          {mostrarResultados && clientesEncontrados.length === 0 && busquedaTelefono.length >= 4 && (
            <div className="mt-4">
              <div className="p-3 bg-muted/50 border border-border rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  No se encontraron clientes con ese teléfono
                </p>
                <Button
                  onClick={crearNuevo}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Crear Cliente Nuevo
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulario de datos del cliente */}
      {value.telefono && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Datos del Cliente</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onChange({
                  nombre: '',
                  telefono: '',
                  direccion: '',
                  colonia: '',
                  referencia: '',
                });
              }}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Buscar Otro
            </Button>
          </div>

          {/* Nombre y Teléfono en grid */}
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
        </>
      )}
    </div>
  );
}
