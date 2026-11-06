# SkillBridge System Architecture & Technical Design

## 1. Architectural Overview

SkillBridge is built as a modular, three-tier Full-Stack MERN application adhering to RESTful API principles, role-based access control (RBAC), and deterministic algorithmic intelligence.

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|        React 18 + Vite SPA, React Router v6, Axios, Lucide Icons       |
+------------------------------------+------------------------------------+
                                     |  HTTPS / JSON / Bearer JWT
+------------------------------------v------------------------------------+
|                             BACKEND LAYER                               |
|               Node.js + Express.js Modular RESTful API                  |
|  - Security: Helmet, CORS allowlist, Express Rate Limit, BcryptJS       |
|  - Middlewares: JWT Auth, RBAC ('student' | 'admin'), Multer Validation |
|  - Services: Deterministic Skill Matcher & ATS Resume Diagnostics       |
+------------------------------------+------------------------------------+
                                     |  Mongoose ODM (Driver v8)
+------------------------------------v------------------------------------+
|                            DATABASE LAYER                               |
|                     MongoDB (Local / Atlas Replica)                     |
|  - Collections: Users, StudentProfiles, Internships, Applications,      |
|                 ResumeAnalyses, Notifications                           |
|  - Indexes: Unique Compound, Text Search, Ascending Expiration         |
+-------------------------------------------------------------------------+
```

---

## 2. Entity-Relationship Model

```mermaid
erDiagram
    User ||--o| StudentProfile : "has profile"
    User ||--o{ Application : "submits"
    User ||--o{ Notification : "receives"
    User ||--o{ ResumeAnalysis : "requests analysis"
    User ||--o{ Internship : "creates (admin)"
    Internship ||--o{ Application : "receives"

    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "student | admin"
        date createdAt
    }

    StudentProfile {
        ObjectId _id PK
        ObjectId user FK, UK
        string phone
        string university
        string educationLevel
        number graduationYear
        string major
        string gpa
        string bio
        string[] skills
        string location
        string resumeUrl
        string resumeOriginalName
        string github
        string linkedin
        string portfolio
    }

    Internship {
        ObjectId _id PK
        string title
        string company
        string description
        string[] requirements
        string[] responsibilities
        string[] skillsRequired
        string location
        string workType "Remote | On-site | Hybrid"
        string category
        string duration
        number stipend
        date deadline
        number vacancies
        string status "Active | Closed | Draft"
        ObjectId createdBy FK
        number applicantsCount
    }

    Application {
        ObjectId _id PK
        ObjectId internship FK
        ObjectId student FK
        ObjectId studentProfile FK
        string status "Pending | Shortlisted | Accepted | Rejected | Withdrawn"
        string coverNote
        object resumeSnapshot
        date appliedAt
        date reviewedAt
        string adminFeedback
    }

    ResumeAnalysis {
        ObjectId _id PK
        ObjectId student FK
        string fileName
        number score "0 - 100"
        object scoreBreakdown
        string[] identifiedSkills
        string[] missingSkills
        string[] suggestions
        string[] strengths
        object atsCompatibility
        string providerUsed
        date analyzedAt
    }

    Notification {
        ObjectId _id PK
        ObjectId recipient FK
        string title
        string message
        string type
        boolean isRead
        string link
        date createdAt
    }
```

---

## 3. Application Lifecycle & Status Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Portal as SkillBridge Frontend
    participant API as Express API
    participant DB as MongoDB Atlas
    actor Admin

    Student->>Portal: Browse Internships & Select Position
    Portal->>API: GET /api/internships/:id (Optional Auth)
    API->>DB: Query Internship & Check Prior Applications
    DB-->>API: Internship Record + Application Flag
    API-->>Portal: Details + Personalized Skill Match %

    Student->>Portal: Click Apply (with PDF Resume Snapshot)
    Portal->>API: POST /api/applications { internshipId, coverNote }
    API->>DB: Verify Deadline & Check Compound Unique Index
    DB-->>API: Created Application (Status: Pending)
    API->>DB: Increment Internship.applicantsCount (+1)
    API->>DB: Create Notification for Student
    API-->>Portal: 201 Created

    Admin->>Portal: Open Applications Review Center
    Portal->>API: GET /api/admin/applications?status=Pending
    API->>DB: Populate Applicant & Internship Details
    DB-->>API: Applications List
    API-->>Portal: Render Data Table

    Admin->>Portal: Update Status ("Shortlisted", Feedback: "Strong match")
    Portal->>API: PATCH /api/applications/:id/status
    API->>DB: Update Application Record
    API->>DB: Insert Notification Record (Recipient: Student)
    DB-->>API: Confirmed
    API-->>Portal: 200 OK + Realtime Notification Trigger
```

---

## 4. AI Engine Architecture

### A. Deterministic Skill Matching Algorithm
1. **Input**: Student profile skills array and internship required skills array.
2. **Normalization**:
   - Trim whitespace and lowercase text.
   - Map aliases using standard dictionary (e.g. `react.js` $\rightarrow$ `react`, `nodejs` $\rightarrow$ `nodejs`, `ts` $\rightarrow$ `typescript`).
   - Deduplicate inputs using Sets.
3. **Comparison**:
   - Exact token matching against canonical names.
   - Substring fuzzy matching for multi-word technologies.
4. **Scoring**:
   $$\text{Match Percentage} = \text{round}\left(\frac{|\text{Matched Skills}|}{|\text{Normalized Required Skills}|} \times 100\right)$$
5. **Output**: Transparent breakdown of matched skills, missing skills, and mandatory advisory disclaimer.

### B. Hybrid ATS Resume Analyzer
1. **PDF Extraction**: Reads PDF binary buffers using `pdf-parse`, stripping control sequences while retaining structure.
2. **Analysis Pipeline**:
   - **Contact Verification (15 pts)**: Email regex, phone regex, LinkedIn, GitHub, portfolio presence.
   - **Academic Verification (15 pts)**: Degree level, institution keywords, graduation year, GPA indicators.
   - **Skills Extraction (30 pts)**: Dictionary comparison across 70+ languages, frameworks, cloud tools, databases.
   - **Impact & Experience (25 pts)**: Projects/experience headers, action verbs, quantifiable metrics.
   - **ATS Structure (15 pts)**: Section headings and word density benchmarks.
3. **Provider Fallback**:
   - If `AI_PROVIDER` and `AI_API_KEY` are provided, calls external LLM provider with strict JSON output schema.
   - If external API times out, exceeds quota, or is unconfigured, smoothly falls back to the deterministic rule-based engine (`providerUsed: 'rule-based-fallback'`), ensuring zero service interruption.
