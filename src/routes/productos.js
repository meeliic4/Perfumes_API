// src/routes/productos.js
const router = require('express').Router();
const ctrl   = require('../controllers/productos');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const rules = [
  body('nombre').notEmpty().trim(),
  body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('stock').optional().isInt({ min: 0 }),
  body('volumen_ml').isFloat({ min: 0 }),
  body('concentracion').isIn(['EDC','EDT','EDP','Parfum','Colonia']),
  body('id_categoria').isInt({ min: 1 }),
  body('id_marca').isInt({ min: 1 }),
];

router.get('/',              ctrl.getAll);       // ?categoria= &marca= &concentracion= &minPrecio= &maxPrecio=
router.get('/:id',           ctrl.getOne);
router.post('/',             rules, validate, ctrl.create);
router.put('/:id',           rules, validate, ctrl.update);
router.patch('/:id/stock',   body('cantidad').isInt(), validate, ctrl.updateStock);
router.delete('/:id',        ctrl.remove);

module.exports = router;
