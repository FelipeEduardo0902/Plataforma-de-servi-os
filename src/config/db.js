const mysql = require('mysql2/promise');
require('dotenv').config();

const connectToDatabase = async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'plataforma_servicos',
      port: parseInt(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    return pool;
  } catch (err) {
    console.error('Erro ao conectar no MySQL:', err);
    throw err;
  }
};

module.exports = { connectToDatabase };
