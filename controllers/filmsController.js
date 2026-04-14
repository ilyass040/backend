const FilmDAO = require('../dao/filmDao');

async function list(req, res, next) {
  try {
    const films = await FilmDAO.listAll();
    res.json({ films });
  } catch (e) { next(e); }
}

async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const film = await FilmDAO.findById(id);
    if (!film) return res.status(404).json({ error: 'Film introuvable.' });
    res.json({ film });
  } catch (e) { next(e); }
}

async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    const films = await FilmDAO.search({ q });
    res.json({ films });
  } catch (e) { next(e); }
}

module.exports = { list, getOne, search };
