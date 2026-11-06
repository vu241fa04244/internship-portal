const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'At least one required skill must be specified'],
      validate: {
        validator: function (skills) {
          return skills && skills.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    workType: {
      type: String,
      enum: {
        values: ['Remote', 'On-site', 'Hybrid'],
        message: '{VALUE} is not a valid work type',
      },
      default: 'Remote',
    },
    category: {
      type: String,
      enum: {
        values: [
          'Software Development',
          'Data Science',
          'UI/UX Design',
          'Product Management',
          'DevOps & Cloud',
          'Digital Marketing',
          'Finance',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Category is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required (e.g. 3 Months, 6 Months)'],
      trim: true,
    },
    stipend: {
      type: Number,
      required: [true, 'Stipend amount is required (enter 0 for unpaid)'],
      min: [0, 'Stipend cannot be negative'],
      default: 0,
    },
    stipendType: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Performance-based'],
      default: 'Paid',
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    vacancies: {
      type: Number,
      min: [1, 'At least 1 vacancy must be available'],
      default: 1,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance and search
internshipSchema.index({ status: 1, deadline: 1 });
internshipSchema.index({ category: 1 });
internshipSchema.index({ workType: 1 });
internshipSchema.index({ skillsRequired: 1 });
internshipSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
});

module.exports = mongoose.model('Internship', internshipSchema);
