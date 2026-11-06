/**
 * SkillBridge - AI Service & Resume Analyzer
 * AI Feature 2: Hybrid AI Provider with Deterministic Rule-Based Fallback
 */

// Comprehensive dictionary of technical and soft skills for parsing
const SKILL_DATABASE = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'ruby', 'go', 'golang', 'rust', 'php', 'swift', 'kotlin', 'sql', 'r', 'dart', 'html', 'css', 'html5', 'css3',
  // Frontend
  'react', 'react.js', 'reactjs', 'vue', 'vue.js', 'angular', 'next.js', 'nextjs', 'svelte', 'redux', 'tailwind', 'tailwindcss', 'bootstrap', 'sass', 'webpack', 'vite',
  // Backend & APIs
  'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring boot', 'laravel', 'graphql', 'rest api', 'restful', 'grpc', 'microservices',
  // Databases & Caching
  'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'cassandra', 'prisma', 'mongoose',
  // DevOps, Cloud & Tools
  'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'ci/cd', 'linux', 'bash', 'terraform', 'jenkins', 'nginx',
  // Testing & Quality
  'jest', 'mocha', 'cypress', 'vitest', 'unit testing', 'test-driven development', 'tdd', 'postman',
  // AI / Data Science
  'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'data analysis', 'nlp', 'computer vision',
  // Design & Architecture
  'figma', 'ui/ux', 'system design', 'agile', 'scrum', 'object-oriented programming', 'oop',
  // Soft Skills
  'problem solving', 'team leadership', 'communication', 'collaboration', 'critical thinking', 'time management', 'adaptability'
];

// High-demand baseline skills students are often encouraged to have
const HIGH_DEMAND_BENCHMARKS = [
  'Git', 'TypeScript', 'Docker', 'REST API', 'Unit Testing', 'CI/CD', 'SQL', 'React', 'Node.js', 'Cloud (AWS/GCP/Azure)'
];

/**
 * Perform rule-based resume analysis on extracted text
 * @param {string} text - Clean extracted text from resume
 * @returns {Object} Structured analysis object
 */
const analyzeResumeRuleBased = (text = '') => {
  const lowerText = text.toLowerCase();

  // 1. Contact Information Analysis (up to 15 points)
  let contactScore = 0;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(lowerText) || lowerText.includes('linkedin');
  const hasGitHub = /github\.com\/[a-zA-Z0-9_-]+/.test(lowerText) || lowerText.includes('github');
  const hasPortfolio = /portfolio|website|https?:\/\//.test(lowerText);

  if (hasEmail) contactScore += 4;
  if (hasPhone) contactScore += 4;
  if (hasLinkedIn) contactScore += 3;
  if (hasGitHub) contactScore += 2;
  if (hasPortfolio) contactScore += 2;
  contactScore = Math.min(contactScore, 15);

  // 2. Education Analysis (up to 15 points)
  let educationScore = 0;
  const hasDegree = /bachelor|master|b\.?s\.?|m\.?s\.?|b\.?tech|degree|diploma|ph\.?d/i.test(text);
  const hasUniversity = /university|institute|college|school/i.test(text);
  const hasGradYear = /20(1\d|2\d|3\d)/.test(text);
  const hasGpa = /gpa|cgpa|grade/i.test(text);

  if (hasDegree) educationScore += 6;
  if (hasUniversity) educationScore += 4;
  if (hasGradYear) educationScore += 3;
  if (hasGpa) educationScore += 2;
  educationScore = Math.min(educationScore, 15);

  // 3. Technical Skills Extraction (up to 30 points)
  const identifiedSkillsSet = new Set();
  for (const skill of SKILL_DATABASE) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
    if (regex.test(lowerText)) {
      // Capitalize for display
      const formatted = skill
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      identifiedSkillsSet.add(formatted);
    }
  }

  const identifiedSkills = Array.from(identifiedSkillsSet);
  // 3 points per skill up to max 30 points
  const skillsScore = Math.min(identifiedSkills.length * 3, 30);

  // Missing high-demand skills
  const missingSkills = HIGH_DEMAND_BENCHMARKS.filter(
    (b) => !identifiedSkills.some((s) => s.toLowerCase() === b.toLowerCase())
  ).slice(0, 5);

  // 4. Experience & Projects Analysis (up to 25 points)
  let experienceScore = 0;
  const hasProjectsSection = /projects?|portfolio/i.test(text);
  const hasExperienceSection = /experience|employment|work history|internship/i.test(text);
  const actionVerbs = ['developed', 'built', 'created', 'designed', 'implemented', 'optimized', 'engineered', 'led', 'managed', 'deployed'];
  const foundVerbs = actionVerbs.filter((v) => lowerText.includes(v));
  const hasMetrics = /\d+%\s|\$\d+|\d+\s*users|\d+\s*ms|\d+\s*x/i.test(text);

  if (hasProjectsSection) experienceScore += 7;
  if (hasExperienceSection) experienceScore += 8;
  experienceScore += Math.min(foundVerbs.length * 1.5, 6);
  if (hasMetrics) experienceScore += 4;
  experienceScore = Math.min(Math.round(experienceScore), 25);

  // 5. ATS Formatting & Structure (up to 15 points)
  let formattingScore = 0;
  const sectionKeywords = ['summary', 'objective', 'skills', 'education', 'experience', 'projects', 'certifications'];
  const foundSections = sectionKeywords.filter((sec) => lowerText.includes(sec));
  formattingScore += Math.min(foundSections.length * 2.5, 10);

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 1200) {
    formattingScore += 5; // Ideal single/two-page resume word density
  } else if (wordCount > 50) {
    formattingScore += 3;
  }
  formattingScore = Math.min(Math.round(formattingScore), 15);

  // Calculate Total Score (0-100)
  const totalScore = Math.min(
    Math.max(contactScore + educationScore + skillsScore + experienceScore + formattingScore, 10),
    100
  );

  // ATS Compatibility Assessment
  const atsIssues = [];
  if (!hasEmail) atsIssues.push('No detectable email address found.');
  if (!hasLinkedIn) atsIssues.push('LinkedIn profile link not detected.');
  if (!hasGitHub) atsIssues.push('GitHub or code repository profile link not detected.');
  if (foundSections.length < 3) atsIssues.push('Clear standard section headings (Education, Skills, Experience) are missing.');
  if (wordCount < 100) atsIssues.push('Resume content appears very brief. Ensure all details are included.');

  let atsStatus = 'Excellent';
  if (atsIssues.length >= 3 || totalScore < 50) {
    atsStatus = 'Needs Improvement';
  } else if (atsIssues.length >= 1 || totalScore < 75) {
    atsStatus = 'Good';
  }

  // Strengths
  const strengths = [];
  if (identifiedSkills.length >= 8) strengths.push(`Strong technical skill variety with ${identifiedSkills.length} identified technologies.`);
  if (hasProjectsSection && hasExperienceSection) strengths.push('Well-structured layout featuring both hands-on project work and relevant experience.');
  if (hasMetrics) strengths.push('Included quantifiable metrics and outcomes to demonstrate real impact.');
  if (hasLinkedIn && hasGitHub) strengths.push('Complete developer presence with accessible professional links.');
  if (strengths.length === 0) strengths.push('Clear baseline structure with essential contact and education details.');

  // Suggestions
  const suggestions = [];
  if (!hasMetrics) suggestions.push('Quantify your project achievements with numbers (e.g., "improved load time by 30%", "served 500+ active users").');
  if (missingSkills.length > 0) suggestions.push(`Consider adding or building projects with industry-standard tools: ${missingSkills.join(', ')}.`);
  if (foundVerbs.length < 3) suggestions.push('Start bullet points with strong action verbs like "Architected", "Optimized", "Engineered", and "Automated".');
  if (!hasGitHub) suggestions.push('Add your active GitHub profile link so technical hiring managers can review your source code.');
  if (suggestions.length === 0) suggestions.push('Keep your resume updated with your most recent projects, tech stack versions, and certifications.');

  return {
    score: totalScore,
    scoreBreakdown: {
      contactInfo: contactScore,
      education: educationScore,
      skillsScore,
      experience: experienceScore,
      formatting: formattingScore,
    },
    identifiedSkills,
    missingSkills,
    suggestions,
    strengths,
    atsCompatibility: {
      status: atsStatus,
      issues: atsIssues,
    },
    providerUsed: 'rule-based-engine',
    disclaimer: 'SkillBridge AI analysis is advisory and provided for student guidance only. Scores do not guarantee interview selection or job offers.',
  };
};

/**
 * Analyze resume using configured AI provider or fallback
 * @param {string} text - Clean extracted text from resume
 * @returns {Promise<Object>} Structured analysis
 */
const analyzeResumeText = async (text = '') => {
  const provider = (process.env.AI_PROVIDER || 'rule-based').toLowerCase();
  const apiKey = process.env.AI_API_KEY;

  // If no external provider configured or key missing, use robust rule-based engine directly
  if (!apiKey || provider === 'rule-based') {
    return analyzeResumeRuleBased(text);
  }

  // If external provider is configured (e.g. Gemini or OpenAI)
  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const prompt = `You are a professional technical recruiter and ATS resume evaluator.
Analyze the following resume text and respond ONLY with a valid JSON object matching this schema:
{
  "score": number (0-100),
  "scoreBreakdown": {
    "contactInfo": number (0-15),
    "education": number (0-15),
    "skillsScore": number (0-30),
    "experience": number (0-25),
    "formatting": number (0-15)
  },
  "identifiedSkills": string[],
  "missingSkills": string[],
  "suggestions": string[],
  "strengths": string[],
  "atsCompatibility": {
    "status": "Excellent" | "Good" | "Needs Improvement",
    "issues": string[]
  }
}

Do not include markdown fences or explanation. Only output JSON.
Resume text:
${text.slice(0, 4000)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawContent) {
        throw new Error('No content returned by Gemini');
      }

      const parsed = JSON.parse(rawContent);
      return {
        ...parsed,
        providerUsed: 'gemini-1.5-flash',
        disclaimer: 'SkillBridge AI analysis is advisory and provided for student guidance only. Scores do not guarantee interview selection or job offers.',
      };
    }

    // Default fallback if provider unrecognized
    return analyzeResumeRuleBased(text);
  } catch (error) {
    console.warn(`[AI Provider Warning] External AI analysis failed (${error.message}). Falling back to rule-based engine.`);
    const fallbackResult = analyzeResumeRuleBased(text);
    fallbackResult.providerUsed = 'rule-based-fallback';
    return fallbackResult;
  }
};

module.exports = {
  analyzeResumeRuleBased,
  analyzeResumeText,
  SKILL_DATABASE,
};
