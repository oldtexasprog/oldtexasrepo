/**
 * Servicio de Notificaciones
 * Old Texas BBQ - CRM
 */

import { BaseService } from './base.service';
import {
  Notificacion,
  TipoNotificacion,
  PrioridadNotificacion,
  Rol,
} from '@/lib/types/firestore';
import { Timestamp } from 'firebase/firestore';

class NotificacionesService extends BaseService<Notificacion> {
  constructor() {
    super('notificaciones');
  }

  /**
   * Crea una notificación para un usuario específico
   */
  async crearParaUsuario(
    usuarioId: string,
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    prioridad: PrioridadNotificacion = 'normal',
    pedidoId?: string,
    turnoId?: string
  ): Promise<string> {
    const notificacion: Omit<Notificacion, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
      usuarioId,
      tipo,
      titulo,
      mensaje,
      prioridad,
      leida: false,
      timestamp: Timestamp.now(),
      pedidoId,
      turnoId,
      expiraEn: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 horas
    };

    return this.create(notificacion);
  }

  /**
   * Crea una notificación para un rol completo
   */
  async crearParaRol(
    rol: Rol,
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    prioridad: PrioridadNotificacion = 'normal',
    pedidoId?: string,
    turnoId?: string
  ): Promise<string> {
    const notificacion: Omit<Notificacion, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
      rol,
      tipo,
      titulo,
      mensaje,
      prioridad,
      leida: false,
      timestamp: Timestamp.now(),
      pedidoId,
      turnoId,
      expiraEn: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    };

    return this.create(notificacion);
  }

  /**
   * Obtiene notificaciones de un usuario
   */
  async getByUsuario(usuarioId: string, soloNoLeidas: boolean = false): Promise<Notificacion[]> {
    const filters: any[] = [{ field: 'usuarioId', operator: '==', value: usuarioId }];

    if (soloNoLeidas) {
      filters.push({ field: 'leida', operator: '==', value: false });
    }

    return this.getAll({
      filters,
      orderByField: 'timestamp',
      orderDirection: 'desc',
    });
  }

  /**
   * Obtiene notificaciones de un rol
   */
  async getByRol(rol: Rol, soloNoLeidas: boolean = false): Promise<Notificacion[]> {
    const filters: any[] = [{ field: 'rol', operator: '==', value: rol }];

    if (soloNoLeidas) {
      filters.push({ field: 'leida', operator: '==', value: false });
    }

    return this.getAll({
      filters,
      orderByField: 'timestamp',
      orderDirection: 'desc',
    });
  }

  /**
   * Marca una notificación como leída
   */
  async marcarComoLeida(id: string): Promise<void> {
    await this.update(id, {
      leida: true,
      fechaLeida: Timestamp.now(),
    } as any);
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas
   */
  async marcarTodasComoLeidas(usuarioId: string): Promise<void> {
    const notificaciones = await this.getByUsuario(usuarioId, true);
    const updates = notificaciones.map((n) => ({
      id: n.id,
      data: { leida: true, fechaLeida: Timestamp.now() },
    }));

    if (updates.length > 0) {
      await this.batchUpdate(updates as any);
    }
  }

  /**
   * Elimina notificaciones expiradas
   */
  async limpiarExpiradas(): Promise<void> {
    const ahora = Timestamp.now();
    const allNotifications = await this.getAll();

    const expiradas = allNotifications
      .filter((n) => n.expiraEn && n.expiraEn.toMillis() < ahora.toMillis())
      .map((n) => n.id);

    if (expiradas.length > 0) {
      await this.batchDelete(expiradas);
    }
  }

  /**
   * Cuenta notificaciones no leídas de un usuario
   */
  async contarNoLeidas(usuarioId: string): Promise<number> {
    const noLeidas = await this.getByUsuario(usuarioId, true);
    return noLeidas.length;
  }

  /**
   * Escucha notificaciones de un usuario en tiempo real
   */
  onNotificacionesUsuarioChange(
    usuarioId: string,
    callback: (notificaciones: Notificacion[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'usuarioId', operator: '==', value: usuarioId }],
        orderByField: 'timestamp',
        orderDirection: 'desc',
      },
      onError
    );
  }

  /**
   * Escucha notificaciones de un rol en tiempo real
   */
  onNotificacionesRolChange(
    rol: Rol,
    callback: (notificaciones: Notificacion[]) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      callback,
      {
        filters: [{ field: 'rol', operator: '==', value: rol }],
        orderByField: 'timestamp',
        orderDirection: 'desc',
      },
      onError
    );
  }
}

export const notificacionesService = new NotificacionesService();
