const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

// Generate JWT token helper
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'skillbridge_default_jwt_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public (Students only)
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Public self-registration is strictly restricted to student role
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'student',
    });

    // Create corresponding empty student profile
    const profile = await StudentProfile.create({
      user: user._id,
      skills: [],
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileId: profile._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user (must explicitly select password since select: false on schema)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    // If student, fetch profile ID
    let profileId = null;
    if (user.role === 'student') {
      let profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await StudentProfile.create({ user: user._id, skills: [] });
      }
      profileId = profile._id;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await StudentProfile.create({ user: user._id, skills: [] });
      }
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
