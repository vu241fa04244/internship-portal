const Internship = require('../models/Internship');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// @desc    Get all internships with filtering, search, and pagination
// @route   GET /api/internships
// @access  Public / Authenticated
const getAllInternships = async (req, res, next) => {
  try {
    const {
      search,
      category,
      workType,
      location,
      minStipend,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Filter by status: Students and unauthenticated users only see Active internships
    if (req.user && req.user.role === 'admin' && status) {
      if (status !== 'All') {
        query.status = status;
      }
    } else {
      query.status = 'Active';
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Work type filter
    if (workType && workType !== 'All') {
      query.workType = workType;
    }

    // Minimum stipend filter
    if (minStipend && !isNaN(Number(minStipend))) {
      query.stipend = { $gte: Number(minStipend) };
    }

    // Location filter (case-insensitive substring)
    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Text Search in title, company, description, or skills
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { skillsRequired: searchRegex },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const total = await Internship.countDocuments(query);
    const internships = await Internship.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    // If student is logged in, attach skill match score
    let studentSkills = [];
    if (req.user && req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile && Array.isArray(profile.skills)) {
        studentSkills = profile.skills;
      }
    }

    const enhancedInternships = internships.map((item) => {
      const plain = item.toObject();
      if (studentSkills.length > 0) {
        plain.skillMatch = calculateSkillMatch(studentSkills, item.skillsRequired);
      }
      return plain;
    });

    res.status(200).json({
      success: true,
      count: enhancedInternships.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      internships: enhancedInternships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public / Authenticated
const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found.',
      });
    }

    const result = internship.toObject();

    // If authenticated, check if current user already applied
    if (req.user && req.user.role === 'student') {
      const existingApp = await Application.findOne({
        internship: internship._id,
        student: req.user._id,
      });

      result.hasApplied = !!existingApp;
      result.applicationStatus = existingApp ? existingApp.status : null;

      // Compute skill match
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        result.skillMatch = calculateSkillMatch(profile.skills || [], internship.skillsRequired);
      }
    }

    res.status(200).json({
      success: true,
      internship: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private (Admin only)
const createInternship = async (req, res, next) => {
  try {
    const {
      title,
      company,
      logo,
      description,
      requirements,
      responsibilities,
      skillsRequired,
      location,
      workType,
      category,
      duration,
      stipend,
      stipendType,
      currency,
      deadline,
      vacancies,
      status,
    } = req.body;

    // Validate required skills array
    let processedSkills = [];
    if (Array.isArray(skillsRequired)) {
      processedSkills = skillsRequired.map((s) => s.trim()).filter(Boolean);
    } else if (typeof skillsRequired === 'string') {
      processedSkills = skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (processedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill for the internship.',
      });
    }

    // Process requirements and responsibilities
    const procRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      : [];

    const procResponsibilities = Array.isArray(responsibilities)
      ? responsibilities
      : typeof responsibilities === 'string'
      ? responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
      : [];

    const newInternship = await Internship.create({
      title: title.trim(),
      company: company.trim(),
      logo: logo || '',
      description: description.trim(),
      requirements: procRequirements,
      responsibilities: procResponsibilities,
      skillsRequired: processedSkills,
      location: location.trim(),
      workType: workType || 'Remote',
      category: category || 'Software Development',
      duration: duration || '3 Months',
      stipend: stipend !== undefined ? Number(stipend) : 0,
      stipendType: stipendType || 'Paid',
      currency: currency || 'USD',
      deadline: new Date(deadline),
      vacancies: vacancies ? Number(vacancies) : 1,
      status: status || 'Active',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Internship opportunity created successfully.',
      internship: newInternship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship details
// @route   PUT /api/internships/:id
// @access  Private (Admin only)
const updateInternship = async (req, res, next) => {
  try {
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship opportunity not found.',
      });
    }

    const {
      title,
      company,
      logo,
      description,
      requirements,
      responsibilities,
      skillsRequired,
      location,
      workType,
      category,
      duration,
      stipend,
      stipendType,
      currency,
      deadline,
      vacancies,
      status,
    } = req.body;

    const updates = {};
    if (title) updates.title = title.trim();
    if (company) updates.company = company.trim();
    if (logo !== undefined) updates.logo = logo;
    if (description) updates.description = description.trim();
    if (location) updates.location = location.trim();
    if (workType) updates.workType = workType;
    if (category) updates.category = category;
    if (duration) updates.duration = duration.trim();
    if (stipend !== undefined) updates.stipend = Number(stipend);
    if (stipendType) updates.stipendType = stipendType;
    if (currency) updates.currency = currency;
    if (deadline) updates.deadline = new Date(deadline);
    if (vacancies !== undefined) updates.vacancies = Number(vacancies);
    if (status) updates.status = status;

    if (skillsRequired) {
      updates.skillsRequired = Array.isArray(skillsRequired)
        ? skillsRequired.map((s) => s.trim()).filter(Boolean)
        : skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (requirements !== undefined) {
      updates.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split('\n').map((r) => r.trim()).filter(Boolean);
    }

    if (responsibilities !== undefined) {
      updates.responsibilities = Array.isArray(responsibilities)
        ? responsibilities
        : responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully.',
      internship: updatedInternship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Admin only)
const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found.',
      });
    }

    await Internship.findByIdAndDelete(req.params.id);

    // Clean up applications for this internship
    await Application.deleteMany({ internship: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Internship and associated applications deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
};
