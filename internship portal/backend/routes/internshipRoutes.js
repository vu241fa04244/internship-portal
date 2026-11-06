const express = require('express');
const router = express.Router();
const {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

// Public or optionalAuth routes
router.get('/', optionalAuth, getAllInternships);
router.get('/:id', validateObjectId('id'), optionalAuth, getInternshipById);

// Admin-only CRUD routes
router.post('/', protect, authorize('admin'), createInternship);
router.put('/:id', validateObjectId('id'), protect, authorize('admin'), updateInternship);
router.delete('/:id', validateObjectId('id'), protect, authorize('admin'), deleteInternship);

module.exports = router;
