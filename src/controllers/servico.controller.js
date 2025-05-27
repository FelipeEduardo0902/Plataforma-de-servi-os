const servicoService = require('../services/servico.service');
const db = require('../config/db');

// Helper para extrair campos do req.body de forma segura (especialmente se usar multer)
function extrairCamposDoBody(req) {
  // Se multer está processando multipart/form-data, req.body será texto e req.file a imagem
  // Caso o frontend envie JSON, req.body estará diretamente disponível.
  // Aqui vamos garantir que sempre funcione
  return {
    titulo: req.body.titulo || '',
    descricao: req.body.descricao || '',
    categoria: req.body.categoria || '',
    cidade: req.body.cidade || '',
    contato: req.body.contato || ''
  };
}

exports.cadastrarServico = async (req, res) => {
  try {
    const prestador_id = req.usuario.id;
    const { titulo, descricao, categoria, cidade, contato } = extrairCamposDoBody(req);
    const imagem = req.file ? req.file.filename : null;

    await servicoService.criarServico({
      titulo,
      descricao,
      categoria,
      cidade,
      contato,
      imagem,
      prestador_id
    });

    res.status(201).json({ mensagem: 'Serviço cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar serviço', detalhe: error.message });
  }
};

exports.listarServicos = async (req, res) => {
  try {
    const servicos = await servicoService.listarServicos();
    res.json(servicos);
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res.status(500).json({ erro: 'Erro ao listar serviços', detalhe: error.message });
  }
};

exports.listarServicosPrestador = async (req, res) => {
  try {
    const prestadorId = req.usuario.id;
    console.log('Listando serviços do prestador:', prestadorId);
    const servicos = await servicoService.listarServicosPorPrestador(prestadorId);
    res.json(servicos);
  } catch (error) {
    console.error('Erro ao listar serviços do prestador:', error);
    res.status(500).json({ erro: 'Erro ao listar serviços do prestador', detalhe: error.message });
  }
};

exports.atualizarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const prestadorIdLogado = req.usuario.id;
    const tipoUsuario = req.usuario.tipo;

    // Extrair campos do corpo da requisição de forma segura
    const { titulo, descricao, categoria, cidade, contato } = extrairCamposDoBody(req);
    const imagem = req.file ? req.file.filename : null;

    console.log('Usuário logado:', req.usuario);
    console.log('ID do serviço a ser atualizado:', id);

    const pool = await db.connectToDatabase();

    // Busca serviço para verificar dono
    const resultado = await pool.request()
      .input('id', id)
      .query('SELECT prestador_id FROM Servicos WHERE id = @id');

    if (resultado.recordset.length === 0) {
      console.log('Serviço não encontrado para atualização. ID:', id);
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    const donoServico = resultado.recordset[0].prestador_id;
    console.log('Dono do serviço:', donoServico);

    // Só admin ou dono pode atualizar (conversão para string para evitar problema de tipo)
    if (tipoUsuario !== 'admin' && donoServico.toString() !== prestadorIdLogado.toString()) {
      console.log('Permissão negada para atualizar. Usuário:', prestadorIdLogado, 'Dono do serviço:', donoServico);
      return res.status(403).json({ erro: 'Você não tem permissão para atualizar este serviço.' });
    }

    await servicoService.atualizarServico(id, {
      titulo,
      descricao,
      categoria,
      cidade,
      contato,
      imagem
    });

    res.json({ mensagem: 'Serviço atualizado com sucesso!', imagem });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', detalhe: error.message });
  }
};

exports.excluirServico = async (req, res) => {
  try {
    const { id } = req.params;
    const prestadorIdLogado = req.usuario.id;
    const tipoUsuario = req.usuario.tipo;

    console.log('Usuário logado:', req.usuario);
    console.log('ID do serviço a ser excluído:', id);

    const pool = await db.connectToDatabase();

    // Busca serviço para verificar dono
    const resultado = await pool.request()
      .input('id', id)
      .query('SELECT prestador_id FROM Servicos WHERE id = @id');

    if (resultado.recordset.length === 0) {
      console.log('Serviço não encontrado para exclusão. ID:', id);
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    const donoServico = resultado.recordset[0].prestador_id;
    console.log('Dono do serviço:', donoServico);

    // Só admin ou dono pode excluir
    if (tipoUsuario !== 'admin' && donoServico.toString() !== prestadorIdLogado.toString()) {
      console.log('Permissão negada para excluir. Usuário:', prestadorIdLogado, 'Dono do serviço:', donoServico);
      return res.status(403).json({ erro: 'Você não tem permissão para excluir este serviço.' });
    }

    await servicoService.excluirServico(id);

    res.json({ mensagem: 'Serviço excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({ erro: 'Erro ao excluir serviço', detalhe: error.message });
  }
};
