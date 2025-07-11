const db = require('../config/db');

// Listar todas as categorias existentes
exports.listarCategorias = async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    const [rows] = await pool.query(
      'SELECT DISTINCT categoria FROM Servicos WHERE is_categoria = 1'
    );

    const categorias = rows.map(row => ({
      id: Buffer.from(row.categoria).toString('base64'),
      nome: row.categoria
    }));

    res.json(categorias);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar categorias', detalhe: error.message });
  }
};

// Criar nova categoria
exports.criarCategoria = async (req, res) => {
  const { nome } = req.body;
  const prestador_id = req.usuario.id;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ erro: 'Nome da categoria é obrigatório.' });
  }

  const categoriaFormatada = nome.trim().charAt(0).toUpperCase() + nome.trim().slice(1).toLowerCase();

  try {
    const pool = await db.connectToDatabase();

    // Verificar se já existe
    const [rows] = await pool.query(
      'SELECT 1 FROM Servicos WHERE categoria = ? AND is_categoria = 1',
      [categoriaFormatada]
    );

    if (rows.length > 0) {
      return res.status(400).json({ erro: 'Essa categoria já existe.' });
    }

    // Criar a categoria como registro em Servicos
    await pool.query(
      `INSERT INTO Servicos (titulo, descricao, categoria, cidade, contato, imagem, prestador_id, is_categoria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `Categoria: ${categoriaFormatada}`, '', categoriaFormatada,
        '', '', null, prestador_id, 1
      ]
    );

    res.status(201).json({ mensagem: 'Categoria criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar categoria', detalhe: error.message });
  }
};

// Excluir categoria
exports.excluirCategoria = async (req, res) => {
  const { nome } = req.params;

  try {
    const pool = await db.connectToDatabase();

    await pool.query(
      'DELETE FROM Servicos WHERE categoria = ? AND is_categoria = 1',
      [nome]
    );

    res.json({ mensagem: 'Categoria excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir categoria', detalhe: error.message });
  }
};
