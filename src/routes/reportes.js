// src/routes/reportes.js
const router = require('express').Router();
const ctrl   = require('../controllers/reportes');

router.get('/resumen',       ctrl.resumen);          // stats generales
router.get('/top-productos', ctrl.topProductos);     // ?limit=5
router.get('/ventas-mes',    ctrl.ventasPorMes);
router.get('/stock-bajo',    ctrl.stockBajo);        // ?umbral=20

module.exports = router;
