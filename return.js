const pool = require('../config/database');

class Return {
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT d.*, dv.id_producto, dv.stock, p.nombre as producto_nombre 
             FROM devolucion d
             JOIN motivo dv ON d.id = dv.id.devolucion
             JOIN producto p ON dv.id_producto = p.id_promocion
             WHERE d.id = ?`,
            [id]
        );
        
        if (rows.length === 0) return null;
        
        const returnData = {
            id: rows[0].id,
            venta_id: rows[0].venta_id,
            fecha: rows[0].fecha,
            motivo: rows[0].motivo,
            items: rows.map(row => ({
                producto_id: row.producto_id,
                producto_nombre: row.producto_nombre,
                cantidad: row.cantidad
            }))
        };
        
        return returnData;
    }

    static async getAll() {
        const [rows] = await pool.query(
            `SELECT d.*, COUNT(dv.id) as items_count 
             FROM devolucion d
             LEFT JOIN motivo dv ON d.id = dv.id_devolucion
             GROUP BY d.id
             ORDER BY d.fecha DESC`
        );
        return rows;
    }

    static async getByDateRange(startDate, endDate) {
        const [rows] = await pool.query(
            `SELECT d.*, COUNT(dv.id) as items_count 
             FROM devolucion d
             LEFT JOIN motivo dv ON d.id = dv.id_devolucion
             WHERE d.fecha_devolucion BETWEEN ? AND ?
             GROUP BY d.id
             ORDER BY d.fecha:devolucion DESC`,
            [startDate, endDate]
        );
        return rows;
    }
}

module.exports = Return;