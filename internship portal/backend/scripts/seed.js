const dotenv = require('dotenv');
const path = require('path');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const ResumeAnalysis = require('../models/ResumeAnalysis');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seeder] Clearing old demo collections...');
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Internship.deleteMany({}),
      Application.deleteMany({}),
      Notification.deleteMany({}),
      ResumeAnalysis.deleteMany({}),
    ]);

    console.log('[Seeder] Creating admin and student users...');

    // 1. Create Admin
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@skillbridge.dev',
      password: adminPassword,
      role: 'admin',
    });

    // 2. Create Student 1 (Full Stack Focus)
    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@student.edu',
      password: 'Student@123456',
      role: 'student',
    });

    const studentProfile1 = await StudentProfile.create({
      user: student1._id,
      phone: '+1 (555) 234-5678',
      university: 'Tech State University',
      educationLevel: 'Bachelor',
      graduationYear: 2026,
      major: 'Computer Science',
      gpa: '3.85',
      bio: 'Junior CS major passionate about modern web engineering, distributed systems, and building accessible user interfaces.',
      skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'Express', 'Git', 'TailwindCSS'],
      location: 'San Francisco, CA',
      github: 'https://github.com/alexrivera-dev',
      linkedin: 'https://linkedin.com/in/alexrivera-tech',
      portfolio: 'https://alexrivera.dev',
      resumeUrl: '',
      resumeOriginalName: '',
    });

    // 3. Create Student 2 (Data Science Focus)
    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@student.edu',
      password: 'Student@123456',
      role: 'student',
    });

    const studentProfile2 = await StudentProfile.create({
      user: student2._id,
      phone: '+1 (555) 987-6543',
      university: 'National Science Institute',
      educationLevel: 'Master',
      graduationYear: 2025,
      major: 'Data Science & Analytics',
      gpa: '3.92',
      bio: 'Graduate student exploring machine learning pipelines, predictive modeling, NLP, and scalable data warehousing.',
      skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'TensorFlow', 'PostgreSQL', 'Docker', 'AWS'],
      location: 'New York, NY',
      github: 'https://github.com/priyasharma-ds',
      linkedin: 'https://linkedin.com/in/priyasharma-data',
      portfolio: 'https://priyasharma.io',
      resumeUrl: '',
      resumeOriginalName: '',
    });

    console.log('[Seeder] Creating realistic internships...');

    // Future deadlines
    const futureDate = (daysAhead) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d;
    };

    const internshipsData = [
      {
        title: 'Full Stack Web Developer Intern',
        company: 'CloudScale Technologies',
        description:
          'Join our agile engineering team to design, build, and deploy customer-facing features using modern JavaScript, React, Node.js, and MongoDB. You will collaborate closely with product managers and senior mentors in a fast-paced environment.',
        requirements: [
          'Solid understanding of JavaScript (ES6+), React, and Node.js',
          'Familiarity with RESTful API design and database modeling with MongoDB or PostgreSQL',
          'Experience using Git for version control and team workflows',
          'Eagerness to learn, write clean code, and participate in peer code reviews',
        ],
        responsibilities: [
          'Develop reusable React UI components and responsive views',
          'Write Express.js endpoints and test with automated suites',
          'Collaborate on sprint planning and daily standup discussions',
        ],
        skillsRequired: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git'],
        location: 'Remote',
        workType: 'Remote',
        category: 'Software Development',
        duration: '3 Months',
        stipend: 1800,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(45),
        vacancies: 3,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Machine Learning & Data Science Intern',
        company: 'Apex Analytics AI',
        description:
          'Work alongside research scientists and data engineers to build machine learning pipelines, analyze large datasets, and experiment with NLP algorithms to power next-generation recommendation systems.',
        requirements: [
          'Proficiency in Python and core data libraries (Pandas, NumPy, Scikit-Learn)',
          'Understanding of fundamental machine learning algorithms and statistical modeling',
          'Experience querying relational databases with SQL',
          'Strong communication skills to explain analytical insights',
        ],
        responsibilities: [
          'Pre-process and clean complex structured and unstructured datasets',
          'Train, evaluate, and benchmark machine learning models',
          'Create data visualization dashboards for cross-functional stakeholders',
        ],
        skillsRequired: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'TensorFlow'],
        location: 'New York, NY',
        workType: 'Hybrid',
        category: 'Data Science',
        duration: '6 Months',
        stipend: 2200,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(60),
        vacancies: 2,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'UI/UX Design & Product Strategy Intern',
        company: 'CreativeFlow Studio',
        description:
          'Transform user insights into sleek wireframes, interactive Figma prototypes, and design systems for mobile and web platforms. Learn directly from award-winning design leads.',
        requirements: [
          'Strong portfolio demonstrating UI design, typography, and layout principles',
          'Proficiency with Figma and modern design collaboration tools',
          'Understanding of user research methods and accessibility standards (WCAG)',
          'Ability to articulate design decisions with clarity',
        ],
        responsibilities: [
          'Create high-fidelity interactive Figma prototypes',
          'Conduct usability testing sessions with real users',
          'Maintain and evolve our multi-brand design component library',
        ],
        skillsRequired: ['Figma', 'UI/UX', 'Wireframing', 'User Research'],
        location: 'San Francisco, CA',
        workType: 'On-site',
        category: 'UI/UX Design',
        duration: '4 Months',
        stipend: 1600,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(30),
        vacancies: 2,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'DevOps & Cloud Infrastructure Intern',
        company: 'HyperCloud Networks',
        description:
          'Get hands-on experience orchestrating containers with Docker and Kubernetes, configuring CI/CD pipelines, and maintaining AWS cloud infrastructure for high-availability systems.',
        requirements: [
          'Familiarity with Linux operating systems and shell scripting',
          'Basic understanding of Docker containerization and CI/CD concepts',
          'Foundational knowledge of AWS or Google Cloud services',
          'Analytical problem-solving mindset',
        ],
        responsibilities: [
          'Assist in migrating legacy build workflows to automated GitHub Actions',
          'Monitor application uptime, logging, and performance metrics',
          'Help dockerize internal developer services for local reproduction',
        ],
        skillsRequired: ['Docker', 'AWS', 'Linux', 'Git', 'CI/CD'],
        location: 'Remote',
        workType: 'Remote',
        category: 'DevOps & Cloud',
        duration: '3 Months',
        stipend: 2000,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(40),
        vacancies: 1,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Associate Product Manager Intern',
        company: 'Vanguard Media Group',
        description:
          'Bridge business strategy, design, and engineering to define product roadmaps, write actionable user stories, and drive data-informed product discovery.',
        requirements: [
          'Strong analytical, problem-solving, and cross-functional communication abilities',
          'Understanding of Agile / Scrum methodologies',
          'Passion for tech products and customer user journeys',
          'Experience with Jira, Notion, or data analytics tools is a plus',
        ],
        responsibilities: [
          'Gather requirements and write product specification documents',
          'Analyze product funnels and engagement metrics',
          'Facilitate sprint ceremonies and collaborate with engineering pods',
        ],
        skillsRequired: ['Product Management', 'Agile', 'Scrum', 'Data Analysis', 'Communication'],
        location: 'Austin, TX',
        workType: 'Hybrid',
        category: 'Product Management',
        duration: '3 Months',
        stipend: 1750,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(50),
        vacancies: 2,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Growth & Digital Marketing Intern',
        company: 'Luminate Brands',
        description:
          'Support performance marketing campaigns, SEO optimization, and content strategy across multiple social and digital platforms to drive audience growth.',
        requirements: [
          'Familiarity with Google Analytics, SEO fundamentals, and social media analytics',
          'Creative copywriting and visual communication skills',
          'Organized, metric-driven approach to testing campaign hypotheses',
        ],
        responsibilities: [
          'Manage keyword research and optimize technical blog SEO',
          'Draft engaging copy for social media and email newsletters',
          'Prepare weekly KPI reports on user acquisition and conversion rates',
        ],
        skillsRequired: ['Digital Marketing', 'SEO', 'Content Strategy', 'Google Analytics'],
        location: 'Remote',
        workType: 'Remote',
        category: 'Digital Marketing',
        duration: '3 Months',
        stipend: 1400,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(25),
        vacancies: 1,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Frontend React & TypeScript Specialist Intern',
        company: 'NextGen Financial',
        description:
          'Build high-speed, secure financial trading dashboards using TypeScript, React 18, and Tailwind CSS. Learn robust state management and responsive visualization.',
        requirements: [
          'Proficiency with React and modern TypeScript',
          'Deep understanding of state management and component lifecycles',
          'Eye for pixel-perfect design and responsive CSS layouts',
        ],
        responsibilities: [
          'Develop financial chart views and interactive data tables',
          'Optimize rendering bottlenecks and minimize layout shifts',
          'Write end-to-end component tests',
        ],
        skillsRequired: ['React', 'TypeScript', 'TailwindCSS', 'JavaScript', 'Git'],
        location: 'Chicago, IL',
        workType: 'On-site',
        category: 'Software Development',
        duration: '6 Months',
        stipend: 2500,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(65),
        vacancies: 2,
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Financial Analyst & Modeling Intern',
        company: 'Beacon Capital Partners',
        description:
          'Support investment analysts in financial modeling, valuation research, and industry benchmark reports using advanced Excel, Python, and SQL.',
        requirements: [
          'Background in Finance, Economics, or Business with quantitative focus',
          'Proficiency in financial statement analysis and Excel modeling',
          'Basic programming in Python or SQL is an advantage',
        ],
        responsibilities: [
          'Build three-statement financial models and scenario forecasts',
          'Perform market research and competitive competitor profiles',
          'Summarize quarterly earnings reports and investor presentations',
        ],
        skillsRequired: ['Finance', 'Excel', 'Data Analysis', 'Python'],
        location: 'Boston, MA',
        workType: 'Hybrid',
        category: 'Finance',
        duration: '3 Months',
        stipend: 1900,
        stipendType: 'Paid',
        currency: 'USD',
        deadline: futureDate(35),
        vacancies: 1,
        status: 'Active',
        createdBy: admin._id,
      },
    ];

    const createdInternships = await Internship.insertMany(internshipsData);

    console.log('[Seeder] Creating sample application records...');

    // Student 1 applies to Full Stack Intern
    const app1 = await Application.create({
      internship: createdInternships[0]._id,
      student: student1._id,
      studentProfile: studentProfile1._id,
      coverNote: 'I am highly passionate about full stack development and have built several MERN stack projects. I would love to contribute to CloudScale Technologies!',
      resumeSnapshot: {
        url: '/uploads/sample-alex-resume.pdf',
        originalName: 'Alex_Rivera_Resume.pdf',
      },
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      adminFeedback: 'Impressive project portfolio and strong skill alignment with our core stack.',
    });

    await Internship.findByIdAndUpdate(createdInternships[0]._id, { $inc: { applicantsCount: 1 } });

    // Student 2 applies to ML Intern
    const app2 = await Application.create({
      internship: createdInternships[1]._id,
      student: student2._id,
      studentProfile: studentProfile2._id,
      coverNote: 'My graduate research focuses on predictive analytics and natural language processing. I am excited about the opportunity at Apex Analytics.',
      resumeSnapshot: {
        url: '/uploads/sample-priya-resume.pdf',
        originalName: 'Priya_Sharma_Resume.pdf',
      },
      status: 'Pending',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await Internship.findByIdAndUpdate(createdInternships[1]._id, { $inc: { applicantsCount: 1 } });

    console.log('[Seeder] Creating initial notifications...');

    await Notification.create([
      {
        recipient: student1._id,
        title: 'Application Shortlisted 🎉',
        message: 'Congratulations! Your application for Full Stack Web Developer Intern at CloudScale Technologies has been shortlisted for an interview.',
        type: 'application_status',
        link: '/applications',
        isRead: false,
      },
      {
        recipient: student1._id,
        title: 'New Recommended Opportunity',
        message: 'A new Frontend React & TypeScript Specialist internship has been posted matching 80% of your profile skills.',
        type: 'recommendation',
        link: `/internships/${createdInternships[6]._id}`,
        isRead: true,
      },
      {
        recipient: student2._id,
        title: 'Application Received',
        message: 'Your application for Machine Learning & Data Science Intern at Apex Analytics AI was received successfully.',
        type: 'application_received',
        link: '/applications',
        isRead: false,
      },
    ]);

    console.log('\n======================================================');
    console.log('       SKILLBRIDGE DATABASE SEED COMPLETE             ');
    console.log('======================================================');
    console.log(`Demo Admin Login:`);
    console.log(`  Email:    admin@skillbridge.dev`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`\nDemo Student Logins:`);
    console.log(`  1) Alex Rivera:   alex.rivera@student.edu   / Student@123456`);
    console.log(`  2) Priya Sharma:  priya.sharma@student.edu  / Student@123456`);
    console.log(`\nCreated ${createdInternships.length} internships across 6 categories.`);
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Failed]:', error);
    process.exit(1);
  }
};

seedDatabase();
