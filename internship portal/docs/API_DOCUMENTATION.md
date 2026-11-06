# SkillBridge REST API Specification

Base URL: `http://localhost:5000/api`

---

## 1. Authentication & Identity (`/api/auth`)

### `POST /api/auth/register`
Register a new student account. Public self-registration is strictly restricted to the `student` role.
- **Headers**: `Content-Type: application/json`
- **Rate Limit**: 25 requests / 15 minutes window
- **Request Body**:
  ```json
  {
    "name": "Alex Rivera",
    "email": "alex.rivera@student.edu",
    "password": "Password@123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Student account registered successfully.",
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "6728a...",
      "name": "Alex Rivera",
      "email": "alex.rivera@student.edu",
      "role": "student",
      "profileId": "6728b..."
    }
  }
  ```

### `POST /api/auth/login`
Authenticate existing user (student or administrator) and obtain JWT bearer token.
- **Request Body**:
  ```json
  {
    "email": "alex.rivera@student.edu",
    "password": "Student@123456"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "6728a...",
      "name": "Alex Rivera",
      "email": "alex.rivera@student.edu",
      "role": "student"
    }
  }
  ```

### `GET /api/auth/me`
Retrieve profile of currently authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns user and student profile object.

---

## 2. Student Profile Management (`/api/students`)

### `GET /api/students/profile`
- **Access**: Private (`student`)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Full student profile with populated user details.

### `PUT /api/students/profile`
- **Access**: Private (`student`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Alex Rivera",
    "phone": "+1 555-234-5678",
    "university": "Tech State University",
    "educationLevel": "Bachelor",
    "graduationYear": 2026,
    "major": "Computer Science",
    "gpa": "3.85",
    "skills": ["React", "Node.js", "MongoDB", "Git"],
    "location": "San Francisco, CA",
    "github": "https://github.com/alexrivera-dev",
    "linkedin": "https://linkedin.com/in/alexrivera-tech"
  }
  ```

### `POST /api/students/resume`
Upload PDF resume with automatic text extraction.
- **Access**: Private (`student`)
- **Headers**: `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
- **Form Data**: `resume: [PDF binary]` (max 5 MB)

---

## 3. Internship Opportunities (`/api/internships`)

### `GET /api/internships`
Browse all active internships with search, category/workType filtering, and pagination. If student is logged in, includes personalized skill matching scores.
- **Query Params**:
  - `search` (string): Keyword match in title, company, skills
  - `category` (string): e.g. "Software Development", "Data Science"
  - `workType` (string): "Remote", "On-site", "Hybrid"
  - `minStipend` (number): Minimum monthly compensation
  - `page` (number): Default 1
  - `limit` (number): Default 10

### `GET /api/internships/:id`
Fetch single opportunity details, applicant count, deadline, and application status if authenticated.

### `POST /api/internships`
Create new internship posting.
- **Access**: Private (`admin` only)
- **Request Body**:
  ```json
  {
    "title": "Full Stack Engineer Intern",
    "company": "CloudScale Technologies",
    "description": "Building modern web services with MERN.",
    "skillsRequired": ["React", "Node.js", "MongoDB"],
    "location": "Remote",
    "workType": "Remote",
    "category": "Software Development",
    "duration": "3 Months",
    "stipend": 2000,
    "deadline": "2026-12-31T23:59:59.000Z",
    "vacancies": 2,
    "status": "Active"
  }
  ```

### `PUT /api/internships/:id`
Update internship posting details.
- **Access**: Private (`admin` only)

### `DELETE /api/internships/:id`
Permanently delete an internship and associated applications.
- **Access**: Private (`admin` only)

---

## 4. Application Management (`/api/applications`)

### `POST /api/applications`
Submit application for an active internship. Prevents duplicates via unique compound index. Validates application deadline.
- **Access**: Private (`student` only)
- **Request Body**:
  ```json
  {
    "internshipId": "6728a...",
    "coverNote": "Excited to apply for this position!"
  }
  ```

### `GET /api/applications/my`
Retrieve all applications submitted by the logged-in student.
- **Access**: Private (`student` only)

### `DELETE /api/applications/:id`
Withdraw an application if currently in `Pending` or `Shortlisted` status.
- **Access**: Private (`student` only)

### `PATCH /api/applications/:id/status`
Update decision status of an application. Automatically generates notification for the applicant.
- **Access**: Private (`admin` only)
- **Request Body**:
  ```json
  {
    "status": "Shortlisted",
    "adminFeedback": "Impressive portfolio project alignment."
  }
  ```

---

## 5. AI Recommendations & Resume Analytics (`/api/ai`)

### `POST /api/ai/recommendations`
Calculate deterministic skill match percentages against active internships.
- **Access**: Private (`student`)
- **Response**: Sorted array of internships with `matchMetrics: { matchPercentage, matchedSkills, missingSkills, disclaimer }`.

### `POST /api/ai/analyze-resume`
Extract text from an uploaded PDF resume (or student profile resume) and run ATS diagnostics.
- **Access**: Private (`student`)
- **Response Structure**:
  ```json
  {
    "success": true,
    "analysis": {
      "score": 88,
      "scoreBreakdown": {
        "contactInfo": 15,
        "education": 15,
        "skillsScore": 27,
        "experience": 21,
        "formatting": 10
      },
      "identifiedSkills": ["React", "Node.js", "JavaScript", "Docker"],
      "missingSkills": ["TypeScript", "CI/CD"],
      "suggestions": [
        "Quantify project achievements with metrics.",
        "Add an active GitHub profile link."
      ],
      "atsCompatibility": {
        "status": "Excellent",
        "issues": []
      },
      "providerUsed": "rule-based-engine",
      "disclaimer": "SkillBridge AI analysis is advisory..."
    }
  }
  ```

---

## 6. Admin Command APIs (`/api/admin`)

- `GET /api/admin/dashboard` — Platform overview metrics and application status distribution.
- `GET /api/admin/students` — Complete student directory with profile populating and search.
- `GET /api/admin/applications` — All platform applications with status and internship filters.

---

## 7. System Health Check

- `GET /api/health` — Verifies server uptime, timestamp, and active MongoDB connection state.
