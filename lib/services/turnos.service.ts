/**
 * Servicio de Turnos
 * Old Texas BBQ - CRM
 */

import { BaseService } from './base.service';
import { Turno, TipoTurno, TransaccionTurno } from '@/lib/types/firestore';
import { Timestamp, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

class TurnosService extends BaseService<Turno> {
  constructor() {
    super('turnos');
  }

  /**
   * Obtiene el turno actual abierto (si existe)
   */
  async getTurnoActual(): Promise<Turno | null> {
    const turnos = await this.search([
      { field: 'estado', operator: '==', value: 'abierto' },
    ]);
    return turnos[0] || null;
  }

  /**
   * Abre un nuevo turno
   */
  async abrirTurno(
    tipo: TipoTurno,
    cajeroId: string,
    cajeroNombre: string,
    fondoInicial: number,
    encargadoId?: string,
    encargadoNombre?: string
  ): Promise<string> {
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const id = `turno_${fecha}_${tipo}`;

    const turnoData: Omit<Turno, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
      tipo,
      fecha,
      cajeroId,
      cajeroNombre,
      encargadoId,
      encargadoNombre,
      horaInicio: Timestamp.now(),
      estado: 'abierto',
      fondoInicial,
      resumen: {
        totalPedidos: 0,
        totalVentas: 0,
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        uber: 0,
        didi: 0,
        totalEnvios: 0,
        totalDescuentos: 0,
        totalComisionesRepartidores: 0,
      },
    };

    await this.createWithId(id, turnoData);
    return id;
  }

  /**
   * Cierra un turno con corte de caja
   */
  async cerrarTurno(
    turnoId: string,
    efectivoReal: number,
    observaciones: string,
    cerradoPor: string
  ): Promise<void> {
    const turno = await this.getById(turnoId);
    if (!turno) throw new Error('Turno no encontrado');

    const efectivoEsperado = turno.fondoInicial + turno.resumen.efectivo;
    const diferencia = efectivoReal - efectivoEsperado;

    await this.update(turnoId, {
      estado: 'cerrado',
      horaFin: Timestamp.now(),
      corte: {
        efectivoEsperado,
        efectivoReal,
        diferencia,
        observaciones,
        cerradoPor,
        horaCierre: Timestamp.now(),
      },
    } as any);
  }

  /**
   * Actualiza resumen del turno
   */
  async actualizarResumen(turnoId: string, resumen: Partial<Turno['resumen']>): Promise<void> {
    const turno = await this.getById(turnoId);
    if (!turno) return;

    await this.update(turnoId, {
      resumen: {
        ...turno.resumen,
        ...resumen,
      },
    } as any);
  }

  /**
   * Obtiene turnos por fecha
   */
  async getByFecha(fecha: string): Promise<Turno[]> {
    return this.search([{ field: 'fecha', operator: '==', value: fecha }]);
  }

  /**
   * Obtiene turno de hoy
   */
  async getTurnoHoy(tipo: TipoTurno): Promise<Turno | null> {
    const fecha = new Date().toISOString().split('T')[0];
    const id = `turno_${fecha}_${tipo}`;
    return this.getById(id);
  }

  // ==========================================================================
  // TRANSACCIONES (SUBCOLECCIÓN)
  // ==========================================================================

  /**
   * Obtiene transacciones de un turno
   */
  async getTransacciones(turnoId: string): Promise<TransaccionTurno[]> {
    try {
      const transaccionesRef = this.getSubcollectionRef(turnoId, 'transacciones');
      const q = query(transaccionesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TransaccionTurno[];
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      throw error;
    }
  }

  /**
   * Agrega una transacción al turno
   */
  async addTransaccion(
    turnoId: string,
    transaccion: Omit<TransaccionTurno, 'id' | 'timestamp'>
  ): Promise<void> {
    try {
      const transaccionesRef = this.getSubcollectionRef(turnoId, 'transacciones');
      await addDoc(transaccionesRef, {
        ...transaccion,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error agregando transacción:', error);
      throw error;
    }
  }

  /**
   * Escucha el turno actual en tiempo real
   */
  onTurnoActualChange(
    callback: (turno: Turno | null) => void,
    onError?: (error: Error) => void
  ) {
    return this.onCollectionChange(
      (turnos) => callback(turnos[0] || null),
      {
        filters: [{ field: 'estado', operator: '==', value: 'abierto' }],
        limitCount: 1,
      },
      onError
    );
  }
}

export const turnosService = new TurnosService();
