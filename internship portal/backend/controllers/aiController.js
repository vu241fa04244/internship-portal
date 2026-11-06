const Internship = require('../models/Internship');
const StudentProfile = require('../models/StudentProfile');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { calculateSkillMatch, rankInternshipsForStudent } = require('../utils/skillMatcher');
const { extractTextFromPDF, deleteFileSafe } = require('../utils/pdfParser');
const { analyzeResumeText } = require('../utils/aiService');

// @desc    Get skill-based internship recommendations
// @route   POST /api/ai/recommendations
// @access  Private (Student)
const getSkillRecommendations = async (req, res, next) => {
  try {
    let studentSkills = [];

    // Use skills from request body if provided, otherwise fetch student profile
    if (req.body.skills && Array.isArray(req.body.skills)) {
      studentSkills = req.body.skills;
    } else {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile && Array.isArray(profile.skills)) {
        studentSkills = profile.skills;
      }
    }

    if (studentSkills.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No skills found in student profile. Please add skills to get personalized recommendations.',
        studentSkills: [],
        recommendations: [],
      });
    }

    // Fetch active internships with unexpired deadlines
    const now = new Date();
    const internships = await Internship.find({
      status: 'Active',
      deadline: { $gte: now },
    });

    // Deterministically rank internships based on skill match
    const rankedRecommendations = rankInternshipsForStudent(internships, studentSkills);

    res.status(200).json({
      success: true,
      studentSkills,
      count: rankedRecommendations.length,
      recommendations: rankedRecommendations,
      disclaimer: 'Skill-based recommendation only. Does not guarantee selection or interview.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze PDF resume with AI engine and rule-based fallback
// @route   POST /api/ai/analyze-resume
// @access  Private (Student)
const analyzeResume = async (req, res, next) => {
  let tempFilePath = null;
  try {
    let resumeText = '';
    let fileName = 'Uploaded-Resume.pdf';
    let fileSize = 0;

    // Case 1: PDF File uploaded directly in request
    if (req.file) {
      tempFilePath = req.file.path;
      fileName = req.file.originalname;
      fileSize = req.file.size;
      resumeText = await extractTextFromPDF(tempFilePath);
    }
    // Case 2: Analyze already uploaded resume from student profile
    else {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile && profile.resumeExtractedText) {
        resumeText = profile.resumeExtractedText;
        fileName = profile.resumeOriginalName || 'Profile-Resume.pdf';
      } else if (req.body.text && typeof req.body.text === 'string') {
        resumeText = req.body.text;
        fileName = 'Pasted-Resume-Text';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF resume or provide resume text to analyze.',
        });
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from the PDF. Please ensure the PDF contains selectable text (not a scanned image) and try again.',
      });
    }

    // Run AI / Rule-based hybrid analysis
    const analysis = await analyzeResumeText(resumeText);

    // Save analysis record in database
    const savedRecord = await ResumeAnalysis.create({
      student: req.user._id,
      fileName,
      fileSize,
      extractedTextSample: resumeText.slice(0, 500),
      score: analysis.score,
      scoreBreakdown: analysis.scoreBreakdown,
      identifiedSkills: analysis.identifiedSkills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      strengths: analysis.strengths,
      atsCompatibility: analysis.atsCompatibility,
      providerUsed: analysis.providerUsed,
      analyzedAt: new Date(),
    });

    // Optionally update StudentProfile with identified skills if user doesn't have any
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile && (!profile.skills || profile.skills.length === 0) && analysis.identifiedSkills.length > 0) {
      profile.skills = analysis.identifiedSkills.slice(0, 15);
      await profile.save();
    }

    // If an ephemeral upload was used (e.g. in tempDir), delete it
    if (tempFilePath && tempFilePath.includes('temp')) {
      deleteFileSafe(tempFilePath);
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysisId: savedRecord._id,
      analysis: {
        score: savedRecord.score,
        scoreBreakdown: savedRecord.scoreBreakdown,
        identifiedSkills: savedRecord.identifiedSkills,
        missingSkills: savedRecord.missingSkills,
        suggestions: savedRecord.suggestions,
        strengths: savedRecord.strengths,
        atsCompatibility: savedRecord.atsCompatibility,
        providerUsed: savedRecord.providerUsed,
        analyzedAt: savedRecord.analyzedAt,
        fileName: savedRecord.fileName,
        disclaimer: analysis.disclaimer,
      },
    });
  } catch (error) {
    if (tempFilePath && tempFilePath.includes('temp')) {
      deleteFileSafe(tempFilePath);
    }
    next(error);
  }
};

module.exports = {
  getSkillRecommendations,
  analyzeResume,
};
