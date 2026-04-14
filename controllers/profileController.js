const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserDAO = require('../dao/userDao');

async function me(req, res, next) {
  try {
    const user = await UserDAO.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({ user });
  } catch (e) { next(e); }
}

async function changePassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation échouée.', details: errors.array() });

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const userFull = await UserDAO.findByEmail(req.user.email);
    if (!userFull) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const ok = await bcrypt.compare(currentPassword, userFull.password);
    if (!ok) return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });

    const hash = await bcrypt.hash(newPassword, 10);
    await UserDAO.updatePassword(userId, hash);
    res.json({ message: 'Mot de passe mis à jour.' });
  } catch (e) { next(e); }
}

module.exports = { me, changePassword };
