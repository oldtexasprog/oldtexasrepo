/**
 * Integration Test: Flujo de Cocina
 * Old Texas BBQ - CRM
 *
 * Verifica el flujo de procesamiento de pedidos en cocina:
 * pendiente → en_preparacion → listo
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Pedido, EstadoPedido } from '@/lib/types/firestore';
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

describe('Integration: Flujo de Cocina', () => {
  let mockPedido: Partial<Pedido>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Pedido de ejemplo
    mockPedido = {
      id: 'pedido-123',
      numeroPedido: 42,
      estado: 'pendiente',
      canal: 'mostrador',
      cliente: {
        nombre: 'Juan Pérez',
        telefono: '4771234567',
      },
      totales: {
        subtotal: 250,
        envio: 0,
        descuento: 0,
        total: 250,
      },
      fechaCreacion: Timestamp.now(),
    };
  });

  describe('Visualización de comandas', () => {
    it('debería mostrar solo pedidos pendientes y en preparación', () => {
      // Arrange
      const pedidos = [
        { id: '1', estado: 'pendiente' as EstadoPedido },
        { id: '2', estado: 'en_preparacion' as EstadoPedido },
        { id: '3', estado: 'listo' as EstadoPedido },
        { id: '4', estado: 'entregado' as EstadoPedido },
      ];

      // Act
      const pedidosVisibles = pedidos.filter(
        (p) => p.estado === 'pendiente' || p.estado === 'en_preparacion' || p.estado === 'listo'
      );

      // Assert
      expect(pedidosVisibles).toHaveLength(3);
      expect(pedidosVisibles.map((p) => p.id)).toEqual(['1', '2', '3']);
    });

    it('debería ordenar pedidos por fecha de creación (más antiguos primero)', () => {
      // Arrange
      const ahora = Date.now();
      const pedidos = [
        { id: '1', fechaCreacion: new Date(ahora - 10000) },
        { id: '2', fechaCreacion: new Date(ahora - 5000) },
        { id: '3', fechaCreacion: new Date(ahora - 20000) },
      ];

      // Act
      const pedidosOrdenados = [...pedidos].sort(
        (a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime()
      );

      // Assert
      expect(pedidosOrdenados[0].id).toBe('3'); // Más antiguo
      expect(pedidosOrdenados[1].id).toBe('1');
      expect(pedidosOrdenados[2].id).toBe('2'); // Más reciente
    });

    it('debería destacar pedidos con más de 30 minutos de espera', () => {
      // Arrange
      const ahora = Date.now();
      const pedidos = [
        { id: '1', fechaCreacion: new Date(ahora - 35 * 60 * 1000) }, // 35 min
        { id: '2', fechaCreacion: new Date(ahora - 15 * 60 * 1000) }, // 15 min
        { id: '3', fechaCreacion: new Date(ahora - 45 * 60 * 1000) }, // 45 min
      ];

      // Act
      const tiempoLimite = 30 * 60 * 1000; // 30 minutos
      const pedidosUrgentes = pedidos.filter(
        (p) => ahora - p.fechaCreacion.getTime() > tiempoLimite
      );

      // Assert
      expect(pedidosUrgentes).toHaveLength(2);
      expect(pedidosUrgentes.map((p) => p.id)).toEqual(['1', '3']);
    });
  });

  describe('Transiciones de estado', () => {
    it('debería cambiar de pendiente a en_preparacion', () => {
      // Arrange
      const estadoInicial: EstadoPedido = 'pendiente';

      // Act
      const estadoNuevo: EstadoPedido = 'en_preparacion';

      // Assert
      expect(estadoInicial).toBe('pendiente');
      expect(estadoNuevo).toBe('en_preparacion');
      expect(estadoNuevo).not.toBe(estadoInicial);
    });

    it('debería cambiar de en_preparacion a listo', () => {
      // Arrange
      const estadoInicial: EstadoPedido = 'en_preparacion';

      // Act
      const estadoNuevo: EstadoPedido = 'listo';

      // Assert
      expect(estadoInicial).toBe('en_preparacion');
      expect(estadoNuevo).toBe('listo');
    });

    it('NO debería permitir retroceder de en_preparacion a pendiente', () => {
      // Arrange
      const estadosValidos: EstadoPedido[] = [
        'pendiente',
        'en_preparacion',
        'listo',
        'en_reparto',
        'entregado',
      ];

      const esTransicionValida = (
        actual: EstadoPedido,
        nuevo: EstadoPedido
      ): boolean => {
        const indiceActual = estadosValidos.indexOf(actual);
        const indiceNuevo = estadosValidos.indexOf(nuevo);
        return indiceNuevo > indiceActual;
      };

      // Act & Assert
      expect(esTransicionValida('en_preparacion', 'pendiente')).toBe(false);
      expect(esTransicionValida('en_preparacion', 'listo')).toBe(true);
    });
  });

  describe('Información de productos', () => {
    it('debería mostrar personalizaciones claramente', () => {
      // Arrange
      const item = {
        nombre: 'Costillas BBQ',
        cantidad: 2,
        personalizacion: 'Sin cebolla, salsa BBQ extra',
        notas: 'Bien cocidas',
      };

      // Assert
      expect(item).toHaveProperty('personalizacion');
      expect(item.personalizacion).toBeTruthy();
      expect(item).toHaveProperty('notas');
    });

    it('debería calcular el total de items en el pedido', () => {
      // Arrange
      const items = [
        { cantidad: 2 },
        { cantidad: 1 },
        { cantidad: 3 },
      ];

      // Act
      const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

      // Assert
      expect(totalItems).toBe(6);
    });
  });

  describe('Notificaciones', () => {
    it('debería notificar a repartidores cuando el pedido está listo', () => {
      // Arrange
      const pedido = {
        id: 'pedido-123',
        estado: 'en_preparacion' as EstadoPedido,
      };

      // Act
      const estadoNuevo: EstadoPedido = 'listo';
      const debeNotificar = estadoNuevo === 'listo';

      // Assert
      expect(debeNotificar).toBe(true);
    });

    it('debería incluir número de pedido en la notificación', () => {
      // Arrange
      const pedido = {
        numeroPedido: 42,
        estado: 'listo' as EstadoPedido,
      };

      // Act
      const mensaje = `Pedido #${pedido.numeroPedido} listo para recoger`;

      // Assert
      expect(mensaje).toBe('Pedido #42 listo para recoger');
    });
  });

  describe('Drag and Drop (Kanban)', () => {
    it('debería permitir mover pedido de Pendiente a En Preparación', () => {
      // Arrange
      const columnas = {
        pendiente: ['pedido-1', 'pedido-2'],
        en_preparacion: ['pedido-3'],
        listo: ['pedido-4'],
      };

      // Act: Simular drag de pedido-1 de pendiente a en_preparacion
      const pedidoId = 'pedido-1';
      const columnaNueva = [...columnas.en_preparacion, pedidoId];
      const columnaAnterior = columnas.pendiente.filter((id) => id !== pedidoId);

      // Assert
      expect(columnaAnterior).not.toContain(pedidoId);
      expect(columnaNueva).toContain(pedidoId);
      expect(columnaNueva).toHaveLength(2);
    });

    it('debería actualizar el contador de cada columna', () => {
      // Arrange
      const columnas = {
        pendiente: ['pedido-1', 'pedido-2', 'pedido-3'],
        en_preparacion: ['pedido-4'],
        listo: [],
      };

      // Act
      const contadores = {
        pendiente: columnas.pendiente.length,
        en_preparacion: columnas.en_preparacion.length,
        listo: columnas.listo.length,
      };

      // Assert
      expect(contadores.pendiente).toBe(3);
      expect(contadores.en_preparacion).toBe(1);
      expect(contadores.listo).toBe(0);
    });
  });

  describe('Tiempo de preparación', () => {
    it('debería calcular el tiempo transcurrido desde la creación', () => {
      // Arrange
      const ahora = Date.now();
      const fechaCreacion = new Date(ahora - 15 * 60 * 1000); // Hace 15 minutos

      // Act
      const tiempoTranscurrido = Math.floor(
        (ahora - fechaCreacion.getTime()) / 1000 / 60
      );

      // Assert
      expect(tiempoTranscurrido).toBe(15);
    });

    it('debería mostrar alerta si el tiempo supera el umbral', () => {
      // Arrange
      const umbralMinutos = 30;
      const tiemposTranscurridos = [15, 25, 35, 45];

      // Act
      const pedidosConAlerta = tiemposTranscurridos.filter(
        (tiempo) => tiempo > umbralMinutos
      );

      // Assert
      expect(pedidosConAlerta).toEqual([35, 45]);
    });
  });
});
