const db = require("../config/db");

// Função para formatar telefone no padrão (XX) X XXXX-XXXX
function formatarTelefone(telefone) {
  return telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
}

module.exports = {
  criarServico: async ({
    titulo,
    descricao,
    categoria,
    cidade,
    contato,
    imagem,
    prestador_id,
    is_categoria = 0 // padrão é serviço
  }) => {
    const pool = await db.connectToDatabase();

    let telefoneFormatado = contato;
    if (contato) {
      const telefoneLimpo = contato.replace(/\D/g, "");
      if (!/^\d{11}$/.test(telefoneLimpo)) {
        throw new Error("Telefone inválido. Informe 11 dígitos (DDD + número).");
      }
      telefoneFormatado = formatarTelefone(telefoneLimpo);
    }

    const query = `
      INSERT INTO Servicos (titulo, descricao, categoria, cidade, contato, imagem, prestador_id, is_categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      titulo,
      descricao,
      categoria,
      cidade,
      telefoneFormatado,
      imagem,
      prestador_id,
      is_categoria
    ]);
  },

  listarServicos: async () => {
    const pool = await db.connectToDatabase();
    const [rows] = await pool.query('SELECT * FROM Servicos WHERE is_categoria = 0');
    return rows;
  },

  listarServicosPorPrestador: async (prestador_id) => {
    const pool = await db.connectToDatabase();
    const [rows] = await pool.query(
      'SELECT * FROM Servicos WHERE prestador_id = ? AND is_categoria = 0',
      [prestador_id]
    );
    return rows;
  },

  atualizarServico: async (id, { titulo, descricao, categoria, cidade, contato, imagem }) => {
    const pool = await db.connectToDatabase();

    let telefoneFormatado = contato;
    if (contato) {
      const telefoneLimpo = contato.replace(/\D/g, "");
      if (!/^\d{11}$/.test(telefoneLimpo)) {
        throw new Error("Telefone inválido. Informe 11 dígitos (DDD + número).");
      }
      telefoneFormatado = formatarTelefone(telefoneLimpo);
    }

    let query = `
      UPDATE Servicos
      SET titulo = ?, descricao = ?, categoria = ?, cidade = ?, contato = ?
    `;
    const params = [titulo, descricao, categoria, cidade, telefoneFormatado];

    if (imagem) {
      query += `, imagem = ?`;
      params.push(imagem);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await pool.query(query, params);
  },

  excluirServico: async (id) => {
    const pool = await db.connectToDatabase();
    const [result] = await pool.query('DELETE FROM Servicos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      throw new Error('Serviço não encontrado ou já foi excluído.');
    }
  }
};
