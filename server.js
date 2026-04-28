const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const productRoutes = require('./routes/product.routes');

const app = express();
const port = 4000;

// ─────────────────────────────────────────────
// MIDDLEWARES
app.use(cors());
app.use(express.json());

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '../front')));

// REDIRECCIÓN INICIAL
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// ─────────────────────────────────────────────
// RUTAS DE API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/user.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/ventas', require('./routes/sales.routes'));
app.use('/api/promociones', require('./routes/promotions.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/productos', productRoutes);



// LOGS DE PETICIONES
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─────────────────────────────────────────────
// GENERAR TICKET EN PDF Y ENVIAR POR CORREO

function generarTicketPDF({ nombre, resumen, total, metodoPago, correo }, callback) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, 'temp_ticket.pdf');
  const stream = fs.createWriteStream(filePath);
  const folio = `A-001-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const fechaHora = moment().format('DD/MMM/YYYY HH:mm:ss');
  const iva = (parseFloat(total) * 0.16 / 1.16).toFixed(2);
  const subtotal = (parseFloat(total) - iva).toFixed(2);

  const totalEnLetras = `${Number(total).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} ( ${convertirNumeroALetras(total)} M.N. )`;

  doc.fontSize(14).text('ESCOMercio', { align: 'center' });
  doc.fontSize(10).text(`Folio: ${folio}`);
  doc.text(`Fecha: ${fechaHora}`);
  doc.text('---------------------------------------------');
  doc.fontSize(12).text('Detalles de la compra:\n');

  resumen.split('\n').forEach(linea => {
    if (linea.trim()) doc.text(linea);
  });

  doc.text('---------------------------------------------');
  doc.fontSize(10);
  doc.text(`Subtotal: $${subtotal}`);
  doc.text(`IVA (16%): $${iva}`);
  doc.text(`Total: $${total}`);
  doc.text(`Total en letras: ${totalEnLetras}`);
  doc.text(`Método de pago: ${metodoPago}`);
  doc.moveDown();
  doc.text('Este documento es una representación impresa de un CFDI.');
  doc.text('Política de devoluciones: Sujeta al reglamento en nuestro sitio web.');
  doc.text('Contacto: ercioescom@gmail.com | www.veremos');
  doc.moveDown();
  doc.fontSize(12).text('¡Gracias por tu compra!', { align: 'center' });

  doc.pipe(stream);
  doc.end();

  stream.on('finish', () => callback(filePath));
}

function convertirNumeroALetras(numero) {
  const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
  return formatter.formatToParts(numero).find(part => part.type === 'integer').value + ' Pesos';
}

app.post("/enviar-correo", (req, res) => {
  const { nombre, correo, resumen, total, metodoPago } = req.body;

  generarTicketPDF({ nombre, resumen, total, metodoPago, correo }, (pdfPath) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ercioescom@gmail.com',
        pass: 'fuqiyuriauaimhzw'
      }
    });

    const mailOptions = {
      from: 'ercioescom@gmail.com',
      to: correo,
      subject: 'Tu recibo de compra',
      text: `Hola ${nombre}, gracias por tu compra. Te adjuntamos tu ticket ;D`,
      attachments: [{ filename: 'ticket.pdf', path: pdfPath }]
    };

    transporter.sendMail(mailOptions, (err, info) => {
      fs.unlinkSync(pdfPath); // elimina el PDF temporal
      if (err) {
        console.error(err);
        res.json({ status: 'error' });
      } else {
        console.log('Correo enviado:', info.response);
        res.json({ status: 'ok' });
      }
    });
  });
});

// ─────────────────────────────────────────────
// ERRORES Y 404

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).send('Algo salió mal!');
});

app.get('*', (req, res) => {
  res.status(404).send('Página no encontrada');
});

// ─────────────────────────────────────────────
// INICIAR SERVIDOR

app.listen(port, () => {
  console.log(`✅ Backend corriendo en: http://localhost:${port}`);
  console.log(`✅ Login: http://localhost:${port}/login.html`);
});

