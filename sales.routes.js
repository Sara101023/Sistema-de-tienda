const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRoles } = require('../middlewares/role.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');


router.get('/dia', verifyToken, checkRoles(['administrador']), salesController.getResumenDelDia);
//  Venta accesible como invitado o usuario autenticado
router.post(
  '/',
  authMiddleware.optionalToken, // Permite token o modo invitado
  salesController.processSale
);

//  Cajeros pueden ver todas sus ventas
router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.checkCajero,
  salesController.getAllSales
);

//  Cajero puede consultar una venta específica
router.get(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.checkCajero,
  salesController.getSaleById
);

/*
// Procesar devolución solo por cajero
router.post(
  '/:saleId/returns',
  authMiddleware.verifyToken,
  authMiddleware.checkCajero,
  salesController.processReturn
);
*/

module.exports = router;
