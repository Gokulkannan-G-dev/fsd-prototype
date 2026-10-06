const router = require('express').Router();
const { authenticate, authorize } = require('../controllers/authController');
const c = require('../controllers/resourceController');

router.get('/', c.listResources);
router.post('/', authenticate, authorize('admin'), c.createResource);
router.delete('/:id', authenticate, authorize('admin'), c.deleteResource);

module.exports = router;
