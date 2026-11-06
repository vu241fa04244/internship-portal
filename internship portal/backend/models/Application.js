const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship reference is required'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student user reference is required'],
      index: true,
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Pending',
      index: true,
    },
    coverNote: {
      type: String,
      maxlength: [1500, 'Cover note cannot exceed 1500 characters'],
      default: '',
    },
    resumeSnapshot: {
      url: { type: String, default: '' },
      originalName: { type: String, default: '' },
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    adminFeedback: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: prevents a student from applying to the same internship more than once
applicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
