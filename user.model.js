const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Constantes para consultas SQL reutilizables
const USER_QUERIES = {
    BASE_QUERY: `
        SELECT 
            u.id_usuario, 
            u.nombre, 
            u.contrasena, 
            u.numero_trabajador, 
            u.id_rol,
            r.nombre_rol
        FROM usuario u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
    `
};

const User = {
    /**
     * Busca un usuario por número de trabajador
     * @param {string} numero_trabajador - Número de trabajador
     * @returns {Promise<Object|null>} Usuario encontrado o null
     */
    findByNumeroTrabajador: async (numero_trabajador) => {
        try {
            const [rows] = await pool.query(`
                ${USER_QUERIES.BASE_QUERY}
                WHERE u.numero_trabajador = ?
            `, [numero_trabajador]);

            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar usuario por número de trabajador:', error);
            throw error;
        }
    },

    /**
     * Busca un usuario por nombre
     * @param {string} nombre - Nombre del usuario
     * @returns {Promise<Object|null>} Usuario encontrado o null
     */
    findByNombre: async (nombre) => {
        try {
            const [rows] = await pool.query(`
                ${USER_QUERIES.BASE_QUERY}
                WHERE u.nombre = ?
            `, [nombre]);

            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar usuario por nombre:', error);
            throw error;
        }
    },

    /**
     * Busca un usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object|null>} Usuario encontrado o null
     */
    findById: async (id) => {
        try {
            const [rows] = await pool.query(`
                ${USER_QUERIES.BASE_QUERY}
                WHERE u.id_usuario = ?
            `, [id]);

            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los usuarios
     * @returns {Promise<Array>} Lista de usuarios
     */
    findAll: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    u.id_usuario, 
                    u.nombre, 
                    u.numero_trabajador, 
                    r.nombre_rol
                FROM usuario u
                LEFT JOIN rol r ON u.id_rol = r.id_rol
            `);
            return rows;
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<number>} ID del usuario creado
     */
    create: async ({ nombre, contrasena, numero_trabajador, id_rol }) => {
        try {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            const [result] = await pool.query(`
                INSERT INTO usuario (
                    nombre, 
                    contrasena, 
                    numero_trabajador, 
                    id_rol
                ) VALUES (?, ?, ?, ?)
            `, [nombre, hashedPassword, numero_trabajador, id_rol]);

            return result.insertId;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },

    /**
     * Actualiza un usuario existente
     * @param {number} id - ID del usuario
     * @param {Object} userData - Datos actualizados del usuario
     * @returns {Promise<void>}
     */
    update: async (id, { nombre, numero_trabajador, id_rol }) => {
        try {
            await pool.query(`
                UPDATE usuario SET
                    nombre = ?,
                    numero_trabajador = ?,
                    id_rol = ?
                WHERE id_usuario = ?
            `, [nombre, numero_trabajador, id_rol, id]);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    },

    /**
     * Actualiza la contraseña de un usuario
     * @param {number} id - ID del usuario
     * @param {string} nuevaContrasena - Nueva contraseña
     * @returns {Promise<void>}
     */
    updatePassword: async (id, nuevaContrasena) => {
        try {
            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
            await pool.query(`
                UPDATE usuario SET
                    contrasena = ?
                WHERE id_usuario = ?
            `, [hashedPassword, id]);
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            throw error;
        }
    },

    /**
     * Elimina un usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        try {
            await pool.query(`
                DELETE FROM usuario 
                WHERE id_usuario = ?
            `, [id]);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }
};

module.exports = User;