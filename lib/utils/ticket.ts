/**
 * Utilidades para impresión de tickets
 * Old Texas BBQ - CRM
 */

import { Pedido, ItemPedido } from '@/lib/types/firestore';
import { formatCurrency } from './formatters';

export interface TicketData {
  pedido: Pedido;
  items: ItemPedido[];
  nombreNegocio: string;
  direccionNegocio: string;
  telefonoNegocio: string;
}

/**
 * Genera el HTML para imprimir un ticket
 */
export function generarTicketHTML(data: TicketData): string {
  const { pedido, items, nombreNegocio, direccionNegocio, telefonoNegocio } = data;

  const fecha = pedido.fechaCreacion.toDate();
  const fechaFormato = fecha.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const horaFormato = fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ticket #${pedido.numeroPedido}</title>
      <style>
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 8mm;
          }
        }

        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          max-width: 80mm;
          margin: 0 auto;
          padding: 8mm;
        }

        .center {
          text-align: center;
        }

        .bold {
          font-weight: bold;
        }

        .header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 2px dashed #000;
          padding-bottom: 10px;
        }

        .header h1 {
          margin: 0;
          font-size: 18px;
        }

        .header p {
          margin: 2px 0;
          font-size: 10px;
        }

        .info-section {
          margin: 10px 0;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
        }

        .items-table {
          width: 100%;
          margin: 10px 0;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
        }

        .item-row {
          margin: 5px 0;
        }

        .item-name {
          font-weight: bold;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          margin-top: 2px;
        }

        .personalizacion {
          font-size: 10px;
          margin-left: 10px;
          color: #666;
        }

        .totals {
          margin-top: 10px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
        }

        .total-row.final {
          font-size: 14px;
          font-weight: bold;
          border-top: 2px solid #000;
          padding-top: 5px;
          margin-top: 5px;
        }

        .footer {
          text-align: center;
          margin-top: 15px;
          font-size: 10px;
          border-top: 2px dashed #000;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${nombreNegocio}</h1>
        <p>${direccionNegocio}</p>
        <p>Tel: ${telefonoNegocio}</p>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="bold">Pedido #${pedido.numeroPedido}</span>
          <span>${pedido.estado.toUpperCase()}</span>
        </div>
        <div class="info-row">
          <span>Fecha:</span>
          <span>${fechaFormato} ${horaFormato}</span>
        </div>
        <div class="info-row">
          <span>Canal:</span>
          <span>${pedido.canal.toUpperCase()}</span>
        </div>
      </div>

      <div class="info-section">
        <p class="bold">CLIENTE:</p>
        <p>${pedido.cliente.nombre}</p>
        <p>Tel: ${pedido.cliente.telefono}</p>
        ${pedido.cliente.direccion ? `<p>${pedido.cliente.direccion}</p>` : ''}
        ${pedido.cliente.colonia ? `<p>Col. ${pedido.cliente.colonia}</p>` : ''}
        ${pedido.cliente.referencia ? `<p class="personalizacion">${pedido.cliente.referencia}</p>` : ''}
      </div>

      <div class="items-table">
        <p class="bold">PRODUCTOS:</p>
        ${items.map((item) => `
          <div class="item-row">
            <div class="item-name">${item.productoNombre}</div>
            <div class="item-details">
              <span>${item.cantidad} x ${formatCurrency(item.precioUnitario)}</span>
              <span class="bold">${formatCurrency(item.subtotal)}</span>
            </div>
            ${item.personalizaciones ? `
              ${item.personalizaciones.salsa && item.personalizaciones.salsa.length > 0 ? `
                <div class="personalizacion">• Salsas: ${item.personalizaciones.salsa.join(', ')}</div>
              ` : ''}
              ${item.personalizaciones.presentacion ? `
                <div class="personalizacion">• ${item.personalizaciones.presentacion}</div>
              ` : ''}
              ${item.personalizaciones.extras && item.personalizaciones.extras.length > 0 ? `
                <div class="personalizacion">• Extras: ${item.personalizaciones.extras.join(', ')}</div>
              ` : ''}
            ` : ''}
            ${item.notas ? `<div class="personalizacion">• Nota: ${item.notas}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(pedido.totales.subtotal)}</span>
        </div>
        ${pedido.totales.envio > 0 ? `
          <div class="total-row">
            <span>Envío:</span>
            <span>${formatCurrency(pedido.totales.envio)}</span>
          </div>
        ` : ''}
        ${pedido.totales.descuento > 0 ? `
          <div class="total-row">
            <span>Descuento:</span>
            <span>-${formatCurrency(pedido.totales.descuento)}</span>
          </div>
        ` : ''}
        <div class="total-row final">
          <span>TOTAL:</span>
          <span>${formatCurrency(pedido.totales.total)}</span>
        </div>
      </div>

      <div class="info-section">
        <div class="total-row">
          <span class="bold">Método de Pago:</span>
          <span>${pedido.pago.metodo.toUpperCase()}</span>
        </div>
        ${pedido.pago.metodo === 'efectivo' ? `
          <div class="total-row">
            <span>Paga con:</span>
            <span>${formatCurrency(pedido.pago.montoRecibido || 0)}</span>
          </div>
          ${pedido.pago.cambio && pedido.pago.cambio > 0 ? `
            <div class="total-row bold">
              <span>Su cambio:</span>
              <span>${formatCurrency(pedido.pago.cambio)}</span>
            </div>
          ` : ''}
        ` : ''}
      </div>

      ${pedido.observaciones ? `
        <div class="info-section">
          <p class="bold">OBSERVACIONES:</p>
          <p>${pedido.observaciones}</p>
        </div>
      ` : ''}

      ${pedido.reparto ? `
        <div class="info-section">
          <p class="bold">REPARTIDOR:</p>
          <p>${pedido.reparto.repartidorNombre}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p>¡Gracias por su preferencia!</p>
        <p>Old Texas BBQ</p>
        <p>www.oldtexasbbq.com</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Imprime un ticket
 */
export function imprimirTicket(data: TicketData): void {
  const html = generarTicketHTML(data);

  // Crear ventana de impresión
  const ventanaImpresion = window.open('', '_blank', 'width=300,height=600');

  if (!ventanaImpresion) {
    alert('Por favor permite las ventanas emergentes para imprimir el ticket');
    return;
  }

  ventanaImpresion.document.write(html);
  ventanaImpresion.document.close();

  // Esperar a que cargue e imprimir
  ventanaImpresion.onload = () => {
    ventanaImpresion.focus();
    ventanaImpresion.print();

    // Cerrar ventana después de imprimir (opcional)
    setTimeout(() => {
      ventanaImpresion.close();
    }, 100);
  };
}
