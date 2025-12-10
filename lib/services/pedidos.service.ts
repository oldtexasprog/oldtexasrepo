/**
 * Servicio de Pedidos
 * Old Texas BBQ - CRM
 *
 * Gestiona operaciones CRUD para pedidos y sus subcolecciones
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { BaseService, QueryOptions } from './base.service';
import {
  Pedido,
  ItemPedido,
  HistorialPedido,
  EstadoPedido,
  CanalVenta,
  NuevoPedido,
  PedidoConDatos,
} from '@/lib/types/firestore';

class PedidosService extends BaseService<Pedido> {
  constructor() {
    super('pedidos');
  }

  // ==========================================================================
  // MÉTODOS ESPECÍFICOS DE PEDIDOS
  // ==========================================================================

  /**
   * Crea un pedido completo con items e historial inicial
   */
  async crearPedidoCompleto(
    pedidoData: Omit<NuevoPedido, 'numeroPedido'>,
    items: Omit<ItemPedido, 'id'>[]
  ): Promise<string> {
    try {
      // 1. Obtener el número de pedido del día
      const numeroPedido = await this.getNextNumeroPedido();

      // 2. Crear el pedido principal
      const pedidoId = await this.create({
        ...pedidoData,
        numeroPedido,
      } as any);

      // 3. Agregar items
      await this.addItems(pedidoId, items);

      // 4. Crear entrada en historial
      await this.addHistorial(pedidoId, {
        accion: 'creado',
        estadoNuevo: pedidoData.estado,
        usuarioId: pedidoData.creadoPor,
        usuarioNombre: 'Sistema', // TODO: obtener nombre del usuario
        detalles: `Pedido creado vía ${pedidoData.canal}`,
      });

      return pedidoId;
    } catch (error) {
      console.error('Error creando pedido completo:', error);
      throw error;
    }
  }

  /**
   * Obtiene el siguiente número de pedido para el día actual
   */
  async getNextNumeroPedido(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicioDelDia = Timestamp.fromDate(hoy);

    const pedidosHoy = await this.search([
      { field: 'fechaCreacion', operator: '>=', value: inicioDelDia },
    ]);

    return pedidosHoy.length + 1;
  }

  /**
   * Obtiene pedidos por estado
   */
  async getByEstado(estado: EstadoPedido): Promise<Pedido[]> {
    return this.search([{ field: 'estado', operator: '==', value: estado }]);
  }

  /**
   * Obtiene pedidos por canal
   */
  async getByCanal(canal: CanalVenta): Promise<Pedido[]> {
    return this.search([{ field: 'canal', operator: '==', value: canal }]);
  }

  /**
   * Obtiene pedidos de un turno específico
   */
  async getByTurno(turnoId: string): Promise<Pedido[]> {
    return this.search([{ field: 'turnoId', operator: '==', value: turnoId }]);
  }

  /**
   * Obtiene pedidos de un repartidor
   */
  async getByRepartidor(repartidorId: string): Promise<Pedido[]> {
    return this.search([
      { field: 'reparto.repartidorId', operator: '==', value: repartidorId },
    ]);
  }

  /**
   * Obtiene pedidos pendientes de liquidar de un repartidor
   */
  async getPendientesLiquidar(repartidorId: string): Promise<Pedido[]> {
    return this.search([
      { field: 'reparto.repartidorId', operator: '==', value: repartidorId },
      { field: 'reparto.liquidado', operator: '==', value: false },
      { field: 'estado', operator: '==', value: 'entregado' },
    ]);
  }

  /**
   * Obtiene pedidos del día actual
   */
  async getPedidosHoy(options?: QueryOptions): Promise<Pedido[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicioDelDia = Timestamp.fromDate(hoy);

    const queryOptions: QueryOptions = {
      ...options,
      filters: [
        ...(options?.filters || []),
        { field: 'fechaCreacion', operator: '>=', value: inicioDelDia },
      ],
    };

    return this.getAll(queryOptions);
  }

  /**
   * Obtiene pedidos entre fechas
   */
  async getByRangoFechas(
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<Pedido[]> {
    return this.search([
      {
        field: 'fechaCreacion',
        operator: '>=',
        value: Timestamp.fromDate(fechaInicio),
      },
      {
        field: 'fechaCreacion',
        operator: '<=',
        value: Timestamp.fromDate(fechaFin),
      },
    ]);
  }

  /**
   * Actualiza el estado de un pedido y registra en historial
   */
  async actualizarEstado(
    pedidoId: string,
    nuevoEstado: EstadoPedido,
    usuarioId: string,
    usuarioNombre: string,
    detalles?: string
  ): Promise<void> {
    const pedido = await this.getById(pedidoId);
    if (!pedido) throw new Error('Pedido no encontrado');

    const estadoAnterior = pedido.estado;

    // Actualizar timestamps según el estado
    const updateData: any = { estado: nuevoEstado };

    switch (nuevoEstado) {
      case 'en_preparacion':
        updateData.horaInicioCocina = Timestamp.now();
        break;
      case 'listo':
        updateData.horaListo = Timestamp.now();
        break;
      case 'entregado':
        updateData.horaEntrega = Timestamp.now();
        break;
    }

    // Actualizar pedido
    await this.update(pedidoId, updateData);

    // Registrar en historial
    await this.addHistorial(pedidoId, {
      accion: 'cambio_estado',
      estadoAnterior,
      estadoNuevo: nuevoEstado,
      usuarioId,
      usuarioNombre,
      detalles: detalles || `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
    });
  }

  /**
   * Asigna un repartidor a un pedido
   */
  async asignarRepartidor(
    pedidoId: string,
    repartidorId: string,
    repartidorNombre: string,
    comision: number,
    usuarioId: string,
    usuarioNombre: string
  ): Promise<void> {
    await this.update(pedidoId, {
      reparto: {
        repartidorId,
        repartidorNombre,
        comisionRepartidor: comision,
        estadoReparto: 'asignado',
        horaAsignacion: Timestamp.now(),
        liquidado: false,
      },
    } as any);

    await this.addHistorial(pedidoId, {
      accion: 'asignado',
      usuarioId,
      usuarioNombre,
      detalles: `Pedido asignado a ${repartidorNombre}`,
    });
  }

  /**
   * Cancela un pedido
   */
  async cancelar(
    pedidoId: string,
    motivo: string,
    usuarioId: string,
    usuarioNombre: string
  ): Promise<void> {
    const pedido = await this.getById(pedidoId);
    if (!pedido) throw new Error('Pedido no encontrado');

    await this.update(pedidoId, {
      estado: 'cancelado',
      cancelado: true,
      motivoCancelacion: motivo,
    } as any);

    await this.addHistorial(pedidoId, {
      accion: 'cancelado',
      estadoAnterior: pedido.estado,
      estadoNuevo: 'cancelado',
      usuarioId,
      usuarioNombre,
      detalles: `Pedido cancelado. Motivo: ${motivo}`,
    });
  }

  /**
   * Marca pedidos como liquidados
   */
  async liquidarPedidos(
    pedidoIds: string[],
    usuarioId: string
  ): Promise<void> {
    const batch = writeBatch(db);

    pedidoIds.forEach((pedidoId) => {
      const docRef = doc(db, this.collectionName, pedidoId);
      batch.update(docRef, {
        'reparto.liquidado': true,
        'reparto.fechaLiquidacion': Timestamp.now(),
        fechaActualizacion: Timestamp.now(),
      });
    });

    await batch.commit();
  }

  // ==========================================================================
  // MÉTODOS DE ITEMS (SUBCOLECCIÓN)
  // ==========================================================================

  /**
   * Obtiene los items de un pedido
   */
  async getItems(pedidoId: string): Promise<ItemPedido[]> {
    try {
      const itemsRef = this.getSubcollectionRef(pedidoId, 'items');
      const querySnapshot = await getDocs(itemsRef);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ItemPedido[];
    } catch (error) {
      console.error('Error obteniendo items del pedido:', error);
      throw error;
    }
  }

  /**
   * Agrega items a un pedido
   */
  async addItems(
    pedidoId: string,
    items: Omit<ItemPedido, 'id'>[]
  ): Promise<void> {
    try {
      const itemsRef = this.getSubcollectionRef(pedidoId, 'items');

      const batch = writeBatch(db);

      items.forEach((item) => {
        const newDocRef = doc(itemsRef);
        batch.set(newDocRef, item);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error agregando items al pedido:', error);
      throw error;
    }
  }

  /**
   * Obtiene un pedido con sus items
   */
  async getPedidoConItems(pedidoId: string): Promise<PedidoConDatos | null> {
    const pedido = await this.getById(pedidoId);
    if (!pedido) return null;

    const items = await this.getItems(pedidoId);

    return {
      ...pedido,
      items,
    };
  }

  // ==========================================================================
  // MÉTODOS DE HISTORIAL (SUBCOLECCIÓN)
  // ==========================================================================

  /**
   * Obtiene el historial de un pedido
   */
  async getHistorial(pedidoId: string): Promise<HistorialPedido[]> {
    try {
      const historialRef = this.getSubcollectionRef(pedidoId, 'historial');
      const q = query(historialRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HistorialPedido[];
    } catch (error) {
      console.error('Error obteniendo historial del pedido:', error);
      throw error;
    }
  }

  /**
   * Agrega una entrada al historial del pedido
   */
  async addHistorial(
    pedidoId: string,
    historial: Omit<HistorialPedido, 'id' | 'timestamp'>
  ): Promise<void> {
    try {
      const historialRef = this.getSubcollectionRef(pedidoId, 'historial');
      await addDoc(historialRef, {
        ...historial,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error agregando historial al pedido:', error);
      throw error;
    }
  }

  // ==========================================================================
  // ESTADÍSTICAS Y REPORTES
  // ==========================================================================

  /**
   * Obtiene estadísticas de pedidos del día
   */
  async getEstadisticasHoy(): Promise<{
    total: number;
    porEstado: Record<EstadoPedido, number>;
    porCanal: Record<CanalVenta, number>;
    totalVentas: number;
  }> {
    const pedidosHoy = await this.getPedidosHoy();

    const stats = {
      total: pedidosHoy.length,
      porEstado: {
        pendiente: 0,
        en_preparacion: 0,
        listo: 0,
        en_reparto: 0,
        entregado: 0,
        cancelado: 0,
      } as Record<EstadoPedido, number>,
      porCanal: {
        whatsapp: 0,
        mostrador: 0,
        uber: 0,
        didi: 0,
        llamada: 0,
        web: 0,
      } as Record<CanalVenta, number>,
      totalVentas: 0,
    };

    pedidosHoy.forEach((pedido) => {
      stats.porEstado[pedido.estado]++;
      stats.porCanal[pedido.canal]++;
      if (!pedido.cancelado) {
        stats.totalVentas += pedido.totales.total;
      }
    });

    return stats;
  }

  /**
   * Calcula el tiempo promedio de entrega
   */
  async getTiempoPromedioEntrega(): Promise<number> {
    const pedidosHoy = await this.getPedidosHoy({
      filters: [{ field: 'estado', operator: '==', value: 'entregado' }],
    });

    if (pedidosHoy.length === 0) return 0;

    const tiempos = pedidosHoy
      .filter((p) => p.horaEntrega && p.horaRecepcion)
      .map((p) => {
        const recepcion = p.horaRecepcion.toMillis();
        const entrega = p.horaEntrega!.toMillis();
        return (entrega - recepcion) / 1000 / 60; // En minutos
      });

    const promedio =
      tiempos.reduce((acc, t) => acc + t, 0) / tiempos.length;

    return Math.round(promedio);
  }

  // ==========================================================================
  // MÉTODOS DE TIEMPO REAL
  // ==========================================================================

  /**
   * Escucha pedidos por estado en tiempo real
   */
  onPedidosByEstadoChange(
    estado: EstadoPedido,
    callback: (pedidos: Pedido[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'estado', operator: '==', value: estado }],
        orderByField: 'fechaCreacion',
        orderDirection: 'desc',
      },
      onError
    );
  }

  /**
   * Escucha pedidos de un turno en tiempo real
   */
  onPedidosByTurnoChange(
    turnoId: string,
    callback: (pedidos: Pedido[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'turnoId', operator: '==', value: turnoId }],
        orderByField: 'fechaCreacion',
        orderDirection: 'desc',
      },
      onError
    );
  }

  /**
   * Escucha pedidos de cocina (pendientes y en preparación)
   */
  onPedidosCocinaChange(
    callback: (pedidos: Pedido[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [
          { field: 'estado', operator: 'in', value: ['pendiente', 'en_preparacion', 'listo'] },
        ],
        orderByField: 'fechaCreacion',
        orderDirection: 'asc',
      },
      onError
    );
  }

  /**
   * Escucha pedidos listos para recoger (sin repartidor asignado)
   */
  onPedidosListosParaRecoger(
    callback: (pedidos: Pedido[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [
          { field: 'estado', operator: '==', value: 'listo' },
          { field: 'reparto', operator: '==', value: null },
        ],
        orderByField: 'fechaCreacion',
        orderDirection: 'asc',
      },
      onError
    );
  }

  /**
   * Escucha pedidos asignados a un repartidor específico
   */
  onPedidosAsignadosARepartidor(
    repartidorId: string,
    callback: (pedidos: Pedido[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [
          { field: 'reparto.repartidorId', operator: '==', value: repartidorId },
          { field: 'estado', operator: 'in', value: ['en_reparto', 'listo'] },
        ],
        orderByField: 'fechaCreacion',
        orderDirection: 'desc',
      },
      onError
    );
  }
}

// Exportar instancia única (Singleton)
export const pedidosService = new PedidosService();
