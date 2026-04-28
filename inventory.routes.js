const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de productos del inventario
 */

// 🟢 Rutas públicas

/**
 * @swagger
 * /api/inventory/products:
 *   get:
 *     summary: Obtiene todos los productos activos
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/products', authMiddleware.optionalToken, inventoryController.getAllProducts);

/**
 * @swagger
 * /api/inventory/products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Inventario]
 */
router.get('/products/:id', inventoryController.getProductById);

/**
 * @swagger
 * /api/inventory/products/barcode/{barcode}:
 *   get:
 *     summary: Obtiene un producto por código de barras
 *     tags: [Inventario]
 */
router.get('/products/barcode/:barcode', inventoryController.getProductByBarcode);

// 🔒 Rutas protegidas (solo admin)

/**
 * @swagger
 * /api/inventory/products:
 *   post:
 *     summary: Crea un nuevo producto (Admin)
 *     tags: [Inventario]
 */
router.post(
  '/products',
  authMiddleware.verifyToken,
  authMiddleware.checkAdmin,
  inventoryController.createProduct
);

/**
 * @swagger
 * /api/inventory/products/{id}:
 *   put:
 *     summary: Actualiza un producto existente (Admin)
 *     tags: [Inventario]
 */
router.put(
  '/products/:id',
  authMiddleware.verifyToken,
  authMiddleware.checkAdmin,
  inventoryController.updateProduct
);

/**
 * @swagger
 * /api/inventory/products/{id}:
 *   delete:
 *     summary: Desactiva un producto (Admin)
 *     tags: [Inventario]
 */
router.delete(
  '/products/:id',
  authMiddleware.verifyToken,
  authMiddleware.checkAdmin,
  inventoryController.deactivateProduct
);

/**
 * @swagger
 * /api/inventory/low-stock:
 *   get:
 *     summary: Obtiene productos con stock bajo (Admin)
 *     tags: [Inventario]
 */
router.get(
  '/low-stock',
  authMiddleware.verifyToken,
  authMiddleware.checkAdmin,
  inventoryController.checkLowStock
);

module.exports = router;
