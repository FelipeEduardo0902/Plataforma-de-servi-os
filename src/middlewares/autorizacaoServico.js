const db = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    const pool = await db.connectToDatabase();
    const resultado = await pool.request()
      .input('id', id)
      .query('SELECT prestador_id FROM Servicos WHERE id = @id');

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    const donoServico = resultado.recordset[0].prestador_id;

    if (usuario.tipo !== 'admin' && donoServico.toString() !== usuario.id.toString()) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de autorização:', error);
    res.status(500).json({ erro: 'Erro interno no middleware.' });
  }
};
