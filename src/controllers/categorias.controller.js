const db = require('../config/db');

// Listar todas as categorias existentes (retorna [{ id, nome }, ...])
exports.listarCategorias = async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    const result = await pool.request().query(
      'SELECT DISTINCT categoria FROM Servicos WHERE is_categoria = 1'
    );
    // Array de objetos para o front: [{ id, nome }]
    const categorias = result.recordset.map(row => ({
      id: Buffer.from(row.categoria).toString('base64'), // ID seguro pro React
      nome: row.categoria
    }));
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar categorias', detalhe: error.message });
  }
};

// Criar nova categoria (apenas admin, usando o middleware)
exports.criarCategoria = async (req, res) => {
  const { nome } = req.body;
  const prestador_id = req.usuario.id; // pega do JWT pelo middleware
  if (!nome || !nome.trim()) {
    return res.status(400).json({ erro: 'Nome da categoria é obrigatório.' });
  }
  // Formatar: 1ª letra maiúscula, resto minúsculo
  const categoriaFormatada = nome.trim().charAt(0).toUpperCase() + nome.trim().slice(1).toLowerCase();
  try {
    const pool = await db.connectToDatabase();

    // Verificar se já existe
    const result = await pool.request()
      .input('categoria', categoriaFormatada)
      .query('SELECT 1 FROM Servicos WHERE categoria = @categoria AND is_categoria = 1');
    if (result.recordset.length > 0) {
      return res.status(400).json({ erro: 'Essa categoria já existe.' });
    }

    // Criar a categoria (placeholder)
    await pool.request()
      .input('titulo', `Categoria: ${categoriaFormatada}`)
      .input('descricao', '')
      .input('categoria', categoriaFormatada)
      .input('cidade', '')
      .input('contato', '')
      .input('imagem', null)
      .input('prestador_id', prestador_id)
      .input('is_categoria', 1)
      .query(`
        INSERT INTO Servicos (titulo, descricao, categoria, cidade, contato, imagem, prestador_id, is_categoria)
        VALUES (@titulo, @descricao, @categoria, @cidade, @contato, @imagem, @prestador_id, @is_categoria)
      `);

    res.status(201).json({ mensagem: 'Categoria criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar categoria', detalhe: error.message });
  }
};

// Excluir categoria (apenas admin)
exports.excluirCategoria = async (req, res) => {
  const { nome } = req.params;
  try {
    const pool = await db.connectToDatabase();
    // Remove todos os serviços que são placeholder de categoria
    await pool.request()
      .input('categoria', nome)
      .query("DELETE FROM Servicos WHERE categoria = @categoria AND is_categoria = 1");
    res.json({ mensagem: 'Categoria excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir categoria', detalhe: error.message });
  }
};
