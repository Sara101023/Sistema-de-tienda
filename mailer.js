const nodemailer = require('nodemailer');
const fs = require('fs');
const { generarTicketPDF } = require('./ticket');

async function enviarTicketPorCorreo(correoCliente, venta, nombreCliente = 'Cliente') {
  return new Promise((resolve, reject) => {
    generarTicketPDF(venta, nombreCliente, async (pdfPath) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ercioescom@gmail.com',
          pass: 'fuqiyuriauaimhzw'
        }
      });

      const mailOptions = {
        from: '"ESCOMercio" <ercioescom@gmail.com>',
        to: correoCliente,
        subject: 'Tu Ticket de Compra',
        text: `Hola ${nombreCliente}, gracias por tu compra. Adjuntamos tu ticket.`,
        attachments: [
          {
            filename: 'ticket.pdf',
            path: pdfPath
          }
        ]
      };

      transporter.sendMail(mailOptions, (err, info) => {
        fs.unlinkSync(pdfPath); // borrar PDF temporal
        if (err) {
          console.error('Error al enviar correo:', err);
          return reject(err);
        }
        console.log('Correo enviado:', info.response);
        resolve();
      });
    });
  });
}

module.exports = { enviarTicketPorCorreo };
