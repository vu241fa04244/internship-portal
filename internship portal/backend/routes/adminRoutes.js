const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStudents,
  getAllApplications,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/applications', getAllApplications);

module.exports = router;
