const { getPool } = require('../config/db');

async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, name, email, password, date_inscription FROM users WHERE email = :email', { email });
  return rows[0] || null;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, name, email, date_inscription FROM users WHERE id = :id', { id });
  return rows[0] || null;
}

async function create({ name, email, passwordHash }) {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, date_inscription) VALUES (:name, :email, :password, CURDATE())',
    { name, email, password: passwordHash }
  );
  return { id: result.insertId, name, email };
}

async function updatePassword(userId, passwordHash) {
  const pool = getPool();
  await pool.query('UPDATE users SET password = :password WHERE id = :id', { password: passwordHash, id: userId });
}

module.exports = { findByEmail, findById, create, updatePassword };
