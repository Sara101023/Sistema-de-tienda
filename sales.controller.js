const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const Promotion = require('../models/promotion.model');
const { generarTicketPDF } = require('../utils/ticketPDF');
const nodemailer = require('nodemailer');
const fs = require('fs');
const pool = require('../config/database');

const salesController = {
    processSale: async (req, res) => {
        try {
            const { productos: items, metodo_pago, cliente } = req.body;
            const nombreCliente = cliente?.nombre || 'Invitado';
            const correoCliente = cliente?.correo || 'noreply@ventas.com';

            if (!items || !Array.isArray(items) || items.length === 0 || !metodo_pago) {
                return res.status(400).json({ error: 'Items y método de pago son requeridos' });
            }

            const metodoPagoId = parseInt(metodo_pago);
            if (![1, 2].includes(metodoPagoId)) {
                return res.status(400).json({ error: 'Método de pago inválido' });
            }

            let subtotal = 0;
            let iva = 0;
            const processedItems = [];

            for (const item of items) {
                const product = await Product.getById(item.id_producto);
                if (!product) {
                    return res.status(400).json({ error: `Producto con ID ${item.id_producto} no encontrado` });
                }

                if (product.stock < item.cantidad) {
                    return res.status(400).json({
                        error: 'no_stock',
                        producto: product.nombre
                    });
                }
                
                const promotions = await Promotion.getActivePromotionsForProduct(product);
                let discount = 0;
                let finalPrice = product.precio;
                let finalQuantity = item.cantidad;

                if (promotions.length > 0) {
  for (const promo of promotions) {
    if (promo.tipo_promocion === '3x1' && item.cantidad >= 3) {
      const groups = Math.floor(item.cantidad / 3);
      discount += product.precio * 2 * groups; // pagas 1 de cada 3
      finalQuantity = item.cantidad - groups * 2;
    }

    else if (promo.tipo_promocion === '3x2' && item.cantidad >= 3) {
      const groups = Math.floor(item.cantidad / 3);
      discount += product.precio * groups; // 1 gratis de cada 3
      finalQuantity = item.cantidad;
    }

    else if (
      promo.tipo_promocion === 'Nx$' &&
      promo.cantidad_minima != null &&
      promo.precio_promocional != null &&
      item.cantidad >= promo.cantidad_minima
    ) {
      const groups = Math.floor(item.cantidad / promo.cantidad_minima);
      const descuentoGrupo = (product.precio * promo.cantidad_minima) - promo.precio_promocional;
      discount += descuentoGrupo * groups;
      finalQuantity = item.cantidad;
    }
  }
}



            

                const itemSubtotal = (finalPrice * finalQuantity) - discount;
                const itemIva = product.tiene_iva ? product.precio * item.cantidad * 0.16 : 0;

                subtotal += itemSubtotal;
                iva += itemIva;

                processedItems.push({
                    producto_id: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: product.precio,
                    descuento: discount,
                    nombre: product.nombre
                });
            }

            const total = subtotal + iva;

            const saleData = {
                fecha: new Date(),
                total,
                subtotal,
                iva,
                id_metodo_pago: metodoPagoId,
                usuario_id: req.user?.id || null,
                items: processedItems
            };

            const saleId = await Sale.create(saleData);
            const completeSale = await Sale.getById(saleId);

            generarTicketPDF({
                id: saleId,
                fecha: saleData.fecha,
                subtotal,
                iva,
                total,
                metodo_pago,
                items: processedItems
            }, nombreCliente, (pdfPath) => {
                if (!pdfPath || !fs.existsSync(pdfPath)) {
                    console.error('❌ No se generó el PDF correctamente');
                    return;
                }

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ercioescom@gmail.com',
                        pass: 'fuqiyuriauaimhzw'
                    }
                });

                const mailOptions = {
                    from: 'ercioescom@gmail.com',
                    to: correoCliente,
                    subject: 'Tu ticket de compra',
                    text: `Hola ${nombreCliente}, gracias por tu compra. Adjuntamos tu ticket en formato PDF.`,
                    attachments: [{
                        filename: 'ticket.pdf',
                        path: pdfPath
                    }]
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    try { fs.unlinkSync(pdfPath); } catch (e) { }
                    if (err) console.error('❌ Error al enviar ticket PDF:', err);
                    else console.log('✅ Ticket PDF enviado a:', correoCliente);
                });
            });

            res.status(201).json({
                message: 'Venta registrada exitosamente',
                sale: completeSale
            });

        } catch (error) {
            console.error('❌ Error al procesar venta:', error);
            res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
        }
    },

    getAllSales: async (req, res) => {
        try {
            const sales = await Sale.getAll();
            res.json(sales);
        } catch (error) {
            console.error('❌ Error al obtener ventas:', error);
            res.status(500).json({ error: 'Error al obtener ventas' });
        }
    },

    getSaleById: async (req, res) => {
        try {
            const { id } = req.params;
            const sale = await Sale.getById(id);
            if (!sale) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }
            res.json(sale);
        } catch (error) {
            console.error('❌ Error al obtener venta:', error);
            res.status(500).json({ error: 'Error al obtener venta' });
        }
    },

    getResumenDelDia: async (req, res) => {
    try {
        // Obtener datos de ventas del día
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) AS total_ventas,
                SUM(total) AS total_dia,
                SUM(CASE WHEN id_metodo_pago = 1 THEN total ELSE 0 END) AS efectivo,
                SUM(CASE WHEN id_metodo_pago = 2 THEN total ELSE 0 END) AS tarjeta,
                AVG(total) AS ticket_promedio
            FROM venta
            WHERE DATE(fecha) = CURDATE()
        `);

        // Obtener productos con bajo stock
        const productos_bajo_stock = await Product.getLowStock();

        // Respuesta final
        res.json({
            total_ventas: rows[0].total_ventas || 0,
            total_dia: rows[0].total_dia || 0,
            efectivo: rows[0].efectivo || 0,
            tarjeta: rows[0].tarjeta || 0,
            ticket_promedio: rows[0].ticket_promedio || 0,
            productos_bajo_stock
        });
    } catch (error) {
        console.error('❌ Error al obtener resumen del día:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

};

module.exports = salesController;
