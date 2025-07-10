/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas de gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: João da Silva
 *         email:
 *           type: string
 *           example: joao@email.com
 *         senha:
 *           type: string
 *           example: 123456
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /usuarios/listar-todos:
 *   get:
 *     summary: Lista todos os usuários (apenas admin)
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (não é admin)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário (apenas admin)
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (não é admin)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário (apenas admin)
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (não é admin)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */



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
