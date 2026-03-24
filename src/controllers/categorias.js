// src/controllers/categorias.js
const pool = require('../db');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categoria ORDER BY id_categoria');
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categoria WHERE id_categoria = ?', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]
    );
    res.status(201).json({ id_categoria: result.insertId, nombre, descripcion });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const [result] = await pool.query(
      'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
      [nombre, descripcion, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría actualizada' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM categoria WHERE id_categoria = ?', [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) { next(err); }
};
