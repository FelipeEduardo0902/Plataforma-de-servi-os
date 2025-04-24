const servicoService = require('../services/servico.service');

exports.cadastrarServico = async (req, res) => {
  try {
    const prestador_id = req.usuario.id;
    const { titulo, descricao, categoria, cidade, contato } = req.body;
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
    res.status(500).json({ erro: 'Erro ao cadastrar serviço', detalhe: error.message });
  }
};

exports.listarServicos = async (req, res) => {
  try {
    const { cidade, categoria } = req.query;
    const servicos = await servicoService.buscarServicos(cidade, categoria);
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar serviços', detalhe: error.message });
  }
};

exports.atualizarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria, cidade, contato } = req.body;
    await servicoService.atualizarServico(id, { titulo, descricao, categoria, cidade, contato });
    res.json({ mensagem: 'Serviço atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar serviço', detalhe: error.message });
  }
};

exports.excluirServico = async (req, res) => {
  try {
    const { id } = req.params;
    await servicoService.excluirServico(id);
    res.json({ mensagem: 'Serviço excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir serviço', detalhe: error.message });
  }
};

// src/services/servico.service.js
const db = require('../config/db');

exports.atualizarServico = async (id, { titulo, descricao, categoria, cidade, contato }) => {
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
};

exports.excluirServico = async (id) => {
  const pool = await db.connectToDatabase();
  const result = await pool.request()
    .input('id', id)
    .query('DELETE FROM Servicos WHERE id = @id');

  if (result.rowsAffected[0] === 0) {
    throw new Error('Serviço não encontrado ou já foi excluído.');
  }
};