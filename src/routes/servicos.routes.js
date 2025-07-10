/**
 * @swagger
 * tags:
 *   name: Serviços
 *   description: Rotas de gerenciamento de serviços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Servico:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *           example: Exemplo1
 *         descricao:
 *           type: string
 *           example: Serviço de pintura residencial
 *         categoria:
 *           type: string
 *           example: pintura
 *         cidade:
 *           type: string
 *           example: Rolante
 *         contato:
 *           type: string
 *           example: 51998456321
 *         imagem:
 *           type: string
 *           format: binary
 *           example: imagem.png
 */

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cadastra um novo serviço (prestador ou admin)
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               cidade:
 *                 type: string
 *               contato:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Serviço cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (não é prestador ou admin)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Lista todos os serviços
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /servicos/meus-servicos:
 *   get:
 *     summary: Lista serviços do prestador logado
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços do prestador
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (não é prestador)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço (dono ou admin)
 *     tags: [Serviços]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               cidade:
 *                 type: string
 *               contato:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /servicos/{id}:
 *   delete:
 *     summary: Exclui um serviço (dono ou admin)
 *     tags: [Serviços]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço excluído
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

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

// Criar serviço com upload (agora também aceita admin)
router.post(
  '/',
  authMiddleware,
  verificarTipo(['prestador', 'admin']),
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
  autorizacaoServico,
  upload.single('imagem'),
  servicoController.atualizarServico
);

// Excluir serviço
router.delete(
  '/:id',
  authMiddleware,
  autorizacaoServico,
  servicoController.excluirServico
);

module.exports = router;
