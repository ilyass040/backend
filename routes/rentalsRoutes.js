const express = require('express');
const { authRequired } = require('../middlewares/auth');
const { rentFilm, myRentals, returnRental } = require('../controllers/rentalsController');

const router = express.Router();

router.use(authRequired);
router.post('/rent/:filmId', rentFilm);
router.get('/me', myRentals);
router.post('/return/:rentalId', returnRental);

module.exports = router;
