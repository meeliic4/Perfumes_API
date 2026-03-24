// src/index.js
require('dotenv').config();
const express      = require('express');
const errorHandler = require('./middleware/errorHandler');
const pool         = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware global ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Rutas ────────────────────────────────────────────────────
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/marcas',     require('./routes/marcas'));
app.use('/api/productos',  require('./routes/productos'));
app.use('/api/clientes',   require('./routes/clientes'));
app.use('/api/pedidos',    require('./routes/pedidos'));
app.use('/api/reportes',   require('./routes/reportes'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'conectada', timestamp: new Date() });
  } catch {
    res.status(503).json({ status: 'error', db: 'sin conexión' });
  }
});

// ── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// ── Manejador de errores global ──────────────────────────────
app.use(errorHandler);

// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌸 Perfumería API corriendo en http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
