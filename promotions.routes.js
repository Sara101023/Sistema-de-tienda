const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Asegúrate de que esta sea tu conexión a MySQL

// Obtener todas las promociones
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM promocion ORDER BY fecha_inicio DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener promociones:', error.message);
    res.status(500).json({ error: 'Error al obtener promociones' });
  }
});

// Obtener promociones activas
router.get('/activas', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_promocion,
        p.nombre,
        p.descripcion,
        p.tipo_promocion AS tipo,
        p.aplicacion,
        p.categoria,
        pp.id_producto,
        pp.cantidad_minima,
        pp.precio_promocional
      FROM promocion p
      LEFT JOIN promocion_producto pp ON p.id_promocion = pp.id_promocion
      WHERE p.fecha_inicio <= CURDATE()
        AND p.fecha_fin >= CURDATE()
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener promociones activas:', error.message);
    res.status(500).json({ error: 'Error al obtener promociones activas' });
  }
});



// Guardar una nueva promoción
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo_promocion,
      aplicacion,
      categoria,
      fecha_inicio,
      fecha_fin,
      buyX,
      getY,
      cantidad_minima,
      precio_promocional,
      productos = [] // arreglo de IDs de productos
    } = req.body;

    const tiposValidos = ['3x1', '3x2', 'Nx$'];
    if (!tiposValidos.includes(tipo_promocion)) {
      return res.status(400).json({ error: 'Tipo de promoción no permitido' });
    }

    const categoria_final = aplicacion === 'categoria' ? categoria : null;

    // ✅ Crear la promoción UNA SOLA VEZ
    const [result] = await pool.query(`
      INSERT INTO promocion (
        nombre, descripcion, tipo_promocion, aplicacion, categoria,
        fecha_inicio, fecha_fin, buy_x, get_y
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, descripcion, tipo_promocion, aplicacion,
        categoria_final, fecha_inicio, fecha_fin,
        tipo_promocion !== 'Nx$' ? parseInt(buyX) : null,
        tipo_promocion !== 'Nx$' ? parseInt(getY) : null
      ]
    );

    const id_promocion = result.insertId;

    const cantidad = tipo_promocion === 'Nx$' ? cantidad_minima : parseInt(buyX);
    const precio = tipo_promocion === 'Nx$' ? precio_promocional : null;

    // Asociar productos si aplica
if (aplicacion === 'producto') {
  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: 'Debes seleccionar productos para esta promoción' });
  }

  for (const id_producto of productos) {
    await pool.query(
      `INSERT INTO promocion_producto (id_promocion, id_producto, cantidad_minima, precio_promocional)
       VALUES (?, ?, ?, ?)`,
      [id_promocion, id_producto, cantidad, precio]
    );
  }
} else if (aplicacion === 'categoria') {
  // ✅ Obtener todos los productos de esa categoría
  const [productosCategoria] = await pool.query(
    'SELECT id_producto FROM producto WHERE categoria = ?',
    [categoria]
  );

  for (const row of productosCategoria) {
    await pool.query(
      `INSERT INTO promocion_producto (id_promocion, id_producto, cantidad_minima, precio_promocional)
       VALUES (?, ?, ?, ?)`,
      [id_promocion, row.id_producto, cantidad, precio]
    );
  }
}



    res.status(201).json({ message: '✅ Promoción registrada', id: id_promocion });

  } catch (error) {
    console.error('❌ Error al guardar promoción:', error);
    res.status(500).json({ error: 'Error al guardar promoción' });
  }
});

module.exports = router;
