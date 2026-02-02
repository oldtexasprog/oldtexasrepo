/**
 * API Route: Crear Pedido Público
 * POST /api/pedidos/publico
 *
 * Permite crear pedidos desde el formulario público /pedir
 * Usa el SDK de cliente de Firebase (requiere reglas de Firestore permisivas)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { getServerDb } from '@/lib/firebase/server';

// Rate limiting simple
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function sanitize(str: string): string {
  if (!str) return '';
  return str.trim().replace(/[<>\"']/g, '').substring(0, 500);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pedido, items } = body;

    // Validaciones básicas
    if (!pedido || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos del pedido incompletos' },
        { status: 400 }
      );
    }

    if (
      !pedido.cliente?.nombre ||
      !pedido.cliente?.telefono ||
      !pedido.cliente?.direccion
    ) {
      return NextResponse.json(
        { error: 'Datos del cliente incompletos' },
        { status: 400 }
      );
    }

    // Obtener instancia de Firestore para servidor
    const db = getServerDb();

    // Obtener número de pedido del día
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const pedidosRef = collection(db, 'pedidos');
    const qPedidos = query(
      pedidosRef,
      where('fechaCreacion', '>=', Timestamp.fromDate(hoy))
    );
    const pedidosSnapshot = await getDocs(qPedidos);
    const numeroPedido = pedidosSnapshot.size + 1;

    // Buscar turno activo
    let turnoId = 'sin-turno';
    try {
      const turnosRef = collection(db, 'turnos');
      const qTurnos = query(turnosRef, where('cerrado', '==', false));
      const turnosSnapshot = await getDocs(qTurnos);

      if (!turnosSnapshot.empty) {
        turnoId = turnosSnapshot.docs[0].id;
      }
    } catch (e) {
      console.warn('No se pudo obtener turno activo');
    }

    // Preparar datos del pedido
    const pedidoData = {
      canal: 'web',
      cliente: {
        nombre: sanitize(pedido.cliente.nombre),
        telefono: sanitize(pedido.cliente.telefono),
        direccion: sanitize(pedido.cliente.direccion),
        colonia: sanitize(pedido.cliente.colonia || ''),
        referencia: sanitize(pedido.cliente.referencia || ''),
      },
      estado: 'pendiente',
      numeroPedido,
      turnoId,
      totales: {
        subtotal: Number(pedido.totales?.subtotal) || 0,
        envio: Number(pedido.totales?.envio) || 0,
        descuento: Number(pedido.totales?.descuento) || 0,
        total: Number(pedido.totales?.total) || 0,
      },
      pago: {
        metodo: pedido.pago?.metodo || 'efectivo',
        requiereCambio: Boolean(pedido.pago?.requiereCambio),
        montoRecibido: Number(pedido.pago?.montoRecibido) || 0,
        cambio: Number(pedido.pago?.cambio) || 0,
        pagoAdelantado: Boolean(pedido.pago?.pagoAdelantado),
        ...(pedido.pago?.referenciaPago && {
          referenciaPago: pedido.pago.referenciaPago,
        }),
      },
      horaRecepcion: serverTimestamp(),
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
      creadoPor: 'sistema-web',
      cancelado: false,
    };

    // Crear el pedido
    const docRef = await addDoc(pedidosRef, pedidoData);
    const pedidoId = docRef.id;

    // Agregar items usando batch
    const batch = writeBatch(db);
    const itemsRef = collection(db, 'pedidos', pedidoId, 'items');

    items.forEach((item: any) => {
      const itemDoc = doc(itemsRef);
      batch.set(itemDoc, {
        productoId: item.productoId,
        productoNombre: sanitize(item.productoNombre || item.nombre || ''),
        cantidad: Number(item.cantidad) || 1,
        precioUnitario: Number(item.precioUnitario || item.precio) || 0,
        subtotal: Number(item.subtotal) || 0,
        ...(item.personalizaciones && {
          personalizaciones: item.personalizaciones,
        }),
        ...(item.notas && { notas: sanitize(item.notas) }),
      });
    });

    await batch.commit();

    // Agregar historial
    const historialRef = collection(db, 'pedidos', pedidoId, 'historial');
    await addDoc(historialRef, {
      accion: 'creado',
      estadoNuevo: 'pendiente',
      usuarioId: 'sistema-web',
      usuarioNombre: 'Pedido Web',
      detalles: 'Pedido creado desde formulario web público',
      timestamp: serverTimestamp(),
    });

    // Crear notificaciones
    try {
      const notificacionesRef = collection(db, 'notificaciones');

      await addDoc(notificacionesRef, {
        tipo: 'nuevo_pedido',
        titulo: '🌐 Nuevo Pedido Web',
        mensaje: `Pedido #${numeroPedido} recibido vía web - ${items.length} producto(s) - ${pedidoData.cliente.nombre}`,
        prioridad: 'alta',
        destinatarioRol: 'cajera',
        leida: false,
        fechaCreacion: serverTimestamp(),
        pedidoId,
      });

      await addDoc(notificacionesRef, {
        tipo: 'nuevo_pedido',
        titulo: '🌐 Nuevo Pedido Web',
        mensaje: `Pedido #${numeroPedido} para ${pedidoData.cliente.colonia}`,
        prioridad: 'alta',
        destinatarioRol: 'cocina',
        leida: false,
        fechaCreacion: serverTimestamp(),
        pedidoId,
      });
    } catch (e) {
      console.error('Error creando notificaciones:', e);
    }

    console.log('✅ Pedido público creado:', { pedidoId, numeroPedido });

    return NextResponse.json({
      success: true,
      pedidoId,
      numeroPedido,
    });
  } catch (error: any) {
    console.error('Error creando pedido público:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);

    // Si es error de permisos, dar instrucciones
    if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
      return NextResponse.json(
        {
          error: 'Error de permisos en Firestore. Debes actualizar las reglas de seguridad.',
          code: 'permission-denied',
          instructions: 'Ve a Firebase Console → Firestore → Rules y agrega las reglas del archivo firestore.rules.example',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: error?.message || 'Error al crear el pedido. Intenta de nuevo.',
        code: error?.code || 'unknown',
      },
      { status: 500 }
    );
  }
}
