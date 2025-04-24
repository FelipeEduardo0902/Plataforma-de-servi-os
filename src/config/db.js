const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Erro ao conectar no SQL Server:', err);
    throw err;
  }
}

module.exports = { connectToDatabase, sql };
