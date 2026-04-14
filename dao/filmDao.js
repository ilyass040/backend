const { getPool } = require('../config/db');

async function listAll() {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id, title, genre, annee_sortie, imgpath, available_copies FROM films ORDER BY title'
  );
  return result.rows;
}

async function findById(id) {
  const pool = getPool();
  const result = await pool.query('SELECT * FROM films WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function search({ q = '' }) {
  const pool = getPool();
  const like = `%${q}%`;
  const result = await pool.query(
    `SELECT id, title, genre, annee_sortie, imgpath, available_copies
     FROM films
     WHERE title ILIKE $1 OR genre ILIKE $1 OR acteurs ILIKE $1 OR realisateurs ILIKE $1
     ORDER BY title`,
    [like]
  );
  return result.rows;
}

async function decrementCopies(filmId) {
  const pool = getPool();
  const result = await pool.query(
    'UPDATE films SET available_copies = available_copies - 1 WHERE id = $1 AND available_copies > 0',
    [filmId]
  );
  return result.rowCount === 1;
}

async function incrementCopies(filmId) {
  const pool = getPool();
  await pool.query('UPDATE films SET available_copies = available_copies + 1 WHERE id = $1', [filmId]);
}

module.exports = { listAll, findById, search, decrementCopies, incrementCopies };