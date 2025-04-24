require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, sql } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar e usar as rotas
const usuarioRoutes = require('./routes/usuarios.routes');
const loginRoutes = require('./routes/login.routes');

app.use('/usuarios', usuarioRoutes);
app.use('/login', loginRoutes); // agora o endpoint será: POST /login

// Rota de teste de conexão
app.get('/', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query('SELECT GETDATE() AS data');
    res.json({ status: 'Conectado com sucesso!', data: result.recordset[0].data });
  } catch (error) {
    res.status(500).json({ erro: 'Erro na conexão', detalhe: error.message });
  }
});

const servicoRoutes = require('./routes/servicos.routes');
app.use('/servicos', servicoRoutes);
app.use('/uploads', express.static('uploads')); // rota para acessar as imagens

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
