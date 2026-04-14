const express = require('express');
const { body } = require('express-validator');
const { authRequired } = require('../middlewares/auth');
const { me, changePassword } = require('../controllers/profileController');

const router = express.Router();

router.use(authRequired);

router.get('/me', me);

router.post('/password',
  body('currentPassword').isLength({ min: 1 }).withMessage('Mot de passe actuel requis.'),
  body('newPassword').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage('Nouveau mot de passe faible (min 8, 1 maj, 1 min, 1 chiffre).'),
  changePassword
);

module.exports = router;
