const express = require('express');
const router = express.Router();
const multer = require('multer');
const servicoController = require('../controllers/servico.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verificarTipo = require('../middlewares/verificarTipo');
const autorizacaoServico = require('../middlewares/autorizacaoServico'); // Middleware que verifica se é dono/admin

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Criar serviço com upload
router.post(
  '/',
  authMiddleware,
  verificarTipo(['prestador']),
  upload.single('imagem'),
  servicoController.cadastrarServico
);

// Listar todos os serviços (público)
router.get('/', servicoController.listarServicos);

// Listar serviços do prestador logado
router.get(
  '/meus-servicos',
  authMiddleware,
  verificarTipo(['prestador']),
  servicoController.listarServicosPrestador
);

// Atualizar serviço (com upload opcional)
router.put(
  '/:id',
  authMiddleware,
  autorizacaoServico, // Verifica dono/admin
  upload.single('imagem'), // Pode atualizar imagem
  servicoController.atualizarServico
);

// Excluir serviço
router.delete(
  '/:id',
  authMiddleware,
  autorizacaoServico, // Verifica dono/admin
  servicoController.excluirServico
);

module.exports = router;
