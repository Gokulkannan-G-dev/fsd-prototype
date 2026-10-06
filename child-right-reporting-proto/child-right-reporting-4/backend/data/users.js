const bcrypt = require('bcryptjs');

// In-memory user store. Resets on restart.
const users = [
  { id: 1, name: 'Admin', email: 'admin@example.com', passwordHash: bcrypt.hashSync('admin123', 8), role: 'admin' },
  { id: 2, name: 'Reviewer', email: 'reviewer@example.com', passwordHash: bcrypt.hashSync('reviewer123', 8), role: 'reviewer' },
  { id: 3, name: 'Demo User', email: 'user@example.com', passwordHash: bcrypt.hashSync('user123', 8), role: 'user' },
];

let nextId = 4;
const nextUserId = () => nextId++;

module.exports = { users, nextUserId };
