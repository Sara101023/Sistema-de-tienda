const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Constantes para mensajes y configuración
const ERROR_MESSAGES = {
    SERVER_ERROR: 'Error en el servidor',
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado',
    USER_DELETED: 'Usuario eliminado',
    PASSWORD_RESET: 'Contraseña restablecida',
    ROLES_ERROR: 'Error al obtener los roles'
};

const SALT_ROUNDS = 10;

const userController = {
    /**
     * Obtiene todos los usuarios con sus roles
     */
    getAllUsers: async (req, res) => {
        try {
          const [users] = await pool.query(`
            SELECT 
                u.id_usuario, 
                u.nombre, 
                u.numero_trabajador, 
                r.nombre_rol AS rol
            FROM usuario u
            LEFT JOIN rol r ON u.id_rol = r.id_rol
        `);
            res.json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
        }
    },

    /**
     * Obtiene todos los roles disponibles
     */
    getRoles: async (req, res) => {
        try {
            const [roles] = await pool.query(`
                SELECT 
                    id_rol, 
                    nombre_rol 
                FROM rol
            `);
            res.json(roles);
        } catch (error) {
            console.error('Error al obtener roles:', error);
            res.status(500).json({ error: ERROR_MESSAGES.ROLES_ERROR });
        }
    },

    /**
     * Crea un nuevo usuario
     */
    createUser: async (req, res) => {
        try {
            const { nombre, contrasena, numero_trabajador, id_rol } = req.body;
            
            // Validación básica de campos
            if (!nombre || !contrasena || !numero_trabajador || !id_rol) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
            
            await pool.query(`
                INSERT INTO usuario (
                    nombre, 
                    contrasena, 
                    numero_trabajador, 
                    id_rol
                ) VALUES (?, ?, ?, ?)`,
                [nombre, hash, numero_trabajador, id_rol]
            );
            
            res.status(201).json({ mensaje: ERROR_MESSAGES.USER_CREATED });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            
            // Manejo especial para duplicados de número de trabajador
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El número de trabajador ya existe' });
            }
            
            res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
        }
    },

    /**
     * Actualiza un usuario existente
     */
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, numero_trabajador, id_rol } = req.body;
            
            // Validación básica de campos
            if (!nombre || !numero_trabajador || !id_rol) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            await pool.query(`
                UPDATE usuario 
                SET 
                    nombre = ?, 
                    numero_trabajador = ?, 
                    id_rol = ? 
                WHERE id_usuario = ?`,
                [nombre, numero_trabajador, id_rol, id]
            );
            
            res.json({ mensaje: ERROR_MESSAGES.USER_UPDATED });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            
            // Manejo especial para duplicados de número de trabajador
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El número de trabajador ya existe' });
            }
            
            res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
        }
    },

    /**
     * Elimina un usuario
     */
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar si el usuario existe antes de eliminar
            const [user] = await pool.query(
                'SELECT id_usuario FROM usuario WHERE id_usuario = ?', 
                [id]
            );
            
            if (user.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            await pool.query(
                'DELETE FROM usuario WHERE id_usuario = ?', 
                [id]
            );
            
            res.json({ mensaje: ERROR_MESSAGES.USER_DELETED });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
        }
    },

    /**
     * Restablece la contraseña de un usuario
     */
    resetPassword: async (req, res) => {
        try {
            const { id } = req.params;
            const { nuevaPassword } = req.body;
            
            if (!nuevaPassword) {
                return res.status(400).json({ error: 'La nueva contraseña es requerida' });
            }
            
            const hash = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);
            
            await pool.query(
                'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?', 
                [hash, id]
            );
            
            res.json({ mensaje: ERROR_MESSAGES.PASSWORD_RESET });
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
        }
    }
};

module.exports = userController;