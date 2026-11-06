const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// @desc    Get system-wide overview statistics for admin
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalInternships,
      activeInternships,
      totalApplications,
      totalAnalyses,
      statusBreakdownRaw,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Internship.countDocuments(),
      Internship.countDocuments({ status: 'Active' }),
      Application.countDocuments(),
      ResumeAnalysis.countDocuments(),
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Application.find()
        .sort({ appliedAt: -1 })
        .limit(5)
        .populate('student', 'name email')
        .populate('internship', 'title company location'),
    ]);

    // Format breakdown object
    const statusBreakdown = {
      Pending: 0,
      Shortlisted: 0,
      Accepted: 0,
      Rejected: 0,
      Withdrawn: 0,
    };

    statusBreakdownRaw.forEach((item) => {
      if (item._id && statusBreakdown[item._id] !== undefined) {
        statusBreakdown[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalInternships,
        activeInternships,
        totalApplications,
        totalAnalyses,
        statusBreakdown,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with profiles
// @route   GET /api/admin/students
// @access  Private (Admin only)
const getAllStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const query = { role: 'student' };

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Fetch corresponding profiles for these users
    const userIds = users.map((u) => u._id);
    const profiles = await StudentProfile.find({ user: { $in: userIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const students = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      profile: profileMap.get(user._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across platform
// @route   GET /api/admin/applications
// @access  Private (Admin only)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, internshipId, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (internshipId) {
      query.internship = internshipId;
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('internship')
      .populate('student', 'name email')
      .populate('studentProfile');

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllStudents,
  getAllApplications,
};
