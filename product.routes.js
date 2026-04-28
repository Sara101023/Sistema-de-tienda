const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Ruta para búsqueda de productos por nombre
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const [productos] = await pool.query(
      'SELECT id_producto, nombre FROM producto WHERE nombre LIKE ? LIMIT 10',
      [`%${search}%`]
    );
    res.json(productos);
  } catch (err) {
    console.error('Error al buscar productos:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
