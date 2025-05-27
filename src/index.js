require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Garante que a pasta de uploads existe e define o caminho
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// CORS e JSON
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadDir));

// Rotas
const usuarioRoutes = require('./routes/usuarios.routes');
const loginRoutes = require('./routes/login.routes');
const servicoRoutes = require('./routes/servicos.routes');
const categoriaRoutes = require('./routes/categorias.routes');

// Usar as rotas
app.use('/usuarios', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/servicos', servicoRoutes);
app.use('/categorias', categoriaRoutes);

// Rota de teste
app.get('/', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query('SELECT GETDATE() AS data');
    res.json({ status: 'Conectado com sucesso!', data: result.recordset[0].data });
  } catch (error) {
    res.status(500).json({ erro: 'Erro na conexão', detalhe: error.message });
  }
});

// 404 handler (sempre por último)
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error("Erro global:", err);
  res.status(500).json({ erro: "Erro interno do servidor.", detalhe: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
