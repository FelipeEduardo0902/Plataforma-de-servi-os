const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.criarUsuario = async ({ nome, email, senha, tipo }) => {
  if (!['cliente', 'prestador', 'admin'].includes(tipo)) {
    throw new Error('Tipo de usuário inválido');
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
};
