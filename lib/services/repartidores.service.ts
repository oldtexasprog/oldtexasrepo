/**
 * Servicio de Repartidores
 * Old Texas BBQ - CRM
 */

import { BaseService } from './base.service';
import { Repartidor } from '@/lib/types/firestore';

class RepartidoresService extends BaseService<Repartidor> {
  constructor() {
    super('repartidores');
  }

  /**
   * Obtiene repartidores activos
   */
  async getActivos(): Promise<Repartidor[]> {
    return this.search([{ field: 'activo', operator: '==', value: true }]);
  }

  /**
   * Obtiene repartidores disponibles para asignar
   */
  async getDisponibles(): Promise<Repartidor[]> {
    return this.search([
      { field: 'activo', operator: '==', value: true },
      { field: 'disponible', operator: '==', value: true },
    ]);
  }

  /**
   * Toggle disponibilidad
   */
  async toggleDisponibilidad(id: string, disponible: boolean): Promise<void> {
    await this.update(id, { disponible });
  }

  /**
   * Toggle activo/inactivo
   */
  async toggleActivo(id: string, activo: boolean): Promise<void> {
    await this.update(id, { activo });
  }

  /**
   * Incrementa contador de pedidos completados
   */
  async incrementarPedidosCompletados(id: string): Promise<void> {
    const repartidor = await this.getById(id);
    if (!repartidor) return;

    await this.update(id, {
      pedidosCompletados: repartidor.pedidosCompletados + 1,
    } as any);
  }

  /**
   * Incrementa saldo pendiente
   */
  async incrementarSaldoPendiente(id: string, monto: number): Promise<void> {
    const repartidor = await this.getById(id);
    if (!repartidor) return;

    await this.update(id, {
      saldoPendiente: repartidor.saldoPendiente + monto,
    } as any);
  }

  /**
   * Liquida saldo de un repartidor
   */
  async liquidarSaldo(id: string): Promise<void> {
    await this.update(id, {
      saldoPendiente: 0,
      ultimaLiquidacion: new Date(),
    } as any);
  }

  /**
   * Escucha repartidores disponibles en tiempo real
   */
  onRepartidoresDisponiblesChange(
    callback: (repartidores: Repartidor[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [
          { field: 'activo', operator: '==', value: true },
          { field: 'disponible', operator: '==', value: true },
        ],
        orderByField: 'nombre',
        orderDirection: 'asc',
      },
      onError
    );
  }
}

export const repartidoresService = new RepartidoresService();
