const pool = require('../config/database');

// Constantes para estados y configuraciones
const PRODUCT_STATUS = {
    ACTIVE: 'activo',
    INACTIVE: 'inactivo'
};

class Product {
    /**
     * Obtiene todos los productos activos
     * @returns {Promise<Array>} Lista de productos
     */
    static async getAll() {
        const [rows] = await pool.query(`
        SELECT 
            id_producto,
            nombre,
            descripcion,
            precio,
            stock,
            codigo_barras,
            id_proveedor,
            estado,
            fecha_desactivacion,
            categoria
        FROM producto 
        WHERE estado = ?
    `, [PRODUCT_STATUS.ACTIVE]);
        return rows;
    }

    /**
     * Obtiene un producto por ID
     * @param {number} id - ID del producto
     * @returns {Promise<Object|null>} Producto encontrado o null
     */
    static async getById(id) {
        const [rows] = await pool.query(`
        SELECT id_producto, nombre, descripcion, precio, stock, codigo_barras,
               id_proveedor, estado, fecha_desactivacion, categoria, tiene_iva
        FROM producto 
        WHERE id_producto = ?
    `, [id]);
        return rows[0] || null;
    }


    /**
     * Obtiene un producto por código de barras
     * @param {string} barcode - Código de barras
     * @returns {Promise<Object|null>} Producto encontrado o null
     */
    static async getByBarcode(barcode) {
        const [rows] = await pool.query(`
            SELECT * FROM producto 
            WHERE codigo_barras = ?
        `, [barcode]);
        return rows[0] || null;
    }

    /**
     * Crea un nuevo producto
     * @param {Object} productData - Datos del producto
     * @returns {Promise<number>} ID del producto creado
     */
    static async create(productData) {
        const {
            nombre,
            descripcion = null,
            precio,
            stock,
            codigo_barras,
            id_proveedor = null
        } = productData;

        const [result] = await pool.query(`
            INSERT INTO producto (
                nombre,
                descripcion,
                precio,
                stock,
                codigo_barras,
                id_proveedor,
                estado,
                fecha_desactivacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
        `, [
            nombre,
            descripcion,
            precio,
            stock,
            codigo_barras,
            id_proveedor,
            PRODUCT_STATUS.ACTIVE
        ]);

        return result.insertId;
    }

    /**
     * Actualiza un producto existente
     * @param {number} id - ID del producto
     * @param {Object} productData - Datos actualizados del producto
     * @returns {Promise<void>}
     */
    static async update(id, productData) {
        await pool.query(`
            UPDATE producto SET 
    nombre = ?,
    descripcion = ?,
    precio = ?,
    stock = ?,
    codigo_barras = ?,
    id_proveedor = ?,
    estado = ?
WHERE id_producto = ?

        `, [
            productData.nombre,
            productData.descripcion,
            productData.precio,
            productData.stock,
            productData.codigo_barras,
            productData.id_proveedor,
            productData.estado, // ← nuevo
            id
        ]);
    }

    /**
     * Desactiva un producto
     * @param {number} id - ID del producto
     * @returns {Promise<void>}
     */
    static async deactivate(id) {
        await pool.query(`
            UPDATE producto 
            SET estado = ?,
                fecha_desactivacion = NOW()
            WHERE id_producto = ?
        `, [PRODUCT_STATUS.INACTIVE, id]);
    }

    /**
     * Obtiene productos con stock bajo (menor o igual a 5)
     * @returns {Promise<Array>} Lista de productos con stock bajo
     */
    static async getLowStock() {
        const [rows] = await pool.query(`
            SELECT 
                id_producto,
                nombre,
                stock
            FROM producto 
            WHERE stock <= 5 
            AND estado = ?
        `, [PRODUCT_STATUS.ACTIVE]);
        return rows;
    }

    /**
     * Actualiza el stock de un producto
     * @param {number} id - ID del producto
     * @param {number} quantity - Cantidad a añadir/restar (positivo/negativo)
     * @returns {Promise<void>}
     */
    static async updateStock(id, quantity) {
        await pool.query(`
            UPDATE producto 
            SET stock = stock + ? 
            WHERE id_producto = ?
        `, [quantity, id]);
    }

    /**
     * Busca productos por nombre
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Promise<Array>} Lista de productos coincidentes
     */
    static async search(searchTerm) {
        const [rows] = await pool.query(`
            SELECT * FROM producto 
            WHERE nombre LIKE ?
            AND estado = ?
        `, [`%${searchTerm}%`, PRODUCT_STATUS.ACTIVE]);
        return rows;
    }
}

module.exports = Product;