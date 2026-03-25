// src/controllers/pedidos.js
const pool = require('../config/db');

// ── Pedidos ──────────────────────────────────────────────────

exports.getAll = async (req, res, next) => {
  try {
    const { estado, clienteId } = req.query;
    let sql = `
      SELECT p.id_pedido, CONCAT(c.nombre,' ',c.apellido) AS cliente,
             p.fecha_pedido, p.estado, p.total
      FROM pedido p
      JOIN cliente c ON c.id_cliente = p.id_cliente
      WHERE 1=1
    `;
    const params = [];
    if (estado)    { sql += ' AND p.estado = ?';      params.push(estado); }
    if (clienteId) { sql += ' AND p.id_cliente = ?';  params.push(clienteId); }
    sql += ' ORDER BY p.fecha_pedido DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [[pedido]] = await pool.query(
      `SELECT p.*, CONCAT(c.nombre,' ',c.apellido) AS cliente, c.email
       FROM pedido p JOIN cliente c ON c.id_cliente = p.id_cliente
       WHERE p.id_pedido = ?`,
      [req.params.id]
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    const [detalles] = await pool.query(
      `SELECT dp.id_detalle, pr.nombre AS producto, dp.cantidad,
              dp.precio_unitario, dp.subtotal
       FROM detalle_pedido dp
       JOIN producto pr ON pr.id_producto = dp.id_producto
       WHERE dp.id_pedido = ?`,
      [req.params.id]
    );
    res.json({ ...pedido, detalles });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id_cliente, items } = req.body;
    // items: [{ id_producto, cantidad, precio_unitario }]

    const [pedRes] = await conn.query(
      'INSERT INTO pedido (id_cliente) VALUES (?)', [id_cliente]
    );
    const id_pedido = pedRes.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO detalle_pedido (cantidad, precio_unitario, id_pedido, id_producto)
         VALUES (?, ?, ?, ?)`,
        [item.cantidad, item.precio_unitario, id_pedido, item.id_producto]
      );
    }

    await conn.commit();
    res.status(201).json({ id_pedido, message: 'Pedido creado' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally { conn.release(); }
};

exports.updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const estados = ['pendiente','confirmado','enviado','entregado','cancelado'];
    if (!estados.includes(estado))
      return res.status(400).json({ error: `Estado inválido. Opciones: ${estados.join(', ')}` });

    const [result] = await pool.query(
      'UPDATE pedido SET estado = ? WHERE id_pedido = ?',
      [estado, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ message: 'Estado actualizado', estado });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM pedido WHERE id_pedido = ?', [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ message: 'Pedido eliminado' });
  } catch (err) { next(err); }
};

// ── Detalles ─────────────────────────────────────────────────

exports.addDetalle = async (req, res, next) => {
  try {
    const { id_producto, cantidad, precio_unitario } = req.body;
    const [result] = await pool.query(
      `INSERT INTO detalle_pedido (cantidad, precio_unitario, id_pedido, id_producto)
       VALUES (?, ?, ?, ?)`,
      [cantidad, precio_unitario, req.params.id, id_producto]
    );
    res.status(201).json({ id_detalle: result.insertId, message: 'Detalle agregado' });
  } catch (err) { next(err); }
};

exports.removeDetalle = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM detalle_pedido WHERE id_detalle = ? AND id_pedido = ?',
      [req.params.idDetalle, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Detalle no encontrado' });
    res.json({ message: 'Detalle eliminado' });
  } catch (err) { next(err); }
};
