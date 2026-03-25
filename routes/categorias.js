// src/routes/categorias.js
const router = require('express').Router();
const ctrl = require('../controllers/categorias');
const { body } = require('express-validator');

// 🔧 CORRECCIÓN AQUÍ (middlewares con S)
const validate = require('../middlewares/validate');

const rules = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').trim(),
  body('descripcion').optional().trim(),
];

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', rules, validate, ctrl.create);
router.put('/:id', rules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;