const pool = require('../config/database');

class Supplier {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM proveedores');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ nombre, contacto, telefono, direccion, email }) {
        const [result] = await pool.query(
            'INSERT INTO proveedores (nombre, contacto, telefono, direccion, email) VALUES (?, ?, ?, ?, ?)',
            [nombre, contacto, telefono, direccion, email]
        );
        return result.insertId;
    }

    static async update(id, { nombre, contacto, telefono, direccion, email }) {
        await pool.query(
            'UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, direccion = ?, email = ? WHERE id = ?',
            [nombre, contacto, telefono, direccion, email, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    }

    static async getProductsBySupplier(supplierId) {
        const [rows] = await pool.query(
            'SELECT * FROM productos WHERE proveedor_id = ?',
            [supplierId]
        );
        return rows;
    }
}

module.exports = Supplier;