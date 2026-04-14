const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register',
  body('name').trim().isLength({ min: 2 }).withMessage('Nom trop court.'),
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage('Mot de passe faible (min 8, 1 maj, 1 min, 1 chiffre).'),
  register
);

router.post('/login',
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 1 }).withMessage('Mot de passe requis.'),
  login
);

module.exports = router;
