const router = require('express').Router();
const c = require('../controllers/authController');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', c.authenticate, c.me);
router.get('/users', c.authenticate, c.authorize('admin'), c.listUsers);
router.patch('/users/:id/role', c.authenticate, c.authorize('admin'), c.updateUserRole);

module.exports = router;
