const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const Promotion = require('../models/promotion.model');

const salesController = {
    processSale: async (req, res) => {
        if (req.user.role !== 'cajero' && req.user.role !== 'administrador') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        
        try {
            const { items, metodo_pago } = req.body;
            
            // Validar campos obligatorios
            if (!items || !Array.isArray(items) || items.length === 0 || !metodo_pago) {
                return res.status(400).json({ error: 'Items y método de pago son requeridos' });
            }
            
            // Verificar stock y aplicar promociones
            let subtotal = 0;
            let iva = 0;
            const processedItems = [];
            
            for (const item of items) {
                // Obtener producto
                const product = await Product.getById(item.producto_id);
                if (!product) {
                    return res.status(400).json({ error: `Producto con ID ${item.producto_id} no encontrado` });
                }
                
                // Verificar stock
                if (product.stock < item.cantidad) {
                    return res.status(400).json({ 
                        error: `Stock insuficiente para ${product.nombre} `
                    });
                }
                
                // Obtener promociones activas para este producto
                const promotions = await Promotion.getActivePromotionsForProduct(item.producto_id);
                let discount = 0;
                let finalPrice = product.precio;
                let finalQuantity = item.cantidad;
                
                // Aplicar promociones si existen
                if (promotions.length > 0) {
                    for (const promo of promotions) {
                        if (promo.tipo === '3x1' && item.cantidad >= 3) {
                            const groups = Math.floor(item.cantidad / 3);
                            discount += (product.precio * 2) * groups;
                            finalQuantity = item.cantidad - groups;
                        } else if (promo.tipo === '3x2' && item.cantidad >= 3) {
                            const groups = Math.floor(item.cantidad / 3);
                            discount += product.precio * groups;
                            finalQuantity = item.cantidad;
                        } else if (promo.tipo === 'Nx$' && item.cantidad >= promo.parametros.N) {
                            const groups = Math.floor(item.cantidad / promo.parametros.N);
                            discount += (product.precio * promo.parametros.N - promo.parametros.precio) * groups;
                            finalQuantity = item.cantidad;
                        }
                    }
                }
                
                // Calcular precio final del item
                const itemSubtotal = finalPrice * finalQuantity;
                const itemIva = product.tiene_iva ? itemSubtotal * 0.16 : 0;
                
                subtotal += itemSubtotal;
                iva += itemIva;
                
                processedItems.push({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio_unitario: product.precio,
                    descuento: discount
                });
            }
            
            // Calcular total
            const total = subtotal + iva;
            
            // Crear objeto de venta
            const saleData = {
                fecha: new Date(),
                total,
                subtotal,
                iva,
                metodo_pago,
                usuario_id: req.user.id,
                items: processedItems
            };
            
            // Registrar la venta en la base de datos
            const saleId = await Sale.create(saleData);
            
            // Obtener la venta completa para respuesta
            const completeSale = await Sale.getById(saleId);
            
            res.status(201).json({
                message: 'Venta registrada exitosamente',
                sale: completeSale
            });
        } catch (error) {
            console.error('Error al procesar venta:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    getSaleById: async (req, res) => {
        try {
            const { id } = req.params;
            const sale = await Sale.getById(id);
            
            if (!sale) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }
            
            // Solo administradores pueden ver ventas de otros usuarios
            if (req.user.role !== 'administrador' && sale.usuario_id !== req.user.id) {
                return res.status(403).json({ error: 'No autorizado' });
            }
            
            res.json(sale);
        } catch (error) {
            console.error('Error al obtener venta:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    getAllSales: async (req, res) => {
        try {
            let sales;
            
            // Administradores ven todas las ventas, cajeros solo las suyas
            if (req.user.role === 'administrador') {
                sales = await Sale.getAll();
            } else {
                const [rows] = await pool.query('SELECT * FROM ventas WHERE usuario_id = ? ORDER BY fecha DESC', [req.user.id]);
                sales = rows;
            }
            
            res.json(sales);
        } catch (error) {
            console.error('Error al obtener ventas:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    processReturn: async (req, res) => {
        if (req.user.role !== 'cajero' && req.user.role !== 'administrador') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        
        try {
            const { saleId } = req.params;
            const { items } = req.body;
            
            // Validar campos obligatorios
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'Items son requeridos' });
            }
            
            // Verificar que la venta existe y obtener sus detalles
            const sale = await Sale.getById(saleId);
            if (!sale) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }
            
            // Verificar que los items a devolver pertenecen a la venta
            const saleItems = sale.items.map(item => item.producto_id);
            
            for (const item of items) {
                if (!saleItems.includes(item.producto_id)) {
                    return res.status(400).json({ error: `El producto con ID ${item.producto_id} no pertenece a esta venta` });
                }
                
                // Verificar que no se devuelva más de lo comprado
                const saleItem = sale.items.find(i => i.producto_id === item.producto_id);
                if (item.cantidad > saleItem.cantidad) {
                    return res.status(400).json({ 
                        error: `Cantidad a devolver (${item.cantidad}) excede la cantidad comprada (${saleItem.cantidad})`
                    });
                }
            }
            
            // Procesar la devolución
            const returnId = await Sale.processReturn(saleId, items);
            
            res.status(201).json({
                message: 'Devolución procesada exitosamente',
                returnId
            });
        } catch (error) {
            console.error('Error al procesar devolución:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};

const pool = require('../config/database'); // o tu conexión MySQL
const reportsController = {};

reportsController.getSalesReport = async (req, res) => {
    const { startDate, endDate, paymentMethod, category } = req.query;

    try {
        let query = `
            SELECT 
                v.id_venta AS folio,
                DATE_FORMAT(v.fecha, '%d/%m/%Y %H:%i') AS fecha,
                GROUP_CONCAT(p.nombre SEPARATOR ', ') AS productos,
                GROUP_CONCAT(dv.cantidad SEPARATOR ', ') AS cantidades,
                GROUP_CONCAT(dv.precio_unitario SEPARATOR ', ') AS precios,
                v.subtotal, v.iva, v.total,
                mp.tipo_pago AS metodo_pago,
                0 AS descuento, -- Aquí puedes sumar si guardas descuentos
                GROUP_CONCAT(p.categoria SEPARATOR ', ') AS categorias
            FROM venta v
            JOIN detalle_venta dv ON v.id_venta = dv.id_venta
            JOIN producto p ON dv.id_producto = p.id_producto
            LEFT JOIN metodo_pago mp ON v.id_metodo_pago = mp.id_metodo_pago
            WHERE 1 = 1
        `;

        const params = [];

        if (startDate) {
            query += " AND v.fecha >= STR_TO_DATE(?, '%d/%m/%Y')";
            params.push(startDate);
        }
        if (endDate) {
            query += " AND v.fecha <= STR_TO_DATE(?, '%d/%m/%Y')";
            params.push(endDate);
        }
        if (paymentMethod && paymentMethod !== 'all') {
            query += " AND mp.tipo_pago = ?";
            params.push(paymentMethod);
        }
        if (category && category !== 'all') {
            query += " AND p.categoria = ?";
            params.push(category);
        }

        if (req.query.proveedorId && req.query.proveedorId !== 'all') {
            query += " AND p.id_proveedor = ?";
            params.push(req.query.proveedorId);
                }


        query += " GROUP BY v.id_venta ORDER BY v.fecha DESC";

        const [rows] = await pool.query(query, params);
        res.json(rows);

    } catch (err) {
        console.error('Error al obtener el reporte de ventas:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const { Parser } = require('json2csv');

reportsController.exportSalesCSV = async (req, res) => {
    const { startDate, endDate, paymentMethod, category } = req.query;

    try {
        let query = `
            SELECT 
                v.id_venta AS folio,
                DATE_FORMAT(v.fecha, '%d/%m/%Y %H:%i') AS fecha,
                GROUP_CONCAT(p.nombre SEPARATOR ', ') AS productos,
                GROUP_CONCAT(dv.cantidad SEPARATOR ', ') AS cantidades,
                GROUP_CONCAT(dv.precio_unitario SEPARATOR ', ') AS precios,
                v.subtotal, v.iva, v.total,
                mp.tipo_pago AS metodo_pago,
                0 AS descuento,
                GROUP_CONCAT(p.categoria SEPARATOR ', ') AS categorias
            FROM venta v
            JOIN detalle_venta dv ON v.id_venta = dv.id_venta
            JOIN producto p ON dv.id_producto = p.id_producto
            LEFT JOIN metodo_pago mp ON v.id_metodo_pago = mp.id_metodo_pago
            WHERE 1 = 1
        `;

        const params = [];

        if (startDate) {
            query += " AND v.fecha >= STR_TO_DATE(?, '%d/%m/%Y')";
            params.push(startDate);
        }
        if (endDate) {
            query += " AND v.fecha <= STR_TO_DATE(?, '%d/%m/%Y')";
            params.push(endDate);
        }
        if (paymentMethod && paymentMethod !== 'all') {
            query += " AND mp.tipo_pago = ?";
            params.push(paymentMethod);
        }
        if (category && category !== 'all') {
            query += " AND p.categoria = ?";
            params.push(category);
        }

        query += " GROUP BY v.id_venta ORDER BY v.fecha DESC";

        const [rows] = await pool.query(query, params);

        const fields = ['folio', 'fecha', 'productos', 'cantidades', 'precios', 'subtotal', 'iva', 'total', 'metodo_pago', 'descuento', 'categorias'];
        const parser = new Parser({ fields });
        const csv = parser.parse(rows);

        res.header('Content-Type', 'text/csv');
        res.attachment('reporte_ventas.csv');
        res.send(csv);

    } catch (err) {
        console.error('Error al exportar CSV:', err);
        res.status(500).json({ error: 'Error al generar el CSV' });
    }
};

const PDFDocument = require('pdfkit');
const moment = require('moment');

reportsController.exportSalesPDF = async (req, res) => {
    const { startDate, endDate, paymentMethod, category } = req.query;

    try {
        let query = `
            SELECT 
                v.id_venta AS folio,
                DATE_FORMAT(v.fecha, '%d/%m/%Y %H:%i') AS fecha,
                GROUP_CONCAT(p.nombre SEPARATOR ', ') AS productos,
                GROUP_CONCAT(dv.cantidad SEPARATOR ', ') AS cantidades,
                GROUP_CONCAT(dv.precio_unitario SEPARATOR ', ') AS precios,
                v.subtotal, v.iva, v.total,
                mp.tipo_pago AS metodo_pago,
                0 AS descuento,
                GROUP_CONCAT(p.categoria SEPARATOR ', ') AS categorias
            FROM venta v
            JOIN detalle_venta dv ON v.id_venta = dv.id_venta
            JOIN producto p ON dv.id_producto = p.id_producto
            LEFT JOIN metodo_pago mp ON v.id_metodo_pago = mp.id_metodo_pago
            WHERE 1 = 1
        `;

        const params = [];

        if (startDate) {
            query += " AND v.fecha >= STR_TO_DATE(?, '%d/%m/%Y')";
            params.push(startDate);
        }
        if (endDate) {
            query += " AND v.fecha <= STR_TO_DATE(?, '%d/%m/%Y')";
            params.push(endDate);
        }
        if (paymentMethod && paymentMethod !== 'all') {
            query += " AND mp.tipo_pago = ?";
            params.push(paymentMethod);
        }
        if (category && category !== 'all') {
            query += " AND p.categoria = ?";
            params.push(category);
        }

        query += " GROUP BY v.id_venta ORDER BY v.fecha DESC";

        const [rows] = await pool.query(query, params);

        // Crear PDF
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Reporte de Ventas', { align: 'center' });
        doc.moveDown();

        doc.fontSize(10).text(`Generado: ${moment().format('DD/MM/YYYY HH:mm')}`);
        doc.moveDown();

        rows.forEach(row => {
            doc.fontSize(12).text(`Folio: ${row.folio}`);
            doc.text(`Fecha: ${row.fecha}`);
            doc.text(`Productos: ${row.productos}`);
            doc.text(`Cantidades: ${row.cantidades}`);
            doc.text(`Precios: ${row.precios}`);
            doc.text(`Subtotal: $${row.subtotal}`);
            doc.text(`IVA: $${row.iva}`);
            doc.text(`Total: $${row.total}`);
            doc.text(`Método de pago: ${row.metodo_pago}`);
            doc.text(`Descuento: $${row.descuento}`);
            doc.text(`Categorías: ${row.categorias}`);
            doc.moveDown();
            doc.moveDown();
        });

        doc.end();

    } catch (err) {
        console.error('Error al exportar PDF:', err);
        res.status(500).json({ error: 'Error al generar el PDF' });
    }
};

reportsController.getMostSoldProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.nombre AS producto,
                p.categoria,
                SUM(dv.cantidad) AS unidades_vendidas,
                SUM(dv.cantidad * dv.precio_unitario) AS ingresos_generados
            FROM detalle_venta dv
            JOIN producto p ON dv.id_producto = p.id_producto
            GROUP BY p.id_producto
            ORDER BY unidades_vendidas DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

reportsController.getPaymentMethodsReport = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                mp.tipo_pago,
                COUNT(*) AS cantidad_transacciones,
                SUM(v.total) AS total_recaudado
            FROM venta v
            JOIN metodo_pago mp ON v.id_metodo_pago = mp.id_metodo_pago
            GROUP BY mp.tipo_pago
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

reportsController.getProveedores = async (req, res) => {
    try {
        const [proveedores] = await pool.query('SELECT id_proveedor, nombre FROM proveedor');
        res.json(proveedores);
    } catch (err) {
        console.error('Error al obtener proveedores:', err);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

reportsController.getDashboardResumen = async (req, res) => {
  try {
    const [[ventas]] = await pool.query(`
      SELECT 
        COUNT(*) AS total_ventas,
        SUM(total) AS total_ingresos,
        SUM(subtotal) AS total_subtotal,
        SUM(iva) AS total_iva
      FROM venta
    `);

    const [metodos] = await pool.query(`
      SELECT mp.tipo_pago, COUNT(*) AS cantidad
      FROM venta v
      JOIN metodo_pago mp ON v.id_metodo_pago = mp.id_metodo_pago
      GROUP BY mp.tipo_pago
    `);

    const [[productos]] = await pool.query(`
      SELECT COUNT(*) AS total_unidades FROM detalle_venta
    `);

    const [categorias] = await pool.query(`
      SELECT p.categoria, SUM(dv.cantidad) AS unidades
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY p.categoria
    `);

    res.json({
      ventas,
      metodos,
      productos,
      categorias
    });
  } catch (err) {
    console.error('Error en resumen del dashboard:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

reportsController.getInventoryReport = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.nombre AS producto,
        p.categoria,
        p.stock,
        p.precio,
        prov.nombre AS proveedor
      FROM producto p
      JOIN proveedor prov ON p.id_proveedor = prov.id_proveedor
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener inventario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




module.exports = {   
    reportsController,
    salesController
};
