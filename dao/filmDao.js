const { getPool } = require('../config/db');

async function listAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, title, genre, annee_sortie, imgPath, available_copies FROM films ORDER BY title');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM films WHERE id = :id', { id });
  return rows[0] || null;
}

async function search({ q = '' }) {
  const pool = getPool();
  const like = `%${q}%`;
  const [rows] = await pool.query(
    `SELECT id, title, genre, annee_sortie, imgPath, available_copies
     FROM films
     WHERE title LIKE :like OR genre LIKE :like OR acteurs LIKE :like OR realisateurs LIKE :like
     ORDER BY title`,
    { like }
  );
  return rows;
}

async function decrementCopies(filmId) {
  const pool = getPool();
  // Prevent negative
  const [result] = await pool.query(
    'UPDATE films SET available_copies = available_copies - 1 WHERE id = :id AND available_copies > 0',
    { id: filmId }
  );
  return result.affectedRows === 1;
}

async function incrementCopies(filmId) {
  const pool = getPool();
  await pool.query('UPDATE films SET available_copies = available_copies + 1 WHERE id = :id', { id: filmId });
}

module.exports = { listAll, findById, search, decrementCopies, incrementCopies };
