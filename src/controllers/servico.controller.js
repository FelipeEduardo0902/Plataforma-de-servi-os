const servicoService = require('../services/servico.service');
const db = require('../config/db');

function extrairCamposDoBody(req) {
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

    const { titulo, descricao, categoria, cidade, contato } = extrairCamposDoBody(req);
    const imagem = req.file ? req.file.filename : null;

    const pool = await db.connectToDatabase();

    const [rows] = await pool.query('SELECT prestador_id FROM Servicos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    const donoServico = rows[0].prestador_id;

    if (tipoUsuario !== 'admin' && donoServico.toString() !== prestadorIdLogado.toString()) {
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

    const pool = await db.connectToDatabase();

    const [rows] = await pool.query('SELECT prestador_id FROM Servicos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }

    const donoServico = rows[0].prestador_id;

    if (tipoUsuario !== 'admin' && donoServico.toString() !== prestadorIdLogado.toString()) {
      return res.status(403).json({ erro: 'Você não tem permissão para excluir este serviço.' });
    }

    await servicoService.excluirServico(id);

    res.json({ mensagem: 'Serviço excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({ erro: 'Erro ao excluir serviço', detalhe: error.message });
  }
};
