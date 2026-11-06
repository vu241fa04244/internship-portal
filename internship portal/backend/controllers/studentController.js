const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const { extractTextFromPDF } = require('../utils/pdfParser');
const path = require('path');

// @desc    Get current student's profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email role createdAt'
    );

    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user._id,
        skills: [],
      });
      profile = await profile.populate('user', 'name email role createdAt');
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      university,
      educationLevel,
      graduationYear,
      major,
      gpa,
      bio,
      skills,
      location,
      github,
      linkedin,
      portfolio,
    } = req.body;

    // Update User name if provided
    if (name && typeof name === 'string' && name.trim()) {
      await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
    }

    // Process skills array
    let processedSkills = [];
    if (Array.isArray(skills)) {
      processedSkills = skills
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean);
    } else if (typeof skills === 'string') {
      processedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Upsert student profile
    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        phone: phone || '',
        university: university || '',
        educationLevel: educationLevel || 'Bachelor',
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        major: major || '',
        gpa: gpa || '',
        bio: bio || '',
        skills: processedSkills,
        location: location || '',
        github: github || '',
        linkedin: linkedin || '',
        portfolio: portfolio || '',
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email role createdAt');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload student PDF resume
// @route   POST /api/students/resume
// @access  Private (Student)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a PDF resume file to upload.',
      });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    const absolutePath = req.file.path;

    // Extract text from the uploaded PDF resume
    let extractedText = '';
    try {
      extractedText = await extractTextFromPDF(absolutePath);
    } catch (parseErr) {
      console.warn(`[Resume Extraction Warning]: Could not extract text (${parseErr.message})`);
    }

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        resumeUrl: relativeUrl,
        resumeOriginalName: req.file.originalname,
        resumeUploadedAt: new Date(),
        resumeExtractedText: extractedText,
      },
      { new: true, upsert: true }
    ).populate('user', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and processed successfully.',
      resume: {
        url: relativeUrl,
        originalName: req.file.originalname,
        uploadedAt: updatedProfile.resumeUploadedAt,
        extractedTextSample: extractedText.slice(0, 300),
      },
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
};
