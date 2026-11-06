/**
 * SkillBridge - Skill Matching Utility
 * AI Feature 1: Deterministic Skill-Based Matching Algorithm
 */

// Normalized skill alias map to handle common variations
const SKILL_ALIASES = {
  'js': 'javascript',
  'javascript': 'javascript',
  'ts': 'typescript',
  'typescript': 'typescript',
  'py': 'python',
  'python': 'python',
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'express': 'express',
  'expressjs': 'express',
  'express.js': 'express',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'psql': 'postgresql',
  'k8s': 'kubernetes',
  'kubernetes': 'kubernetes',
  'aws': 'aws',
  'amazon web services': 'aws',
  'gcp': 'google cloud',
  'google cloud': 'google cloud',
  'vue': 'vue',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'angular': 'angular',
  'angularjs': 'angular',
  'html': 'html5',
  'html5': 'html5',
  'css': 'css3',
  'css3': 'css3',
  'next': 'nextjs',
  'nextjs': 'nextjs',
  'next.js': 'nextjs',
  'rest': 'rest api',
  'restful api': 'rest api',
  'rest api': 'rest api',
  'git': 'git',
  'github': 'github',
  'docker': 'docker',
  'tailwind': 'tailwindcss',
  'tailwindcss': 'tailwindcss',
};

/**
 * Standardize skill string: lowercase, trim, remove excess whitespace and non-alphanumeric (except + and #)
 */
const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

  return SKILL_ALIASES[cleaned] || cleaned;
};

/**
 * Compare student's skill set with an internship's required skills
 * @param {Array<string>} studentSkills
 * @param {Array<string>} requiredSkills
 * @returns {Object} { matchPercentage, matchedSkills, missingSkills, totalRequired, matchScore }
 */
const calculateSkillMatch = (studentSkills = [], requiredSkills = []) => {
  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0,
      matchScore: 100,
      disclaimer: 'Skill-based recommendation only. Does not guarantee selection or interview.',
    };
  }

  // Deduplicate and normalize student skills
  const studentSkillSet = new Set(
    studentSkills
      .filter((s) => s && typeof s === 'string')
      .map(normalizeSkill)
      .filter(Boolean)
  );

  // Deduplicate and normalize required skills
  const normalizedRequired = [];
  const seenRequired = new Set();
  const rawToNormalizedMap = new Map();

  for (const skill of requiredSkills) {
    if (!skill || typeof skill !== 'string') continue;
    const normalized = normalizeSkill(skill);
    if (!normalized || seenRequired.has(normalized)) continue;
    seenRequired.add(normalized);
    normalizedRequired.push(normalized);
    rawToNormalizedMap.set(normalized, skill.trim());
  }

  if (normalizedRequired.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0,
      matchScore: 100,
      disclaimer: 'Skill-based recommendation only. Does not guarantee selection or interview.',
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  for (const normalized of normalizedRequired) {
    const rawSkillName = rawToNormalizedMap.get(normalized);
    if (studentSkillSet.has(normalized)) {
      matchedSkills.push(rawSkillName);
    } else {
      // Also check partial substring match for multi-word skills (e.g. "React" inside "React.js")
      let foundFuzzy = false;
      for (const sSkill of studentSkillSet) {
        if (sSkill.includes(normalized) || normalized.includes(sSkill)) {
          matchedSkills.push(rawSkillName);
          foundFuzzy = true;
          break;
        }
      }
      if (!foundFuzzy) {
        missingSkills.push(rawSkillName);
      }
    }
  }

  const matchPercentage = Math.round(
    (matchedSkills.length / normalizedRequired.length) * 100
  );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    totalRequired: normalizedRequired.length,
    matchScore: matchPercentage,
    disclaimer: 'Skill-based recommendation only. Does not guarantee selection or interview.',
  };
};

/**
 * Rank internships for a student based on skill matching percentage
 * @param {Array<Object>} internships
 * @param {Array<string>} studentSkills
 * @returns {Array<Object>} Ranked internships with match metrics
 */
const rankInternshipsForStudent = (internships = [], studentSkills = []) => {
  return internships
    .map((internship) => {
      const matchMetrics = calculateSkillMatch(
        studentSkills,
        internship.skillsRequired || []
      );
      const internshipObj = internship.toObject ? internship.toObject() : { ...internship };
      return {
        ...internshipObj,
        matchMetrics,
      };
    })
    .sort((a, b) => b.matchMetrics.matchPercentage - a.matchMetrics.matchPercentage);
};

module.exports = {
  normalizeSkill,
  calculateSkillMatch,
  rankInternshipsForStudent,
};
