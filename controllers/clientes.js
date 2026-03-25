// src/controllers/clientes.js
const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM cliente ORDER BY apellido, nombre'
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM cliente WHERE id_cliente = ?', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.getPedidos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, COUNT(dp.id_detalle) AS total_items
       FROM pedido p
       LEFT JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
       WHERE p.id_cliente = ?
       GROUP BY p.id_pedido
       ORDER BY p.fecha_pedido DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const [result] = await pool.query(
      'INSERT INTO cliente (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
      [nombre, apellido, email, telefono ?? null]
    );
    res.status(201).json({ id_cliente: result.insertId, nombre, apellido, email });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const [result] = await pool.query(
      'UPDATE cliente SET nombre=?, apellido=?, email=?, telefono=? WHERE id_cliente=?',
      [nombre, apellido, email, telefono ?? null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente actualizado' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cliente WHERE id_cliente = ?', [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado' });
  } catch (err) { next(err); }
};
