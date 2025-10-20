// Tipos principales del sistema

export type Role = 'cajera' | 'cocina' | 'repartidor' | 'encargado' | 'admin';

export type Canal = 'whatsapp' | 'llamada' | 'mostrador' | 'uber' | 'didi' | 'web';

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'app';

export type EstadoPedido = 
  | 'recibido' 
  | 'en_preparacion' 
  | 'listo' 
  | 'en_reparto' 
  | 'entregado' 
  | 'cancelado';

export type EstadoReparto = 'pendiente' | 'en_camino' | 'entregado';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  activo: boolean;
  createdAt: Date;
}

export interface Cliente {
  nombre: string;
  telefono: string; // Encriptado
  direccion: string;
}

export interface ItemPedido {
  producto: string;
  cantidad: number;
  personalizacion?: string;
  precio_unitario: number;
}

export interface Totales {
  subtotal: number;
  envio: number;
  total: number;
}

export interface Pago {
  metodo: MetodoPago;
  requiere_cambio: boolean;
  monto_recibido: number;
}

export interface Reparto {
  repartidor?: string;
  estado: EstadoReparto;
  hora_salida?: Date;
  hora_entrega?: Date;
  pago_adelantado: boolean;
  comision?: number;
  liquidado: boolean;
}

export interface Pedido {
  id: string;
  fecha_hora: Date;
  canal: Canal;
  cliente: Cliente;
  items: ItemPedido[];
  totales: Totales;
  pago: Pago;
  reparto?: Reparto;
  estado_pedido: EstadoPedido;
  observaciones?: string;
  createdBy: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  foto?: string;
}

export interface Personalizacion {
  id: string;
  nombre: string;
  tipo: 'salsa' | 'extra' | 'presentacion';
  precio_adicional: number;
}

export interface Turno {
  id: string;
  tipo: 'matutino' | 'vespertino';
  fecha: Date;
  fondo_inicial: number;
  cajero: string;
  total_efectivo: number;
  total_tarjeta: number;
  total_transferencia: number;
  total_app: number;
  efectivo_real: number;
  diferencia: number;
  cerrado: boolean;
  hora_cierre?: Date;
}
