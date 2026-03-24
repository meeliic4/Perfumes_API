// src/controllers/productos.js
const pool = require('../db');

exports.getAll = async (req, res, next) => {
  try {
    // Filtros opcionales: ?categoria=1 &marca=2 &concentracion=EDP &minPrecio=1000 &maxPrecio=3000
    const { categoria, marca, concentracion, minPrecio, maxPrecio } = req.query;
    let sql = `
      SELECT pr.*, m.nombre AS marca, cat.nombre AS categoria
      FROM producto pr
      JOIN marca m ON m.id_marca = pr.id_marca
      JOIN categoria cat ON cat.id_categoria = pr.id_categoria
      WHERE 1=1
    `;
    const params = [];

    if (categoria)     { sql += ' AND pr.id_categoria = ?';     params.push(categoria); }
    if (marca)         { sql += ' AND pr.id_marca = ?';          params.push(marca); }
    if (concentracion) { sql += ' AND pr.concentracion = ?';    params.push(concentracion); }
    if (minPrecio)     { sql += ' AND pr.precio >= ?';           params.push(minPrecio); }
    if (maxPrecio)     { sql += ' AND pr.precio <= ?';           params.push(maxPrecio); }

    sql += ' ORDER BY pr.nombre';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT pr.*, m.nombre AS marca, cat.nombre AS categoria
       FROM producto pr
       JOIN marca m ON m.id_marca = pr.id_marca
       JOIN categoria cat ON cat.id_categoria = pr.id_categoria
       WHERE pr.id_producto = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, precio, stock, volumen_ml, concentracion, id_categoria, id_marca } = req.body;
    const [result] = await pool.query(
      `INSERT INTO producto (nombre, precio, stock, volumen_ml, concentracion, id_categoria, id_marca)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, precio, stock ?? 0, volumen_ml, concentracion, id_categoria, id_marca]
    );
    res.status(201).json({ id_producto: result.insertId, ...req.body });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, precio, stock, volumen_ml, concentracion, id_categoria, id_marca } = req.body;
    const [result] = await pool.query(
      `UPDATE producto
       SET nombre=?, precio=?, stock=?, volumen_ml=?, concentracion=?, id_categoria=?, id_marca=?
       WHERE id_producto = ?`,
      [nombre, precio, stock, volumen_ml, concentracion, id_categoria, id_marca, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado' });
  } catch (err) { next(err); }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { cantidad } = req.body; // puede ser negativo para restar
    const [result] = await pool.query(
      'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
      [cantidad, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });
    const [[prod]] = await pool.query('SELECT stock FROM producto WHERE id_producto = ?', [req.params.id]);
    res.json({ message: 'Stock actualizado', stock_actual: prod.stock });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM producto WHERE id_producto = ?', [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) { next(err); }
};
