const express = require('express');
const router = express.Router();
const { reportsController } = require('../controllers/reports.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Rutas protegidas (solo admin)
router.get('/sales', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.getSalesReport);
router.get('/products/most-sold', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.getMostSoldProducts);
router.get('/payment-methods', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.getPaymentMethodsReport);
router.get('/sales/export', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.exportSalesCSV);
router.get('/sales/pdf', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.exportSalesPDF);
router.get('/proveedores', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.getProveedores);
router.get('/dashboard/resumen', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.getDashboardResumen);
router.get('/inventory', authMiddleware.verifyToken, authMiddleware.checkAdmin, reportsController.getInventoryReport);

module.exports = router;