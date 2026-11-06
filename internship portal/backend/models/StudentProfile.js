const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    educationLevel: {
      type: String,
      trim: true,
      default: 'Bachelor',
    },
    graduationYear: {
      type: Number,
      min: 1990,
      max: 2040,
      default: new Date().getFullYear() + 1,
    },
    major: {
      type: String,
      trim: true,
      default: '',
    },
    gpa: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    resumeUploadedAt: {
      type: Date,
      default: null,
    },
    resumeExtractedText: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    portfolio: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
studentProfileSchema.index({ skills: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
