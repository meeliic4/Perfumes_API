// src/routes/pedidos.js
const router = require('express').Router();
const ctrl   = require('../controllers/pedidos');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const itemRules = [
  body('id_producto').isInt({ min: 1 }),
  body('cantidad').isInt({ min: 1 }),
  body('precio_unitario').isFloat({ min: 0 }),
];

router.get('/',                           ctrl.getAll);     // ?estado= &clienteId=
router.get('/:id',                        ctrl.getOne);
router.post('/',
  body('id_cliente').isInt({ min: 1 }),
  body('items').isArray({ min: 1 }),
  validate, ctrl.create);
router.patch('/:id/estado',
  body('estado').notEmpty(), validate, ctrl.updateEstado);
router.delete('/:id',                     ctrl.remove);

// Detalles
router.post('/:id/detalles',              itemRules, validate, ctrl.addDetalle);
router.delete('/:id/detalles/:idDetalle', ctrl.removeDetalle);

module.exports = router;
