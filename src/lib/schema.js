// ─────────────────────────────────────────────────────────────
// schema.js  –  Canonical entry shape, builder, and validator
// ─────────────────────────────────────────────────────────────

// ── Required top-level keys ───────────────────────────────
const REQUIRED_KEYS = [
  'id', 'createdAt', 'updatedAt',
  'company', 'role', 'jdText',
  'extractedSkills',
  'checklist', 'plan7Days', 'questions',
  'companyIntel',
  'baseScore', 'finalScore',
  'skillConfidenceMap',
]

// ── Default extractedSkills when nothing is detected ─────
export const FALLBACK_SKILLS = {
  'General': ['Communication', 'Problem Solving', 'Basic Coding', 'Projects'],
}

// ── Validate a single entry ───────────────────────────────
// Returns { valid: true } or { valid: false, reason: string }
export function validateEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return { valid: false, reason: 'Entry is not an object.' }
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in entry)) {
      return { valid: false, reason: `Missing required field: "${key}".` }
    }
  }
  if (typeof entry.jdText !== 'string' || entry.jdText.trim().length === 0) {
    return { valid: false, reason: 'jdText is empty or not a string.' }
  }
  if (typeof entry.baseScore !== 'number' || typeof entry.finalScore !== 'number') {
    return { valid: false, reason: 'baseScore or finalScore is not a number.' }
  }
  if (!Array.isArray(entry.checklist) || !Array.isArray(entry.plan7Days) || !Array.isArray(entry.questions)) {
    return { valid: false, reason: 'checklist, plan7Days, or questions is not an array.' }
  }
  return { valid: true }
}

// ── Build a canonical entry from raw analyze() output ────
export function buildEntry({ company, role, jdText, analysisResult }) {
  const {
    extractedSkills,
    readinessScore,
    checklist,
    plan,
    questions,
    companyIntel,
  } = analysisResult

  // Ensure extractedSkills is never empty
  const skills = (Object.keys(extractedSkills).length === 0)
    ? FALLBACK_SKILLS
    : extractedSkills

  // Build default skillConfidenceMap — all skills start as 'practice'
  const allSkills = Object.values(skills).flat()
  const skillConfidenceMap = {}
  allSkills.forEach((s) => { skillConfidenceMap[s] = 'practice' })

  const now = new Date().toISOString()

  return {
    id:                crypto.randomUUID(),
    createdAt:         now,
    updatedAt:         now,
    company:           (company ?? '').trim(),
    role:              (role ?? '').trim(),
    jdText:            jdText,
    extractedSkills:   skills,
    checklist:         checklist,          // [{ round, items[] }]
    plan7Days:         plan,               // [{ day, theme, tasks[] }]
    questions:         questions,          // [{ id, question }]
    companyIntel:      companyIntel,
    baseScore:         readinessScore,
    finalScore:        readinessScore,     // starts equal to base; changes with toggles
    skillConfidenceMap,
  }
}

// ── Compute finalScore from base + confidence map ────────
export function computeFinalScore(baseScore, skillConfidenceMap) {
  const delta = Object.values(skillConfidenceMap)
    .reduce((acc, v) => acc + (v === 'know' ? 2 : -2), 0)
  return Math.max(0, Math.min(100, baseScore + delta))
}
