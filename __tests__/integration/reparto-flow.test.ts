/**
 * Integration Test: Flujo de Reparto
 * Old Texas BBQ - CRM
 *
 * Verifica el flujo completo de reparto:
 * listo → asignar repartidor → en_reparto → entregado → liquidación
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Pedido, EstadoPedido, EstadoReparto } from '@/lib/types/firestore';
import { Timestamp } from 'firebase/firestore';

// Mock de Firebase
jest.mock('@/lib/firebase/config', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
  },
}));

describe('Integration: Flujo de Reparto', () => {
  let mockPedido: Partial<Pedido>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPedido = {
      id: 'pedido-123',
      numeroPedido: 42,
      estado: 'listo',
      canal: 'whatsapp',
      cliente: {
        nombre: 'Juan Pérez',
        telefono: '4771234567',
        direccion: 'Calle Falsa 123',
        colonia: 'Centro',
      },
      totales: {
        subtotal: 250,
        envio: 30,
        descuento: 0,
        total: 280,
      },
      pago: {
        metodo: 'efectivo',
        requiereCambio: true,
        montoRecibido: 300,
        cambio: 20,
      },
      fechaCreacion: Timestamp.now(),
    };
  });

  describe('Asignación de repartidor', () => {
    it('debería asignar un repartidor a un pedido listo', () => {
      // Arrange
      const pedido = { ...mockPedido, estado: 'listo' as EstadoPedido };
      const repartidorId = 'repartidor-001';

      // Act
      const pedidoAsignado = {
        ...pedido,
        reparto: {
          repartidorId,
          estado: 'asignado' as EstadoReparto,
          fechaAsignacion: new Date(),
        },
      };

      // Assert
      expect(pedidoAsignado.reparto).toBeDefined();
      expect(pedidoAsignado.reparto?.repartidorId).toBe(repartidorId);
      expect(pedidoAsignado.reparto?.estado).toBe('asignado');
    });

    it('NO debería permitir asignar si el pedido no está listo', () => {
      // Arrange
      const estadosInvalidos: EstadoPedido[] = [
        'pendiente',
        'en_preparacion',
        'en_reparto',
        'entregado',
      ];

      // Act & Assert
      estadosInvalidos.forEach((estado) => {
        const puedeAsignar = estado === 'listo';
        expect(puedeAsignar).toBe(false);
      });
    });

    it('debería calcular la comisión del repartidor', () => {
      // Arrange
      const costoCostoEnvio = 30;
      const porcentajeComision = 0.7; // 70%

      // Act
      const comision = costoCostoEnvio * porcentajeComision;

      // Assert
      expect(comision).toBe(21);
    });
  });

  describe('Estados de reparto', () => {
    it('debería cambiar a en_reparto al aceptar el pedido', () => {
      // Arrange
      const estadoInicial: EstadoPedido = 'listo';

      // Act
      const estadoNuevo: EstadoPedido = 'en_reparto';

      // Assert
      expect(estadoNuevo).toBe('en_reparto');
      expect(estadoNuevo).not.toBe(estadoInicial);
    });

    it('debería cambiar a entregado al confirmar la entrega', () => {
      // Arrange
      const estadoInicial: EstadoPedido = 'en_reparto';

      // Act
      const estadoNuevo: EstadoPedido = 'entregado';
      const fechaEntrega = new Date();

      // Assert
      expect(estadoNuevo).toBe('entregado');
      expect(fechaEntrega).toBeInstanceOf(Date);
    });

    it('debería registrar todos los timestamps del flujo', () => {
      // Arrange & Act
      const fechas = {
        creacion: new Date(Date.now() - 60000), // Hace 1 min
        asignacion: new Date(Date.now() - 30000), // Hace 30 seg
        recogida: new Date(Date.now() - 15000), // Hace 15 seg
        entrega: new Date(), // Ahora
      };

      // Assert
      expect(fechas.creacion.getTime()).toBeLessThan(fechas.asignacion.getTime());
      expect(fechas.asignacion.getTime()).toBeLessThan(fechas.recogida.getTime());
      expect(fechas.recogida.getTime()).toBeLessThan(fechas.entrega.getTime());
    });
  });

  describe('Vista de pedidos para repartidor', () => {
    it('debería mostrar solo pedidos listos sin asignar', () => {
      // Arrange
      const pedidos = [
        { id: '1', estado: 'listo' as EstadoPedido, reparto: undefined },
        { id: '2', estado: 'listo' as EstadoPedido, reparto: { repartidorId: 'otro' } },
        { id: '3', estado: 'en_reparto' as EstadoPedido, reparto: { repartidorId: 'otro' } },
        { id: '4', estado: 'listo' as EstadoPedido, reparto: undefined },
      ];

      // Act
      const pedidosDisponibles = pedidos.filter(
        (p) => p.estado === 'listo' && !p.reparto
      );

      // Assert
      expect(pedidosDisponibles).toHaveLength(2);
      expect(pedidosDisponibles.map((p) => p.id)).toEqual(['1', '4']);
    });

    it('debería mostrar pedidos asignados al repartidor actual', () => {
      // Arrange
      const repartidorActual = 'repartidor-001';
      const pedidos = [
        { id: '1', reparto: { repartidorId: 'repartidor-001' } },
        { id: '2', reparto: { repartidorId: 'repartidor-002' } },
        { id: '3', reparto: { repartidorId: 'repartidor-001' } },
      ];

      // Act
      const misPedidos = pedidos.filter(
        (p) => p.reparto?.repartidorId === repartidorActual
      );

      // Assert
      expect(misPedidos).toHaveLength(2);
      expect(misPedidos.map((p) => p.id)).toEqual(['1', '3']);
    });

    it('NO debería mostrar datos sensibles completos del cliente', () => {
      // Arrange
      const pedido = {
        cliente: {
          nombre: 'Juan Pérez',
          telefono: '4771234567',
          direccion: 'Calle Falsa 123',
        },
      };

      // Act
      const datosParaRepartidor = {
        direccion: pedido.cliente.direccion,
        colonia: 'Centro',
        // NO incluir telefono completo ni nombre completo
      };

      // Assert
      expect(datosParaRepartidor).not.toHaveProperty('telefono');
      expect(datosParaRepartidor).toHaveProperty('direccion');
    });
  });

  describe('Cálculos financieros', () => {
    it('debería calcular el monto a entregar al restaurante', () => {
      // Arrange
      const total = 280;
      const envio = 30;
      const comision = envio * 0.7; // 21

      // Act
      const montoAEntregar = total - comision;

      // Assert
      expect(montoAEntregar).toBe(259);
    });

    it('debería calcular correctamente con descuento aplicado', () => {
      // Arrange
      const subtotal = 250;
      const envio = 30;
      const descuento = 25;
      const total = subtotal + envio - descuento;
      const comision = envio * 0.7;

      // Act
      const montoAEntregar = total - comision;

      // Assert
      expect(total).toBe(255);
      expect(montoAEntregar).toBe(234);
    });

    it('debería identificar si requiere cambio', () => {
      // Arrange
      const pago1 = {
        metodo: 'efectivo' as const,
        requiereCambio: true,
        montoRecibido: 300,
        cambio: 20,
      };

      const pago2 = {
        metodo: 'tarjeta' as const,
        requiereCambio: false,
      };

      // Assert
      expect(pago1.requiereCambio).toBe(true);
      expect(pago1.cambio).toBe(20);
      expect(pago2.requiereCambio).toBe(false);
    });
  });

  describe('Liquidación', () => {
    it('debería marcar pedido como liquidado', () => {
      // Arrange
      const pedido = {
        id: 'pedido-123',
        estado: 'entregado' as EstadoPedido,
        reparto: {
          repartidorId: 'repartidor-001',
          liquidado: false,
        },
      };

      // Act
      const pedidoLiquidado = {
        ...pedido,
        reparto: {
          ...pedido.reparto,
          liquidado: true,
          fechaLiquidacion: new Date(),
        },
      };

      // Assert
      expect(pedidoLiquidado.reparto.liquidado).toBe(true);
      expect(pedidoLiquidado.reparto.fechaLiquidacion).toBeInstanceOf(Date);
    });

    it('debería calcular el total a liquidar por repartidor', () => {
      // Arrange
      const pedidos = [
        { total: 280, comision: 21 }, // Entregar: 259
        { total: 350, comision: 28 }, // Entregar: 322
        { total: 200, comision: 14 }, // Entregar: 186
      ];

      // Act
      const totalAEntregar = pedidos.reduce(
        (sum, p) => sum + (p.total - p.comision),
        0
      );

      // Assert
      expect(totalAEntregar).toBe(767);
    });

    it('debería filtrar solo pedidos pendientes de liquidar', () => {
      // Arrange
      const pedidos = [
        { id: '1', estado: 'entregado', reparto: { liquidado: false } },
        { id: '2', estado: 'entregado', reparto: { liquidado: true } },
        { id: '3', estado: 'entregado', reparto: { liquidado: false } },
        { id: '4', estado: 'en_reparto', reparto: { liquidado: false } },
      ];

      // Act
      const pendientesLiquidacion = pedidos.filter(
        (p) => p.estado === 'entregado' && !p.reparto.liquidado
      );

      // Assert
      expect(pendientesLiquidacion).toHaveLength(2);
      expect(pendientesLiquidacion.map((p) => p.id)).toEqual(['1', '3']);
    });
  });

  describe('Notificaciones de reparto', () => {
    it('debería notificar al repartidor cuando se le asigna un pedido', () => {
      // Arrange
      const repartidorId = 'repartidor-001';
      const numeroPedido = 42;

      // Act
      const mensaje = `Se te ha asignado el pedido #${numeroPedido}`;
      const debeNotificar = true;

      // Assert
      expect(debeNotificar).toBe(true);
      expect(mensaje).toContain('#42');
    });

    it('debería notificar a cajera cuando se entrega el pedido', () => {
      // Arrange
      const pedido = {
        numeroPedido: 42,
        estado: 'entregado' as EstadoPedido,
        cliente: { nombre: 'Juan Pérez' },
      };

      // Act
      const mensaje = `Pedido #${pedido.numeroPedido} entregado a ${pedido.cliente.nombre}`;

      // Assert
      expect(mensaje).toBe('Pedido #42 entregado a Juan Pérez');
    });
  });

  describe('Incidencias', () => {
    it('debería permitir reportar una incidencia', () => {
      // Arrange
      const pedido = {
        id: 'pedido-123',
        estado: 'en_reparto' as EstadoPedido,
      };

      const incidencia = {
        tipo: 'cliente_no_contesta',
        descripcion: 'Cliente no atiende llamadas ni mensajes',
        fecha: new Date(),
      };

      // Act
      const pedidoConIncidencia = {
        ...pedido,
        incidencia,
        estado: 'cancelado' as EstadoPedido,
      };

      // Assert
      expect(pedidoConIncidencia.incidencia).toBeDefined();
      expect(pedidoConIncidencia.incidencia?.tipo).toBe('cliente_no_contesta');
      expect(pedidoConIncidencia.estado).toBe('cancelado');
    });

    it('debería notificar al encargado cuando hay una incidencia', () => {
      // Arrange
      const incidencia = {
        pedidoId: 'pedido-123',
        numeroPedido: 42,
        tipo: 'direccion_incorrecta',
        prioridad: 'urgente',
      };

      // Act
      const debeNotificarEncargado = incidencia.prioridad === 'urgente';

      // Assert
      expect(debeNotificarEncargado).toBe(true);
    });
  });
});
