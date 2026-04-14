const { getPool } = require('../config/db');

async function countActiveRentals(userId) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS n FROM rentals WHERE user_id = :userId AND return_date IS NULL',
    { userId }
  );
  return rows[0]?.n || 0;
}

async function hasActiveRentalForFilm(userId, filmId) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT id FROM rentals WHERE user_id = :userId AND film_id = :filmId AND return_date IS NULL LIMIT 1',
    { userId, filmId }
  );
  return !!rows[0];
}

async function createRental(userId, filmId) {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO rentals (user_id, film_id, rental_date, return_date) VALUES (:userId, :filmId, NOW(), NULL)',
    { userId, filmId }
  );
  return result.insertId;
}

async function listMyRentals(userId, { activeOnly = false } = {}) {
  const pool = getPool();
  const where = activeOnly ? 'AND r.return_date IS NULL' : '';
  const [rows] = await pool.query(
    `SELECT r.id AS rental_id, r.rental_date, r.return_date,
            f.id AS film_id, f.title, f.genre, f.annee_sortie, f.imgPath
     FROM rentals r
     JOIN films f ON f.id = r.film_id
     WHERE r.user_id = :userId ${where}
     ORDER BY r.rental_date DESC`,
    { userId }
  );
  return rows;
}

async function returnRental(userId, rentalId) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT film_id FROM rentals WHERE id = :rentalId AND user_id = :userId AND return_date IS NULL',
    { rentalId, userId }
  );
  if (!rows[0]) return null;

  await pool.query(
    'UPDATE rentals SET return_date = NOW() WHERE id = :rentalId AND user_id = :userId AND return_date IS NULL',
    { rentalId, userId }
  );
  return rows[0].film_id;
}

module.exports = { countActiveRentals, hasActiveRentalForFilm, createRental, listMyRentals, returnRental };
