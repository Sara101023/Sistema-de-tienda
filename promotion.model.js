const db = require('../config/database');

async function getActivePromotionsForProduct(producto) {
  const [rows] = await db.query(`
      SELECT 
      p.id_promocion,
      p.nombre,
      p.tipo,
      p.tipo_promocion,
      p.aplicacion,
      p.categoria,
      pp.id_producto,
      pp.cantidad_minima,
      pp.precio_promocional
    FROM promocion p
    LEFT JOIN promocion_producto pp ON p.id_promocion = pp.id_promocion
    WHERE p.fecha_inicio <= CURDATE()
      AND p.fecha_fin >= CURDATE()
      AND (
        p.aplicacion = 'global'
        OR (p.aplicacion = 'producto' AND pp.id_producto = ?)
        OR (p.aplicacion = 'categoria' AND p.categoria = ?)
      )
 
  `, [producto.id_producto, producto.categoria]);

  return rows;
}


async function getAllActivePromotions() {
  const [rows] = await db.query(`
    SELECT 
      p.id_promocion,
      p.tipo_promocion,
      pp.id_producto,
      pp.cantidad_minima,
      pp.precio_promocional
    FROM promocion p
    JOIN promocion_producto pp ON p.id_promocion = pp.id_promocion
    WHERE CURDATE() BETWEEN p.fecha_inicio AND p.fecha_fin
  `);

  return rows;
}


module.exports = {
  getActivePromotionsForProduct, getAllActivePromotions

};
