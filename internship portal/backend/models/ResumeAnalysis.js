const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedTextSample: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      contactInfo: { type: Number, default: 0, max: 15 },
      education: { type: Number, default: 0, max: 15 },
      skillsScore: { type: Number, default: 0, max: 30 },
      experience: { type: Number, default: 0, max: 25 },
      formatting: { type: Number, default: 0, max: 15 },
    },
    identifiedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    atsCompatibility: {
      status: {
        type: String,
        enum: ['Excellent', 'Good', 'Needs Improvement'],
        default: 'Good',
      },
      issues: {
        type: [String],
        default: [],
      },
    },
    providerUsed: {
      type: String,
      default: 'rule-based-engine',
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
