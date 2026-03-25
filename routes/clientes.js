// src/routes/clientes.js
const router = require('express').Router();
const ctrl   = require('../controllers/clientes');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const rules = [
  body('nombre').notEmpty().trim(),
  body('apellido').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('telefono').optional().trim(),
];

router.get('/',             ctrl.getAll);
router.get('/:id',          ctrl.getOne);
router.get('/:id/pedidos',  ctrl.getPedidos);
router.post('/',            rules, validate, ctrl.create);
router.put('/:id',          rules, validate, ctrl.update);
router.delete('/:id',       ctrl.remove);

module.exports = router;
