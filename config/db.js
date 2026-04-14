const { Pool } = require('pg');

let pool;

async function initPool() {
  if (pool) return pool;

  // Pour Render (DATABASE_URL) ou pour le développement local
  const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'location_films'}`;

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Pour les requêtes nommées style :userId (optionnel, mais garde la compatibilité)
    allowExitOnIdle: true,
  });

  // Test connection (fail fast)
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  
  console.log('✅ PostgreSQL connected successfully');
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("DB pool not initialized. Call initPool() in server startup.");
  }
  return pool;
}

module.exports = { initPool, getPool };