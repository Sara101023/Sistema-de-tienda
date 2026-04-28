const pool = require('../config/database');

class Sale {
    static async create(saleData) {
        const { fecha, total, subtotal, iva, id_metodo_pago, usuario_id, items } = saleData;
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // Insertar la venta principal
            const [saleResult] = await conn.query(
                'INSERT INTO venta (fecha, total, subtotal, iva, id_metodo_pago, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
                [fecha, total, subtotal, iva, id_metodo_pago, usuario_id]
            );
            const saleId = saleResult.insertId;

            // Insertar los detalles y actualizar el stock
            for (const item of items) {
                await conn.query(
                    'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, descuento) VALUES (?, ?, ?, ?,?)',
                    [saleId, item.producto_id, item.cantidad, item.precio_unitario, item.descuento]
                );

                await conn.query(
                    'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            await conn.commit();
            return saleId;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async getById(id) {
        const [saleRows] = await pool.query('SELECT * FROM venta WHERE id_venta = ?', [id]);
        if (saleRows.length === 0) return null;

        const [detailRows] = await pool.query(
            `SELECT dv.*, p.nombre AS producto_nombre 
             FROM detalle_venta dv 
             JOIN producto p ON dv.id_producto = p.id_producto 
             WHERE dv.id_venta = ?`,
            [id]
        );

        return {
            ...saleRows[0],
            items: detailRows
        };
    }

    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM venta ORDER BY fecha DESC');
        return rows;
    }

    static async getByDateRange(startDate, endDate) {
        const [rows] = await pool.query(
            'SELECT * FROM venta WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC',
            [startDate, endDate]
        );
        return rows;
    }

    static async processReturn(saleId, items) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            const [sale] = await conn.query('SELECT * FROM venta WHERE id_venta = ?', [saleId]);
            if (sale.length === 0) throw new Error('Venta no encontrada');

            const [returnResult] = await conn.query(
                'INSERT INTO devolucion (id_venta, fecha, motivo) VALUES (?, NOW(), "Devolución de cliente")',
                [saleId]
            );
            const returnId = returnResult.insertId;

            for (const item of items) {
                await conn.query(
                    'INSERT INTO detalle_devolucion (id_devolucion, id_producto, cantidad) VALUES (?, ?, ?)',
                    [returnId, item.producto_id, item.cantidad]
                );

                await conn.query(
                    'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            await conn.commit();
            return returnId;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}

module.exports = Sale;
