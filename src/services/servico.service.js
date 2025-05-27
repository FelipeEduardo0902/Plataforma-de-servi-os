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

    await pool.request()
      .input("titulo", titulo)
      .input("descricao", descricao)
      .input("categoria", categoria)
      .input("cidade", cidade)
      .input("contato", telefoneFormatado)
      .input("imagem", imagem)
      .input("prestador_id", prestador_id)
      .input("is_categoria", is_categoria)
      .query(`
        INSERT INTO Servicos (titulo, descricao, categoria, cidade, contato, imagem, prestador_id, is_categoria)
        VALUES (@titulo, @descricao, @categoria, @cidade, @contato, @imagem, @prestador_id, @is_categoria)
      `);
  },

  listarServicos: async () => {
    const pool = await db.connectToDatabase();
    const result = await pool.request()
      .query('SELECT * FROM Servicos WHERE is_categoria = 0');
    return result.recordset;
  },

  listarServicosPorPrestador: async (prestador_id) => {
    const pool = await db.connectToDatabase();
    const result = await pool.request()
      .input('prestador_id', prestador_id)
      .query('SELECT * FROM Servicos WHERE prestador_id = @prestador_id AND is_categoria = 0');
    return result.recordset;
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
      SET titulo = @titulo, descricao = @descricao, categoria = @categoria,
          cidade = @cidade, contato = @contato
    `;
    if (imagem) {
      query += `, imagem = @imagem`;
    }
    query += ` WHERE id = @id`;

    const request = pool.request()
      .input('id', id)
      .input('titulo', titulo)
      .input('descricao', descricao)
      .input('categoria', categoria)
      .input('cidade', cidade)
      .input('contato', telefoneFormatado);

    if (imagem) {
      request.input('imagem', imagem);
    }

    await request.query(query);
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
