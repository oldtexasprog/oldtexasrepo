// Constantes del sistema

export const ROLES = {
  CAJERA: 'cajera',
  COCINA: 'cocina',
  REPARTIDOR: 'repartidor',
  ENCARGADO: 'encargado',
  ADMIN: 'admin',
} as const;

export const CANALES = {
  WHATSAPP: 'whatsapp',
  LLAMADA: 'llamada',
  MOSTRADOR: 'mostrador',
  UBER: 'uber',
  DIDI: 'didi',
  WEB: 'web',
} as const;

export const METODOS_PAGO = {
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  TRANSFERENCIA: 'transferencia',
  APP: 'app',
} as const;

export const ESTADOS_PEDIDO = {
  RECIBIDO: 'recibido',
  EN_PREPARACION: 'en_preparacion',
  LISTO: 'listo',
  EN_REPARTO: 'en_reparto',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
} as const;

export const ESTADOS_REPARTO = {
  PENDIENTE: 'pendiente',
  EN_CAMINO: 'en_camino',
  ENTREGADO: 'entregado',
} as const;

export const TIPOS_TURNO = {
  MATUTINO: 'matutino',
  VESPERTINO: 'vespertino',
} as const;
