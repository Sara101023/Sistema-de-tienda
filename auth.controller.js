const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const TOKEN_EXPIRATION = '8h';
const INVALID_CREDENTIALS_MSG = 'Credenciales inválidas';

const authController = {
    /**
     * Autentica un usuario y genera un token JWT
     */
    login: async (req, res) => {
        try {
            const { numero_trabajador, contrasena } = req.body;

            // Validación de campos
            if (!numero_trabajador || !contrasena) {
                return res.status(400).json({ 
                    error: 'Número de trabajador y contraseña son requeridos' 
                });
            }

            // Buscar usuario
            const user = await User.findByNumeroTrabajador(numero_trabajador);
            if (!user) {
                return sendInvalidCredentials(res);
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
            if (!isPasswordValid) {
                return sendInvalidCredentials(res);
            }

            // Generar token
            const token = generateToken(user);

            // Respuesta exitosa
            res.json({
                token,
                user: formatUserResponse(user)
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    /**
     * Cierra la sesión (lógica del lado del cliente)
     */
    logout: (req, res) => {
        res.json({ message: 'Sesión cerrada correctamente' });
    },

    /**
     * Obtiene información del usuario actual
     */
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(formatUserResponse(user));
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};

// Funciones auxiliares
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id_usuario,
            role: user.nombre_rol,
            nombre: user.nombre,
            id_rol: user.id_rol
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
    );
}

function formatUserResponse(user) {
    return {
        id: user.id_usuario,
        nombre: user.nombre,
        numero_trabajador: user.numero_trabajador,
        rol: user.nombre_rol

    };
}

function sendInvalidCredentials(res) {
    return res.status(401).json({ error: INVALID_CREDENTIALS_MSG });
}

module.exports = authController;