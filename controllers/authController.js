const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserDAO = require('../dao/userDao');

function issueToken(user) {
  const payload = { email: user.email, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation échouée.', details: errors.array() });

    const { name, email, password } = req.body;

    const existing = await UserDAO.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await UserDAO.create({ name, email, passwordHash });

    const token = issueToken({ ...created, id: created.id });
    return res.status(201).json({ message: 'Compte créé.', token, user: created });
  } catch (e) { return next(e); }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation échouée.', details: errors.array() });

    const { email, password } = req.body;

    const user = await UserDAO.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Identifiants incorrects.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Identifiants incorrects.' });

    const token = issueToken(user);
    return res.json({ message: 'Connexion réussie.', token, user: { id: user.id, name: user.name, email: user.email, date_inscription: user.date_inscription } });
  } catch (e) { return next(e); }
}

module.exports = { register, login };
