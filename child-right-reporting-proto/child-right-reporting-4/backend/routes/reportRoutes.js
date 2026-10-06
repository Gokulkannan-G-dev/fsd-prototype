const router = require('express').Router();
const { authenticate, optionalAuth, authorize } = require('../controllers/authController');
const c = require('../controllers/reportController');

router.post('/', optionalAuth, c.createReport);              // anyone can report
router.get('/track/:trackingId', c.trackReport);             // anyone with a tracking ID
router.get('/mine', authenticate, c.myReports);              // logged-in reporter
router.get('/stats', authenticate, authorize('admin'), c.stats);
router.get('/', authenticate, authorize('reviewer', 'admin'), c.listReports);
router.patch('/:id', authenticate, authorize('reviewer', 'admin'), c.updateReport);

module.exports = router;
