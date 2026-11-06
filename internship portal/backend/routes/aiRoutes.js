const express = require('express');
const router = express.Router();
const {
  getSkillRecommendations,
  analyzeResume,
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume: uploadMiddleware } = require('../middleware/upload');

// Protected student AI routes
router.use(protect);
router.use(authorize('student'));

router.post('/recommendations', getSkillRecommendations);
router.post('/analyze-resume', uploadMiddleware.single('resume'), analyzeResume);

module.exports = router;
