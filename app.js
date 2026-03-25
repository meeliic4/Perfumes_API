require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/middlewares/errorHandler');
const pool = require('./config/db');const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/marcas', require('./routes/marcas'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/reportes', require('./routes/reportes'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'conectada', timestamp: new Date() });
  } catch {
    res.status(503).json({ status: 'error', db: 'sin conexión' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador de errores
app.use(errorHandler);

module.exports = app;
