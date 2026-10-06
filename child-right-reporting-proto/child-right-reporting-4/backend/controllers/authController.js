const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, nextUserId } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
const sign = (u) => jwt.sign({ id: u.id, role: u.role }, JWT_SECRET, { expiresIn: '7d' });

// ---------- middleware ----------
const readToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

const authenticate = (req, res, next) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: 'Please log in to continue' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please log in again' });
  }
};

// Attaches req.user when a valid token is present, but never blocks.
const optionalAuth = (req, res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = users.find((u) => u.id === payload.id);
    } catch {
      /* ignore invalid token on optional routes */
    }
  }
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have access to this page' });
  }
  next();
};

// ---------- handlers ----------
const register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }
  const user = { id: nextUserId(), name: name.trim(), email: email.trim().toLowerCase(), passwordHash: bcrypt.hashSync(password, 8), role: 'user' };
  users.push(user);
  res.status(201).json({ token: sign(user), user: publicUser(user) });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
};

const me = (req, res) => res.json({ user: publicUser(req.user) });

const listUsers = (req, res) => res.json(users.map(publicUser));

const updateUserRole = (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { role } = req.body;
  if (!['user', 'reviewer', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot change your own role' });
  user.role = role;
  res.json(publicUser(user));
};

module.exports = { authenticate, optionalAuth, authorize, register, login, me, listUsers, updateUserRole };
