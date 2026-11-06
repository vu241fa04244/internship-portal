# SkillBridge – AI-Powered Student Internship & Career Opportunity Portal

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **SkillBridge** is a modern, production-ready Full-Stack MERN portal engineered to help students discover verified internships, construct professional profiles, upload PDF resumes, receive deterministic skill-based recommendations, submit applications, and track application milestones in real-time. Platform administrators manage students, create opportunities, and review candidate applications with full status transparency.

---

## 👥 Project Team Members

| Name | Registration Number | Role |
| :--- | :--- | :--- |
| **[Team Member 1 Name]** | `[REG-NO-001]` | Full-Stack Developer & Backend Lead |
| **[Team Member 2 Name]** | `[REG-NO-002]` | Frontend Architect & UI/UX Designer |
| **[Team Member 3 Name]** | `[REG-NO-003]` | Database Engineer & QA Specialist |

---

## 🎯 Problem Statement & Objectives

### Problem Statement
Finding meaningful internships is often challenging for university students due to fragmented job boards, generic job postings with ambiguous requirements, and the "black box" of automated Applicant Tracking Systems (ATS) that reject resumes without constructive feedback. Meanwhile, career administrators struggle with manual spreadsheets and lack real-time visibility into student placement pipelines.

### Core Objectives
1. **Accelerate Career Discovery**: Provide a clean, searchable catalog of verified student internships filtered by domain, location, stipend, and duration.
2. **Deterministic AI Skill Matching**: Calculate transparent, mathematical skill compatibility percentages between student profiles and internship competencies.
3. **Automated ATS Resume Diagnostics**: Enable PDF resume uploads with instant text parsing, 100-point multi-criteria scoring, and actionable improvement recommendations.
4. **Streamlined Application Pipeline**: Facilitate single-click applications, prevent duplicate submissions via database constraints, and enable real-time status tracking.
5. **Secure Administrative Governance**: Provide university/platform administrators with full CRUD capabilities, candidate review portals, and automated notification triggers.

---

## 🚀 Key Features

### 🎓 Student Experience
- **Interactive Landing Page**: Modern hero presentation, dynamic featured internships, metrics counters, and value propositions.
- **Student Authentication**: Secure registration and login with bcrypt password hashing and JWT sessions.
- **Comprehensive Profile**: Personal info, university degree, major, graduation year, GPA, social links, and an interactive skill tag manager.
- **PDF Resume Upload**: Multer-backed file upload with PDF type validation (max 5MB) and server-side text extraction.
- **Smart Opportunity Explorer**: Live keyword search with filters for Domain Category, Work Type (Remote, On-site, Hybrid), and Minimum Monthly Stipend.
- **Detailed Opportunity View**: Full role specifications, responsibilities, deadline countdown, and personalized skill overlap indicators.
- **Single-Click Application**: Apply with attached PDF resume and optional cover note; duplicate applications are strictly prevented.
- **Application Tracking**: Filter submitted applications by status (`Pending`, `Shortlisted`, `Accepted`, `Rejected`, `Withdrawn`) with instant withdrawal capabilities.
- **AI Skill Recommendations**: Internships deterministically ranked by compatibility percentage with transparent matched/missing skill breakdowns.
- **ATS Resume Analyzer**: Complete 100-point diagnostic breakdown with visual gauge, identified skills, and missing keyword suggestions.
- **Real-Time Notifications**: Unread badges and instant alerts whenever an application status is updated.

### 🛡️ Administrator Control Center
- **Protected Administrative Login**: Public self-registration as admin is prohibited; admin accounts are securely provisioned via dedicated CLI scripts.
- **Metric Dashboard**: Live counters for Total Students, Total Internships, Active Opportunities, and Application Status Distributions.
- **Full Internship CRUD**: Create, edit, toggle status (Active, Closed, Draft), and delete postings with deadline validation.
- **Candidate Review Hub**: Inspect candidate cover notes and open attached PDF resumes with one click.
- **Status Decisioning**: Update statuses to `Shortlisted`, `Accepted`, or `Rejected` with custom feedback automatically dispatched as a student notification.
- **Student Directory**: Searchable registry of registered students, universities, majors, and verified resumes.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18 (Vite), JavaScript (ES Modules), React Router v6, Axios, Lucide Icons, Modern Responsive CSS |
| **Backend** | Node.js, Express.js REST API, Centralized Error Handling, Modular Controllers & Routes |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM v8, Compound Unique & Text Indexes |
| **Authentication & Security** | JSON Web Tokens (JWT), BcryptJS, Helmet HTTP Headers, Express Rate Limiting, CORS Allowlisting |
| **File Processing & AI** | Multer, `pdf-parse`, Configurable External AI Integration (Gemini / OpenAI) with Deterministic Fallback Engine |
| **Testing** | Node.js Built-in Test Runner, Supertest, Vitest/Vite Build Pipeline |

---

## 📂 Project Structure

```
SkillBridge/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & lifecycle management
│   ├── controllers/
│   │   ├── adminController.js     # Admin statistics and candidate directories
│   │   ├── aiController.js        # Skill matching & resume evaluation endpoints
│   │   ├── applicationController.js# Student application submissions & status updates
│   │   ├── authController.js       # Register, login, and session validation
│   │   ├── internshipController.js # Internship listing & admin CRUD operations
│   │   ├── notificationController.js# User notifications and read toggles
│   │   └── studentController.js    # Profile management & resume upload
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization (RBAC)
│   │   ├── errorHandler.js       # Centralized error handler (Mongoose, Multer, JWT)
│   │   ├── upload.js             # Multer PDF file filter and storage configuration
│   │   └── validate.js           # ObjectId and payload body validations
│   ├── models/
│   │   ├── Application.js        # Compound unique index { internship: 1, student: 1 }
│   │   ├── Internship.js         # Opportunity schema with text search indexes
│   │   ├── Notification.js       # User notification schema
│   │   ├── ResumeAnalysis.js     # ATS scores and extracted skill records
│   │   ├── StudentProfile.js     # Extended academic profile & resume references
│   │   └── User.js               # User accounts with bcrypt hashing
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── internshipRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── studentRoutes.js
│   ├── scripts/
│   │   ├── createAdmin.js        # Safe CLI administrator creation command
│   │   └── seed.js               # Database seeder with sample internships & users
│   ├── tests/
│   │   └── api.test.js           # 20 automated unit and integration tests
│   ├── utils/
│   │   ├── aiService.js          # Hybrid AI & deterministic rule-based analysis
│   │   ├── pdfParser.js          # PDF buffer text extraction and cleanup
│   │   └── skillMatcher.js       # Deterministic skill matching algorithm
│   ├── uploads/                  # Uploaded PDF resume repository
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server bootstrap
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Brand favicon
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg          # Brand vector emblem
│   │   ├── components/
│   │   │   ├── cards/
│   │   │   │   ├── ApplicationCard.jsx
│   │   │   │   ├── InternshipCard.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── common/
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── Toast.jsx
│   │   │   └── layout/
│   │   │       └── DashboardLayout.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageApplications.jsx
│   │   │   │   ├── ManageInternships.jsx
│   │   │   │   └── ManageStudents.jsx
│   │   │   ├── internships/
│   │   │   │   ├── InternshipDetail.jsx
│   │   │   │   └── InternshipList.jsx
│   │   │   ├── student/
│   │   │   │   ├── AIRecommendations.jsx
│   │   │   │   ├── MyApplications.jsx
│   │   │   │   ├── ResumeAnalyzer.jsx
│   │   │   │   └── StudentProfile.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT request interceptors
│   │   ├── styles/
│   │   │   ├── components.css    # Modals, gauges, toasts, spinners
│   │   │   ├── dashboard.css     # Sidebar, metric cards, tables
│   │   │   ├── index.css         # CSS design system (Navy, Sky Blue, White)
│   │   │   ├── internships.css   # Filters, job cards, detail hero
│   │   │   └── navbar.css        # Responsive navigation & dropdowns
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── API_DOCUMENTATION.md      # Full REST API specifications
│   └── ARCHITECTURE.md           # System design & Mermaid diagrams
├── presentation/
│   └── README.md                 # 10-slide presentation outline
├── .gitignore
├── package.json                  # Root runner script orchestrator
└── README.md
```

---

## ⚙️ Environment Variables Setup

### Backend Configuration (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or MongoDB Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/skillbridge
# Atlas Example:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillbridge?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=skillbridge_super_secure_jwt_token_secret_key_2026_dev
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=http://localhost:5173

# AI Service Configuration (Optional external provider, defaults to rule-based engine)
AI_PROVIDER=rule-based
AI_API_KEY=

# Max Upload Size (Bytes, default 5MB)
MAX_FILE_SIZE=5242880
```

### Frontend Configuration (`frontend/.env`)
Create `frontend/.env` based on `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Windows PowerShell Execution Instructions

Follow these exact commands to install dependencies, run tests, seed the database, and launch the application on Windows:

### 1. Install Dependencies
```powershell
# Install root, backend, and frontend packages
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Seed Database with Realistic Demo Data
```powershell
# Seeds sample internships, student accounts, and admin user
npm --prefix backend run seed
```

*Pre-seeded Demo Credentials:*
- **Admin**: `admin@skillbridge.dev` / `Admin@123456`
- **Student 1 (Full Stack)**: `alex.rivera@student.edu` / `Student@123456`
- **Student 2 (Data Science)**: `priya.sharma@student.edu` / `Student@123456`

### 3. Create Additional Administrator via CLI
```powershell
# Safe documented admin seeding command
node backend/scripts/createAdmin.js --name "Campus Administrator" --email "director@skillbridge.dev" --password "DirectorPass2026!"
```

### 4. Run Automated Backend Tests
```powershell
# Runs 20 unit and integration tests against an isolated test database
npm --prefix backend test
```

### 5. Build Frontend for Production
```powershell
# Verifies zero-error production build
npm --prefix frontend run build
```

### 6. Start Development Servers
Open two PowerShell terminals:

**Terminal 1 (Backend API):**
```powershell
npm --prefix backend start
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```powershell
npm --prefix frontend run dev
# Frontend runs on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing Verification Report

The automated test suite runs via Node.js's native test runner against an isolated test database (`skillbridge_test`):

```
✔ SkillBridge Backend Automated Test Suite
  ✔ Skill Matcher Deterministic Logic
    ✔ should correctly normalize and match skills with aliases and whitespace
    ✔ should rank internships descending by match percentage
  ✔ Resume Analyzer Engine
    ✔ should parse contact info, technical skills, and generate breakdown scores
  ✔ Authentication & User Management APIs
    ✔ should register a new student user and generate JWT token
    ✔ should reject registration if email is duplicate
    ✔ should reject registration with invalid email or short password
    ✔ should log in student with valid credentials
    ✔ should reject login with wrong password
    ✔ should return current user info via GET /api/auth/me
  ✔ Role-Based Authorization Protections
    ✔ should forbid student from creating an internship (403)
    ✔ should allow admin to create an internship (201)
    ✔ should allow admin to update an internship (200)
  ✔ Student Profile & Application Flow
    ✔ should update student profile with skills and resume data
    ✔ should allow student to submit an application
    ✔ should PREVENT duplicate application to the same internship (409)
    ✔ should fetch student applications list via GET /api/applications/my
  ✔ Admin Application Review Flow
    ✔ should allow admin to update application status to Shortlisted and notify student
    ✔ should fetch admin dashboard statistics with accurate counts
  ✔ AI Recommendations API
    ✔ should return skill-based internship recommendations with transparent score
  ✔ System Health Check API
    ✔ should return healthy status and database connection state

Tests: 20 Passed, 0 Failed (100% Pass Rate)
```

---

## 🌐 Production Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free-tier cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user and record the username/password.
3. Under **Network Access**, add `0.0.0.0/0` (or your backend provider's IP range).
4. Copy the SRV connection URI and assign it to `MONGO_URI` in production.

### 2. Backend Deployment (Render / Railway)
1. Push your repository to GitHub.
2. In Render, create a new **Web Service** connected to the repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: A 32+ character cryptographically secure secret
   - `CLIENT_URL`: Your Vercel frontend URL
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default assigned by host)
   - `AI_PROVIDER`: `rule-based` (or `gemini` with `AI_API_KEY`)
5. Deploy and verify the health check endpoint: `https://your-api.onrender.com/api/health`.

### 3. Frontend Deployment (Vercel)
1. In Vercel, import your repository.
2. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variable:
   - `VITE_API_URL`: `https://your-api.onrender.com/api`
4. Deploy and test the live application.

---

## 📷 Platform Preview & Screenshots

| Landing Page | Student Dashboard |
| :---: | :---: |
| *Modern Navy & Sky Blue Career Gateway* | *Live Application Metrics & Recommendations* |
| **Internship Opportunities** | **ATS Resume Analyzer** |
| *Multi-facet Filtering & Match Scores* | *100-Point Scoring Gauge & Diagnostics* |

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
