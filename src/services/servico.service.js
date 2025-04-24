const db = require("../config/db");

// Função para formatar o número de telefone no padrão (XX) X XXXX-XXXX
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
    prestador_id
  }) => {
    const pool = await db.connectToDatabase();

    const telefoneLimpo = contato ? contato.replace(/\D/g, "") : "";

    if (!/^\d{11}$/.test(telefoneLimpo)) {
      throw new Error("Telefone inválido. Informe 11 dígitos (DDD + número).");
    }

    const telefoneFormatado = formatarTelefone(telefoneLimpo);

    await pool.request()
      .input("titulo", titulo)
      .input("descricao", descricao)
      .input("categoria", categoria)
      .input("cidade", cidade)
      .input("contato", telefoneFormatado)
      .input("imagem", imagem)
      .input("prestador_id", prestador_id)
      .query(`
        INSERT INTO Servicos (titulo, descricao, categoria, cidade, contato, imagem, prestador_id)
        VALUES (@titulo, @descricao, @categoria, @cidade, @contato, @imagem, @prestador_id)
      `);
  },

  buscarServicos: async (cidade, categoria) => {
    const pool = await db.connectToDatabase();
    let query = 'SELECT * FROM Servicos WHERE 1=1';
    const request = pool.request();

    if (cidade) {
      query += ' AND cidade = @cidade';
      request.input('cidade', cidade);
    }

    if (categoria) {
      query += ' AND categoria = @categoria';
      request.input('categoria', categoria);
    }

    const result = await request.query(query);
    return result.recordset;
  },

  atualizarServico: async (id, { titulo, descricao, categoria, cidade, contato }) => {
    const pool = await db.connectToDatabase();
    await pool.request()
      .input('id', id)
      .input('titulo', titulo)
      .input('descricao', descricao)
      .input('categoria', categoria)
      .input('cidade', cidade)
      .input('contato', contato)
      .query(`
        UPDATE Servicos
        SET titulo = @titulo, descricao = @descricao, categoria = @categoria,
            cidade = @cidade, contato = @contato
        WHERE id = @id
      `);
  },

  excluirServico: async (id) => {
    const pool = await db.connectToDatabase();
    const result = await pool.request()
      .input('id', id)
      .query('DELETE FROM Servicos WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      throw new Error('Serviço não encontrado ou já foi excluído.');
    }
  }
};
