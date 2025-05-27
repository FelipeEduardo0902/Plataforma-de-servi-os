const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Cadastrar usuário
exports.cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    if (!['cliente', 'prestador', 'admin'].includes(tipo)) {
      return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const pool = await db.connectToDatabase();
    await pool.request()
      .input('nome', nome)
      .input('email', email)
      .input('senha', senhaCriptografada)
      .input('tipo', tipo)
      .query(`
        INSERT INTO Usuarios (nome, email, senha, tipo)
        VALUES (@nome, @email, @senha, @tipo)
      `);

    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhe: error.message });
  }
};

// Listar todos os usuários (apenas admin)
exports.listarTodos = async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    const result = await pool.request()
      .query('SELECT id, nome, email, tipo, criado_em FROM Usuarios');

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhe: error.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo } = req.body;

  try {
    const pool = await db.connectToDatabase();
    const senhaCriptografada = senha ? await bcrypt.hash(senha, 10) : null;

    let query = `
      UPDATE Usuarios
      SET nome = @nome, email = @email, tipo = @tipo
      ${senha ? ', senha = @senha' : ''}
      WHERE id = @id
    `;

    const request = pool.request()
      .input('id', id)
      .input('nome', nome)
      .input('email', email)
      .input('tipo', tipo);

    if (senhaCriptografada) request.input('senha', senhaCriptografada);

    await request.query(query);

    res.json({ mensagem: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
  }
};

// Excluir usuário
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await db.connectToDatabase();

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Usuarios WHERE id = @id');

    res.json({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir usuário', detalhe: error.message });
  }
};
