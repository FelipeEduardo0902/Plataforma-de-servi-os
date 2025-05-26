const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const pool = await db.connectToDatabase();
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Usuarios WHERE email = @email');

    const usuario = result.recordset[0];

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    const senhaValida = senha === usuario.senha;
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      tipo: usuario.tipo,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao fazer login.', detalhe: error.message });
  }
};
