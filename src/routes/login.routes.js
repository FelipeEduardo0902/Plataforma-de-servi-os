/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Rotas de autenticação
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: joao@email.com
 *         senha:
 *           type: string
 *           example: 123456
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login e gera token
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */


const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.login);


module.exports = router;
