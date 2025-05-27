const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verificarTipo = require('../middlewares/verificarTipo');

// Cadastro público
router.post('/', usuarioController.cadastrarUsuario);

// Rota protegida para listar todos (somente admin)
router.get('/listar-todos', authMiddleware, verificarTipo(['admin']), usuarioController.listarTodos);

// Atualizar usuário (somente admin)
router.put('/:id', authMiddleware, verificarTipo(['admin']), usuarioController.atualizarUsuario);

// Excluir usuário (somente admin)
router.delete('/:id', authMiddleware, verificarTipo(['admin']), usuarioController.excluirUsuario);

module.exports = router;
