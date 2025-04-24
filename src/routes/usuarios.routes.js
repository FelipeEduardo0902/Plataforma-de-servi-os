const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verificarTipo = require('../middlewares/verificarTipo');

// Rota pública: cadastro de novo usuário
router.post('/', usuarioController.cadastrarUsuario);

// Rota protegida para testar token JWT
router.get('/protegido', authMiddleware, (req, res) => {
  res.json({
    mensagem: 'Você acessou uma rota protegida!',
    usuario: req.usuario
  });
});

// Rota protegida apenas para admins: listar todos os usuários
router.get('/listar-todos', authMiddleware, verificarTipo(['admin']), usuarioController.listarTodos);

module.exports = router;
