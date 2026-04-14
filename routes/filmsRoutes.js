const express = require('express');
const { list, getOne, search } = require('../controllers/filmsController');

const router = express.Router();

router.get('/', list);
router.get('/search', search);
router.get('/:id', getOne);

module.exports = router;
