// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Error de clave duplicada (MySQL 1062)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único.' });
  }

  // Error de FK violada
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ error: 'No se puede eliminar: existen registros relacionados.' });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'El ID referenciado no existe.' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
};

module.exports = errorHandler;
