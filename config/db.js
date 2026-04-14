const { Pool } = require('pg');

let pool;

async function initPool() {
  if (pool) return pool;

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  
  console.log('✅ PostgreSQL connected');
  return pool;
}

function getPool() {
  if (!pool) throw new Error("Pool not initialized");
  return pool;
}

module.exports = { initPool, getPool };