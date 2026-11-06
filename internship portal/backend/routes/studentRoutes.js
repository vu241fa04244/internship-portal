const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume: uploadMiddleware } = require('../middleware/upload');

// All student routes are protected and restricted to student role
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', uploadMiddleware.single('resume'), uploadResume);

module.exports = router;
