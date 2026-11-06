const express = require('express');
const router = express.Router();
const {
  applyInternship,
  getMyApplications,
  withdrawApplication,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

// Student endpoints
router.post('/', protect, authorize('student'), applyInternship);
router.get('/my', protect, authorize('student'), getMyApplications);
router.delete('/:id', validateObjectId('id'), protect, authorize('student'), withdrawApplication);

// Admin status update endpoint
router.patch(
  '/:id/status',
  validateObjectId('id'),
  protect,
  authorize('admin'),
  updateApplicationStatus
);

module.exports = router;
