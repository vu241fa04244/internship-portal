const Application = require('../models/Application');
const Internship = require('../models/Internship');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

// @desc    Apply for an internship
// @route   POST /api/applications
// @access  Private (Student only)
const applyInternship = async (req, res, next) => {
  try {
    const { internshipId, coverNote } = req.body;

    if (!internshipId) {
      return res.status(400).json({
        success: false,
        message: 'Internship ID is required.',
      });
    }

    // Check internship existence
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship opportunity not found.',
      });
    }

    // Check if internship is active
    if (internship.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This internship is currently closed or in draft status and not accepting applications.',
      });
    }

    // Check application deadline
    if (new Date(internship.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The deadline for this internship has passed. Applications are no longer accepted.',
      });
    }

    // Fetch student profile to verify resume presence
    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile || !studentProfile.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your PDF resume to your profile before applying.',
      });
    }

    // Check if already applied (compound index also protects, but this returns friendly message early)
    const existingApplication = await Application.findOne({
      internship: internshipId,
      student: req.user._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this internship opportunity.',
      });
    }

    // Create Application
    const application = await Application.create({
      internship: internshipId,
      student: req.user._id,
      studentProfile: studentProfile._id,
      coverNote: coverNote ? coverNote.trim() : '',
      resumeSnapshot: {
        url: studentProfile.resumeUrl,
        originalName: studentProfile.resumeOriginalName || 'Resume.pdf',
      },
      status: 'Pending',
      appliedAt: new Date(),
    });

    // Increment applicants counter
    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { applicantsCount: 1 },
    });

    // Send confirmation notification to student
    await Notification.create({
      recipient: req.user._id,
      title: 'Application Submitted',
      message: `Your application for "${internship.title}" at ${internship.company} has been received successfully.`,
      type: 'application_received',
      link: '/applications',
      metadata: { applicationId: application._id, internshipId: internship._id },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in student
// @route   GET /api/applications/my
// @access  Private (Student only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('internship')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw an existing application
// @route   DELETE /api/applications/:id
// @access  Private (Student only)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Verify ownership
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to withdraw this application.',
      });
    }

    if (application.status === 'Accepted') {
      return res.status(400).json({
        success: false,
        message: 'Accepted applications cannot be withdrawn directly. Please contact support.',
      });
    }

    if (application.status === 'Withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'This application has already been withdrawn.',
      });
    }

    application.status = 'Withdrawn';
    await application.save();

    // Decrement applicants count on internship
    await Internship.findByIdAndUpdate(application.internship, {
      $inc: { applicantsCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Application has been withdrawn successfully.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Review by Admin)
// @route   PATCH /api/applications/:id/status
// @access  Private (Admin only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminFeedback } = req.body;

    const validStatuses = ['Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('internship', 'title company')
      .populate('student', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    application.status = status;
    application.reviewedAt = new Date();
    if (adminFeedback !== undefined) {
      application.adminFeedback = adminFeedback.trim();
    }

    await application.save();

    // Create notification for student
    const internshipTitle = application.internship ? application.internship.title : 'the position';
    const company = application.internship ? application.internship.company : 'the hiring team';

    let message = `Your application for "${internshipTitle}" at ${company} status has been updated to "${status}".`;
    if (adminFeedback) {
      message += ` Feedback: ${adminFeedback}`;
    }

    await Notification.create({
      recipient: application.student._id,
      title: `Application Status: ${status}`,
      message,
      type: 'application_status',
      link: '/applications',
      metadata: { applicationId: application._id, status },
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}' successfully.`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyInternship,
  getMyApplications,
  withdrawApplication,
  updateApplicationStatus,
};
