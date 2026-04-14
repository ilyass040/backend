const mysql = require('mysql2/promise');

let pool;

async function initPool() {
  if (pool) return pool;

  const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'location_films',
  } = process.env;

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  });

  // Test connection (fail fast)
  await pool.query('SELECT 1');
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("DB pool not initialized. Call initPool() in server startup.");
  }
  return pool;
}

module.exports = { initPool, getPool };
