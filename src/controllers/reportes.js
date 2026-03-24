// src/controllers/reportes.js
const pool = require('../db');

// Top productos más vendidos
exports.topProductos = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [rows] = await pool.query(
      `SELECT pr.nombre AS producto, m.nombre AS marca,
              SUM(dp.cantidad) AS unidades_vendidas,
              SUM(dp.subtotal) AS ingresos
       FROM detalle_pedido dp
       JOIN producto pr ON pr.id_producto = dp.id_producto
       JOIN marca m     ON m.id_marca     = pr.id_marca
       JOIN pedido p    ON p.id_pedido    = dp.id_pedido
       WHERE p.estado != 'cancelado'
       GROUP BY dp.id_producto
       ORDER BY unidades_vendidas DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// Ventas por mes
exports.ventasPorMes = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(fecha_pedido, '%Y-%m') AS mes,
              COUNT(*) AS pedidos,
              SUM(total) AS total_ventas
       FROM pedido
       WHERE estado != 'cancelado'
       GROUP BY mes
       ORDER BY mes DESC
       LIMIT 12`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// Stock bajo (menores a N unidades)
exports.stockBajo = async (req, res, next) => {
  try {
    const umbral = parseInt(req.query.umbral) || 20;
    const [rows] = await pool.query(
      `SELECT pr.id_producto, pr.nombre, m.nombre AS marca,
              pr.stock, pr.precio
       FROM producto pr
       JOIN marca m ON m.id_marca = pr.id_marca
       WHERE pr.stock <= ?
       ORDER BY pr.stock ASC`,
      [umbral]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// Resumen general del catálogo
exports.resumen = async (req, res, next) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM producto)  AS total_productos,
        (SELECT COUNT(*) FROM cliente)   AS total_clientes,
        (SELECT COUNT(*) FROM pedido WHERE estado != 'cancelado') AS pedidos_activos,
        (SELECT COALESCE(SUM(total),0) FROM pedido WHERE estado = 'entregado') AS ingresos_totales
    `);
    res.json(stats);
  } catch (err) { next(err); }
};
