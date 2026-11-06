const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

// All notification routes are protected
router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', validateObjectId('id'), markAsRead);

module.exports = router;
