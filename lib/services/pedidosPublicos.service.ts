/**
 * Servicio de Pedidos Públicos
 * Old Texas BBQ - CRM
 *
 * Permite crear pedidos desde el formulario web público sin autenticación
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { NuevoPedido, ItemPedido } from '@/lib/types/firestore';
import { notificacionesService } from './notificaciones.service';

class PedidosPublicosService {
  private collectionName = 'pedidos';

  /**
   * Elimina campos con valor undefined de un objeto
   * Firebase no acepta campos con undefined
   */
  private removeUndefinedFields<T extends Record<string, any>>(
    obj: T
  ): Partial<T> {
    const cleaned: any = {};

    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    }

    return cleaned;
  }

  /**
   * Obtiene el siguiente número de pedido para el día actual
   */
  private async getNextNumeroPedido(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicioDelDia = Timestamp.fromDate(hoy);

    const pedidosRef = collection(db, this.collectionName);
    const q = query(
      pedidosRef,
      where('fechaCreacion', '>=', inicioDelDia)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.size + 1;
  }

  /**
   * Crea un pedido público completo (sin requerir autenticación)
   */
  async crearPedidoPublico(
    pedidoData: Omit<NuevoPedido, 'numeroPedido' | 'turnoId'>,
    items: Omit<ItemPedido, 'id'>[]
  ): Promise<{ pedidoId: string; numeroPedido: number }> {
    try {
      // 1. Obtener el número de pedido del día
      const numeroPedido = await this.getNextNumeroPedido();

      // 2. Obtener el turno actual activo (si existe)
      let turnoId = 'sin-turno';
      try {
        const turnosRef = collection(db, 'turnos');
        const qTurnos = query(
          turnosRef,
          where('cerrado', '==', false)
        );
        const turnosSnapshot = await getDocs(qTurnos);

        if (!turnosSnapshot.empty) {
          turnoId = turnosSnapshot.docs[0].id;
        }
      } catch (error) {
        console.warn('No se pudo obtener turno activo:', error);
        // Continuar sin turno
      }

      // 3. Preparar datos del pedido (sin campos undefined)
      const pedidoLimpio = this.removeUndefinedFields({
        ...pedidoData,
        numeroPedido,
        turnoId,
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now(),
      });

      // 4. Crear el pedido principal
      const pedidosRef = collection(db, this.collectionName);
      const docRef = await addDoc(pedidosRef, pedidoLimpio);
      const pedidoId = docRef.id;

      // 5. Agregar items en subcolección
      const batch = writeBatch(db);
      const itemsRef = collection(db, this.collectionName, pedidoId, 'items');

      items.forEach((item) => {
        const newDocRef = doc(itemsRef);
        batch.set(newDocRef, item);
      });

      await batch.commit();

      // 6. Crear entrada en historial
      const historialRef = collection(
        db,
        this.collectionName,
        pedidoId,
        'historial'
      );
      await addDoc(historialRef, {
        accion: 'creado',
        estadoNuevo: pedidoData.estado,
        usuarioId: 'sistema-web',
        usuarioNombre: 'Pedido Web',
        detalles: 'Pedido creado desde formulario web público',
        timestamp: Timestamp.now(),
      });

      // 7. 🔔 NOTIFICAR: Enviar notificación a CAJERA (no cocina para pedidos web)
      try {
        await notificacionesService.crearParaRol(
          'cajera',
          'nuevo_pedido',
          '🌐 Nuevo Pedido Web',
          `Pedido #${numeroPedido} recibido vía web - ${items.length} producto(s) - ${pedidoData.cliente.nombre}`,
          'alta',
          pedidoId
        );

        // También notificar a cocina
        await notificacionesService.crearParaRol(
          'cocina',
          'nuevo_pedido',
          '🌐 Nuevo Pedido Web',
          `Pedido #${numeroPedido} para ${pedidoData.cliente.colonia}`,
          'alta',
          pedidoId
        );
      } catch (notifError) {
        console.error('Error enviando notificaciones:', notifError);
        // No lanzar error para no bloquear la creación del pedido
      }

      console.log('✅ Pedido público creado exitosamente:', {
        pedidoId,
        numeroPedido,
        cliente: pedidoData.cliente.nombre,
        items: items.length,
      });

      return { pedidoId, numeroPedido };
    } catch (error) {
      console.error('❌ Error creando pedido público:', error);
      throw new Error(
        'Error al crear el pedido. Por favor intenta nuevamente o llámanos al 878-XXX-XXXX'
      );
    }
  }

  /**
   * Valida que un teléfono tenga formato válido
   */
  validarTelefono(telefono: string): boolean {
    // Formato: 878-123-4567 o 8781234567
    const regex = /^\d{3}-?\d{3}-?\d{4}$/;
    return regex.test(telefono);
  }

  /**
   * Sanitiza el nombre del cliente (evita inyección)
   */
  sanitizarNombre(nombre: string): string {
    return nombre.trim().replace(/[<>\"']/g, '');
  }

  /**
   * Sanitiza la dirección del cliente
   */
  sanitizarDireccion(direccion: string): string {
    return direccion.trim().replace(/[<>\"']/g, '');
  }
}

// Exportar instancia única (Singleton)
export const pedidosPublicosService = new PedidosPublicosService();
