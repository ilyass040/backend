const { getPool } = require('../config/db');

async function findByEmail(email) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id, name, email, password, date_inscription FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id, name, email, date_inscription FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function create({ name, email, passwordHash }) {
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO users (name, email, password, date_inscription) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING id',
    [name, email, passwordHash]
  );
  return { id: result.rows[0].id, name, email };
}

async function updatePassword(userId, passwordHash) {
  const pool = getPool();
  await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [passwordHash, userId]
  );
}

module.exports = { findByEmail, findById, create, updatePassword };