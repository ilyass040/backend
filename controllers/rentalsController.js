const FilmDAO = require('../dao/filmDao');
const RentalDAO = require('../dao/rentalDao');

async function rentFilm(req, res, next) {
  try {
    const userId = req.user.id;
    const filmId = Number(req.params.filmId);

    // Rule 1: max 5 active rentals
    const activeCount = await RentalDAO.countActiveRentals(userId);
    if (activeCount >= 5) return res.status(400).json({ error: 'Limite atteinte: maximum 5 films en location.' });

    // Rule 2: cannot rent same film twice if not returned
    const already = await RentalDAO.hasActiveRentalForFilm(userId, filmId);
    if (already) return res.status(400).json({ error: 'Vous avez déjà ce film en location (non retourné).' });

    // Rule 3: available copies
    const film = await FilmDAO.findById(filmId);
    if (!film) return res.status(404).json({ error: 'Film introuvable.' });
    if (film.available_copies <= 0) return res.status(400).json({ error: 'Aucune copie disponible.' });

    // Update copies first (safe update) then create rental
    const decOk = await FilmDAO.decrementCopies(filmId);
    if (!decOk) return res.status(400).json({ error: 'Aucune copie disponible.' });

    const rentalId = await RentalDAO.createRental(userId, filmId);
    return res.status(201).json({ message: 'Location confirmée.', rental_id: rentalId });
  } catch (e) { next(e); }
}

async function myRentals(req, res, next) {
  try {
    const userId = req.user.id;
    const activeOnly = String(req.query.activeOnly || 'false') === 'true';
    const rentals = await RentalDAO.listMyRentals(userId, { activeOnly });
    res.json({ rentals });
  } catch (e) { next(e); }
}

async function returnRental(req, res, next) {
  try {
    const userId = req.user.id;
    const rentalId = Number(req.params.rentalId);

    const filmId = await RentalDAO.returnRental(userId, rentalId);
    if (!filmId) return res.status(400).json({ error: 'Location introuvable ou déjà retournée.' });

    await FilmDAO.incrementCopies(filmId);
    res.json({ message: 'Film retourné.' });
  } catch (e) { next(e); }
}

module.exports = { rentFilm, myRentals, returnRental };
