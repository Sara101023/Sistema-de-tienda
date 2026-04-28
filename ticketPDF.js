const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

function convertirNumeroALetras(numero) {
  numero = parseFloat(numero);
  if (isNaN(numero)) return 'Cantidad inválida';

  const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince'];
  const decenas = ['diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const centenas = ['cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  function enLetras(n) {
    if (n < 10) return unidades[n];
    if (n >= 10 && n < 16) return especiales[n - 10];
    if (n < 20) return 'dieci' + unidades[n - 10];
    if (n === 20) return 'veinte';
    if (n < 30) return 'veinti' + unidades[n - 20];
    if (n < 100) {
      let d = Math.floor(n / 10);
      let u = n % 10;
      return decenas[d - 1] + (u > 0 ? ' y ' + unidades[u] : '');
    }
    if (n === 100) return 'cien';
    if (n < 1000) {
      let c = Math.floor(n / 100);
      let resto = n % 100;
      return (c === 1 ? 'ciento' : centenas[c - 1]) + (resto > 0 ? ' ' + enLetras(resto) : '');
    }
    if (n < 1000000) {
      let miles = Math.floor(n / 1000);
      let resto = n % 1000;
      return (miles === 1 ? 'mil' : enLetras(miles) + ' mil') + (resto > 0 ? ' ' + enLetras(resto) : '');
    }
    return n.toString();
  }

  const [entero, decimal] = numero.toFixed(2).split('.');
  const letras = `${enLetras(parseInt(entero))} pesos con ${enLetras(parseInt(decimal))} centavos M.N.`;
  return letras.charAt(0).toUpperCase() + letras.slice(1);
}

function obtenerMetodoPagoTexto(codigo) {
  switch (codigo) {
    case 1: return 'Efectivo';
    case 2: return 'Tarjeta';
    case 3: return 'Transferencia';
    default: return 'Otro';
  }
}

function generarTicketPDF(venta, nombreCliente, callback) {
  if (!venta || !venta.items || !venta.fecha) {
    console.error("❌ Datos insuficientes para generar el ticket PDF:", venta);
    return callback(null);
  }

  const doc = new PDFDocument({ margin: 40 });
  const filePath = path.join(__dirname, '../temp_ticket.pdf');
  const stream = fs.createWriteStream(filePath);

  const folio = `A-001-${venta.id.toString().padStart(6, '0')}`;
  const fechaHora = moment(venta.fecha).format('DD/MMM/YYYY HH:mm:ss');

  const subtotal = Number(venta.subtotal);
  const iva = Number(venta.iva);
  const total = Number(venta.total);
  const totalLetras = convertirNumeroALetras(total);

  const logoPath = path.join(__dirname, '../utils/logoticket.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, { width: 100, align: 'center' });
  }

  doc.moveDown(0.5);
  doc.fontSize(14).text('ESCOMercio', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Folio: ${folio}`);
  doc.text(`Fecha: ${fechaHora}`);
  doc.text('---------------------------------------------');
  doc.moveDown(0.2);
  doc.fontSize(12).text('Detalles de la compra:', { underline: true });

  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('CANT.   ARTÍCULO                    PRECIO   DESC.     FINAL');

  doc.font('Helvetica').fontSize(9);
  venta.items.forEach(item => {
    const cantidad = item.cantidad.toString().padEnd(6);
    const nombre = (item.nombre || 'Producto').slice(0, 25).padEnd(30);
    const precioUnitario = `$${Number(item.precio_unitario).toFixed(2)}`.padEnd(9);
    const descuento = item.descuento ? `-$${item.descuento.toFixed(2)}`.padEnd(9) : '—'.padEnd(9);
    const totalFinal = `$${((Number(item.precio_unitario) * item.cantidad) - (item.descuento || 0)).toFixed(2)}`;
    doc.text(`${cantidad}${nombre}${precioUnitario}${descuento}${totalFinal}`);
  });

  doc.moveDown();
  doc.text('---------------------------------------------');
  doc.fontSize(10);
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, { align: 'right' });
  doc.text(`IVA (16%): $${iva.toFixed(2)}`, { align: 'right' });
  doc.text(`Total: $${total.toFixed(2)}`, { align: 'right' });
  doc.text(`Total en letras: ${totalLetras}`);
  doc.text(`Método de pago: ${obtenerMetodoPagoTexto(venta.metodo_pago)}`);
  doc.moveDown();
  doc.text('Política de devoluciones sujeta a términos en sitio web.');
  doc.text('Contacto: ercioescom@gmail.com | www.escomercio.com');
  doc.moveDown();
  doc.fontSize(12).text('¡Gracias por su compra!', { align: 'center' });

  doc.pipe(stream);
  doc.end();

  stream.on('finish', () => callback(filePath));
}

module.exports = { generarTicketPDF };
