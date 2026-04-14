const { getPool } = require('../config/db');

async function countActiveRentals(userId) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT COUNT(*) AS n FROM rentals WHERE user_id = $1 AND return_date IS NULL',
    [userId]
  );
  return parseInt(result.rows[0]?.n) || 0;
}

async function hasActiveRentalForFilm(userId, filmId) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id FROM rentals WHERE user_id = $1 AND film_id = $2 AND return_date IS NULL LIMIT 1',
    [userId, filmId]
  );
  return result.rows.length > 0;
}

async function createRental(userId, filmId) {
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO rentals (user_id, film_id, rental_date, return_date) VALUES ($1, $2, NOW(), NULL) RETURNING id',
    [userId, filmId]
  );
  return result.rows[0].id;
}

async function listMyRentals(userId, { activeOnly = false } = {}) {
  const pool = getPool();
  let query = `
    SELECT r.id AS rental_id, r.rental_date, r.return_date,
           f.id AS film_id, f.title, f.genre, f.annee_sortie, f.imgpath
    FROM rentals r
    JOIN films f ON f.id = r.film_id
    WHERE r.user_id = $1
  `;
  
  if (activeOnly) {
    query += ' AND r.return_date IS NULL';
  }
  
  query += ' ORDER BY r.rental_date DESC';
  
  const result = await pool.query(query, [userId]);
  return result.rows;
}

async function returnRental(userId, rentalId) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT film_id FROM rentals WHERE id = $1 AND user_id = $2 AND return_date IS NULL',
    [rentalId, userId]
  );
  
  if (result.rows.length === 0) return null;

  await pool.query(
    'UPDATE rentals SET return_date = NOW() WHERE id = $1 AND user_id = $2 AND return_date IS NULL',
    [rentalId, userId]
  );
  
  return result.rows[0].film_id;
}

module.exports = { countActiveRentals, hasActiveRentalForFilm, createRental, listMyRentals, returnRental };