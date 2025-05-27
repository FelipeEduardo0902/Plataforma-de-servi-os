const db = require('../config/db'); // ajuste o caminho se necessário
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  console.log("🔐 Login solicitado com:", email, senha);

  try {
    const pool = await db.connectToDatabase();
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Usuarios WHERE email = @email');

    const usuario = result.recordset[0];

    if (!usuario) {
      console.log("❌ Usuário não encontrado");
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }


    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      console.log("❌ Senha inválida");
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
    console.error("❌ Erro interno no login:", error);
    res.status(500).json({ erro: 'Erro ao fazer login.', detalhe: error.message });
  }
};
