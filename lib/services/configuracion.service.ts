/**
 * Servicio de Configuración
 * Old Texas BBQ - CRM
 */

import { BaseService } from './base.service';
import { Configuracion, CategoriaConfig } from '@/lib/types/firestore';
import { Timestamp } from 'firebase/firestore';

class ConfiguracionService extends BaseService<Configuracion> {
  constructor() {
    super('configuracion');
  }

  /**
   * Obtiene una configuración por su ID
   */
  async getConfiguracion<T = any>(configId: string): Promise<T | null> {
    const config = await this.getById(configId);
    return config ? (config.valor as T) : null;
  }

  /**
   * Actualiza una configuración
   */
  async setConfiguracion<T = any>(
    configId: string,
    valor: T,
    usuarioId: string
  ): Promise<void> {
    const config = await this.getById(configId);

    if (config) {
      await this.update(configId, {
        valor,
        fechaActualizacion: Timestamp.now(),
        actualizadoPor: usuarioId,
      } as any);
    } else {
      throw new Error(`Configuración ${configId} no encontrada`);
    }
  }

  /**
   * Obtiene todas las configuraciones de una categoría
   */
  async getByCategoria(categoria: CategoriaConfig): Promise<Configuracion[]> {
    return this.search([{ field: 'categoria', operator: '==', value: categoria }]);
  }

  /**
   * Obtiene configuraciones editables
   */
  async getEditables(): Promise<Configuracion[]> {
    return this.search([{ field: 'editable', operator: '==', value: true }]);
  }

  // ==========================================================================
  // CONFIGURACIONES ESPECÍFICAS (Helpers)
  // ==========================================================================

  /**
   * Obtiene el costo de envío por defecto
   */
  async getCostoEnvioDefault(): Promise<number> {
    return (await this.getConfiguracion<number>('costo_envio_default')) || 50;
  }

  /**
   * Obtiene los costos de envío por zona
   */
  async getCostoEnvioZonas(): Promise<Record<string, number>> {
    return (
      (await this.getConfiguracion<Record<string, number>>('costo_envio_zonas')) || {
        centro: 40,
        norte: 50,
        sur: 60,
        fuera_zona: 80,
      }
    );
  }

  /**
   * Obtiene la comisión de reparto por defecto
   */
  async getComisionRepartoDefault(): Promise<number> {
    return (await this.getConfiguracion<number>('comision_reparto_default')) || 30;
  }

  /**
   * Obtiene los horarios de operación
   */
  async getHorariosOperacion(): Promise<{
    matutino: { inicio: string; fin: string };
    vespertino: { inicio: string; fin: string };
  }> {
    return (
      (await this.getConfiguracion<any>('horarios_operacion')) || {
        matutino: { inicio: '08:00', fin: '16:00' },
        vespertino: { inicio: '16:00', fin: '23:00' },
      }
    );
  }

  /**
   * Actualiza el costo de envío por defecto
   */
  async setCostoEnvioDefault(costo: number, usuarioId: string): Promise<void> {
    await this.setConfiguracion('costo_envio_default', costo, usuarioId);
  }

  /**
   * Actualiza la comisión de reparto por defecto
   */
  async setComisionRepartoDefault(comision: number, usuarioId: string): Promise<void> {
    await this.setConfiguracion('comision_reparto_default', comision, usuarioId);
  }

  /**
   * Escucha cambios en configuración en tiempo real
   */
  onConfiguracionChange(
    configId: string,
    callback: (valor: any) => void,
    onError?: (error: Error) => void
  ) {
    return this.onDocumentChange(
      configId,
      (config) => {
        callback(config?.valor || null);
      },
      onError
    );
  }
}

export const configuracionService = new ConfiguracionService();
