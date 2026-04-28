const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones de autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_trabajador
 *               - contrasena
 *             properties:
 *               numero_trabajador:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Credenciales faltantes
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Cierra la sesión actual
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autorizado
 */
router.get('/logout', authMiddleware.verifyToken, authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtiene información del usuario actual
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', authMiddleware.verifyToken, authController.getCurrentUser);

module.exports = router;