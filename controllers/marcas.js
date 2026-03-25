// src/controllers/marcas.js
const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM marca ORDER BY nombre');
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM marca WHERE id_marca = ?', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, pais_origen, descripcion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO marca (nombre, pais_origen, descripcion) VALUES (?, ?, ?)',
      [nombre, pais_origen, descripcion]
    );
    res.status(201).json({ id_marca: result.insertId, nombre, pais_origen, descripcion });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, pais_origen, descripcion } = req.body;
    const [result] = await pool.query(
      'UPDATE marca SET nombre = ?, pais_origen = ?, descripcion = ? WHERE id_marca = ?',
      [nombre, pais_origen, descripcion, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json({ message: 'Marca actualizada' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM marca WHERE id_marca = ?', [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json({ message: 'Marca eliminada' });
  } catch (err) { next(err); }
};
