const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categorias.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verificarTipo = require('../middlewares/verificarTipo');

// Listar categorias (acesso público)
router.get('/', categoriaController.listarCategorias);

// Criar nova categoria (apenas admin)
router.post(
  '/',
  authMiddleware,
  verificarTipo(['admin']),
  categoriaController.criarCategoria
);

// Excluir categoria (apenas admin)
router.delete(
  '/:nome',
  authMiddleware,
  verificarTipo(['admin']),
  categoriaController.excluirCategoria
);

module.exports = router;
