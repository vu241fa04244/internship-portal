const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { calculateSkillMatch, rankInternshipsForStudent } = require('../utils/skillMatcher');
const { analyzeResumeRuleBased } = require('../utils/aiService');

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/skillbridge_test';

describe('SkillBridge Backend Automated Test Suite', () => {
  let studentToken = '';
  let adminToken = '';
  let studentUserId = '';
  let testInternshipId = '';
  let testApplicationId = '';

  before(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'skillbridge_test_jwt_secret_12345';
    await connectDB(TEST_DB_URI);

    // Clean test database
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Internship.deleteMany({}),
      Application.deleteMany({}),
      Notification.deleteMany({}),
    ]);
  });

  after(async () => {
    // Clean test database and disconnect
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Internship.deleteMany({}),
      Application.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    await disconnectDB();
  });

  // 1. UNIT TESTS: Skill Matcher Algorithm
  describe('Skill Matcher Deterministic Logic', () => {
    it('should correctly normalize and match skills with aliases and whitespace', () => {
      const studentSkills = ['React.js', '  NODEJS  ', 'JavaScript', 'Docker'];
      const requiredSkills = ['react', 'node.js', 'PostgreSQL'];

      const result = calculateSkillMatch(studentSkills, requiredSkills);

      assert.strictEqual(result.totalRequired, 3);
      assert.strictEqual(result.matchedSkills.length, 2);
      assert.strictEqual(result.missingSkills.length, 1);
      assert.strictEqual(result.missingSkills[0], 'PostgreSQL');
      // 2 / 3 = 67%
      assert.strictEqual(result.matchPercentage, 67);
      assert.ok(result.disclaimer.includes('Skill-based recommendation'));
    });

    it('should rank internships descending by match percentage', () => {
      const studentSkills = ['Python', 'SQL', 'Pandas'];
      const internships = [
        { title: 'Web Intern', skillsRequired: ['React', 'Node.js'] },
        { title: 'Data Intern', skillsRequired: ['Python', 'SQL', 'Pandas'] },
        { title: 'Fullstack Intern', skillsRequired: ['Python', 'React'] },
      ];

      const ranked = rankInternshipsForStudent(internships, studentSkills);
      assert.strictEqual(ranked[0].title, 'Data Intern');
      assert.strictEqual(ranked[0].matchMetrics.matchPercentage, 100);
      assert.strictEqual(ranked[1].title, 'Fullstack Intern');
      assert.strictEqual(ranked[1].matchMetrics.matchPercentage, 50);
      assert.strictEqual(ranked[2].title, 'Web Intern');
      assert.strictEqual(ranked[2].matchMetrics.matchPercentage, 0);
    });
  });

  // 2. UNIT TESTS: Rule-Based Resume Analyzer
  describe('Resume Analyzer Engine', () => {
    it('should parse contact info, technical skills, and generate breakdown scores', () => {
      const sampleResume = `
        Jane Doe
        Email: jane.doe@example.com
        Phone: +1 (555) 432-1098
        LinkedIn: linkedin.com/in/janedoe
        GitHub: github.com/janedoe

        EDUCATION
        Bachelor of Science in Computer Science, Tech University, 2025. GPA: 3.8

        SKILLS
        JavaScript, React, Node.js, Express, MongoDB, Git, Docker, Python, SQL

        EXPERIENCE
        Software Engineering Intern - Built scalable REST APIs, developed responsive React components, improved latency by 25%.
      `;

      const analysis = analyzeResumeRuleBased(sampleResume);

      assert.ok(analysis.score >= 50, `Expected score >= 50, got ${analysis.score}`);
      assert.ok(analysis.identifiedSkills.length >= 5);
      assert.ok(
        ['Excellent', 'Good'].includes(analysis.atsCompatibility.status),
        `Status was ${analysis.atsCompatibility.status}`
      );
      assert.ok(analysis.scoreBreakdown.contactInfo > 0);
      assert.ok(analysis.scoreBreakdown.education > 0);
      assert.ok(analysis.scoreBreakdown.skillsScore > 0);
      assert.ok(analysis.scoreBreakdown.experience > 0);
      assert.ok(analysis.scoreBreakdown.formatting > 0);
    });
  });

  // 3. API TESTS: Authentication & Registration
  describe('Authentication & User Management APIs', () => {
    it('should register a new student user and generate JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sarah Connor',
          email: 'sarah.connor@student.edu',
          password: 'Password@123',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.role, 'student');
      studentToken = res.body.token;
      studentUserId = res.body.user._id;

      // Verify StudentProfile was created automatically
      const profile = await StudentProfile.findOne({ user: studentUserId });
      assert.ok(profile, 'Student profile should be created automatically upon registration');
    });

    it('should reject registration if email is duplicate', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sarah Duplicate',
          email: 'sarah.connor@student.edu',
          password: 'Password@123',
        });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
    });

    it('should reject registration with invalid email or short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bad Input',
          email: 'invalid-email-format',
          password: '123',
        });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('should log in student with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'sarah.connor@student.edu',
          password: 'Password@123',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.token);
      studentToken = res.body.token;
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'sarah.connor@student.edu',
          password: 'WrongPassword!',
        });

      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
    });

    it('should return current user info via GET /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.email, 'sarah.connor@student.edu');
    });
  });

  // 4. API TESTS: Authorization & Role Protections
  describe('Role-Based Authorization Protections', () => {
    before(async () => {
      // Create admin user directly in DB
      const admin = await User.create({
        name: 'Super Admin',
        email: 'admin.test@skillbridge.dev',
        password: 'AdminPassword@123',
        role: 'admin',
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin.test@skillbridge.dev',
          password: 'AdminPassword@123',
        });

      adminToken = loginRes.body.token;
    });

    it('should forbid student from creating an internship (403)', async () => {
      const res = await request(app)
        .post('/api/internships')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Unauthorized Internship',
          company: 'Acme Corp',
          description: 'Testing authorization boundaries',
          skillsRequired: ['React'],
          location: 'Remote',
          category: 'Software Development',
          duration: '3 Months',
          stipend: 1000,
          deadline: new Date(Date.now() + 1000000),
        });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
    });

    it('should allow admin to create an internship (201)', async () => {
      const res = await request(app)
        .post('/api/internships')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Software Engineer Intern',
          company: 'Starlight Dynamics',
          description: 'Hands on coding in React, Node, and MongoDB',
          skillsRequired: ['React', 'Node.js', 'MongoDB'],
          location: 'San Francisco, CA',
          workType: 'Remote',
          category: 'Software Development',
          duration: '3 Months',
          stipend: 2000,
          stipendType: 'Paid',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          vacancies: 2,
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.internship._id);
      testInternshipId = res.body.internship._id;
    });

    it('should allow admin to update an internship', async () => {
      const res = await request(app)
        .put(`/api/internships/${testInternshipId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          stipend: 2500,
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.internship.stipend, 2500);
    });
  });

  // 5. API TESTS: Student Profile & Resume Setup
  describe('Student Profile & Application Flow', () => {
    it('should update student profile with skills and resume data', async () => {
      const res = await request(app)
        .put('/api/students/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          university: 'Cyberdyne Systems Tech Institute',
          graduationYear: 2026,
          major: 'Software Engineering',
          skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.profile.skills.length, 4);

      // Manually set resumeUrl for testing application submission
      await StudentProfile.findOneAndUpdate(
        { user: studentUserId },
        { resumeUrl: '/uploads/test-resume.pdf', resumeOriginalName: 'Sarah_Resume.pdf' }
      );
    });

    it('should allow student to submit an application', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          internshipId: testInternshipId,
          coverNote: 'Excited to apply for this engineering role!',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.application.status, 'Pending');
      testApplicationId = res.body.application._id;

      // Check notification created
      const notification = await Notification.findOne({ recipient: studentUserId });
      assert.ok(notification, 'Notification should be created for student upon submission');
    });

    it('should PREVENT duplicate application to the same internship (409)', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          internshipId: testInternshipId,
          coverNote: 'Attempting duplicate application',
        });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('already'));
    });

    it('should fetch student applications list via GET /api/applications/my', async () => {
      const res = await request(app)
        .get('/api/applications/my')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.count, 1);
      assert.strictEqual(res.body.applications[0]._id, testApplicationId.toString());
    });
  });

  // 6. API TESTS: Admin Application Status Updates
  describe('Admin Application Review Flow', () => {
    it('should allow admin to update application status to Shortlisted and notify student', async () => {
      const res = await request(app)
        .patch(`/api/applications/${testApplicationId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Shortlisted',
          adminFeedback: 'Excellent skills match with our backend requirements.',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.application.status, 'Shortlisted');

      // Verify notification created for student
      const notification = await Notification.findOne({
        recipient: studentUserId,
        type: 'application_status',
      });
      assert.ok(notification);
      assert.ok(notification.message.includes('Shortlisted'));
    });

    it('should fetch admin dashboard statistics with accurate counts', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.stats.totalStudents, 1);
      assert.strictEqual(res.body.stats.totalInternships, 1);
      assert.strictEqual(res.body.stats.totalApplications, 1);
      assert.strictEqual(res.body.stats.statusBreakdown.Shortlisted, 1);
    });
  });

  // 7. API TESTS: AI Recommendations Endpoint
  describe('AI Recommendations API', () => {
    it('should return skill-based internship recommendations with transparent score', async () => {
      const res = await request(app)
        .post('/api/ai/recommendations')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({});

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.recommendations.length > 0);
      assert.strictEqual(res.body.recommendations[0].matchMetrics.matchPercentage, 100);
      assert.ok(res.body.disclaimer.includes('Skill-based recommendation'));
    });
  });

  // 8. API TESTS: Health Check
  describe('System Health Check API', () => {
    it('should return healthy status and database connection state', async () => {
      const res = await request(app).get('/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'healthy');
      assert.strictEqual(res.body.database, 'connected');
    });
  });
});
