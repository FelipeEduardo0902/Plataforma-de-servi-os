/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Rotas de gerenciamento de categorias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: Informática
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Cria nova categoria (apenas admin)
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /categorias/{nome}:
 *   delete:
 *     summary: Exclui uma categoria (apenas admin)
 *     tags: [Categorias]
 *     parameters:
 *       - name: nome
 *         in: path
 *         required: true
 *         description: Nome da categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria excluída
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */


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
