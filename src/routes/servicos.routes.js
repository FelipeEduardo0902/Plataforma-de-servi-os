const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const servicoController = require('../controllers/servico.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verificarTipo = require('../middlewares/verificarTipo');

// Configuração do upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + '-' + file.originalname;
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });

// Rota para criar serviço
router.post(
  '/',
  authMiddleware,
  verificarTipo(['prestador']),
  upload.single('imagem'),
  servicoController.cadastrarServico
);

// Rota para listar todos os serviços
router.get('/', servicoController.listarServicos);

// 🔄 Rota para atualizar um serviço (somente admin ou dono pode atualizar, se quiser proteger)
router.put(
  '/:id',
  authMiddleware,
  verificarTipo(['admin', 'prestador']), // ajuste conforme as regras
  servicoController.atualizarServico
);

// ❌ Rota para excluir um serviço
router.delete(
  '/:id',
  authMiddleware,
  verificarTipo(['admin']), // apenas admin pode excluir
  servicoController.excluirServico
);

module.exports = router;
