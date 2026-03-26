// ─────────────────────────────────────────────────────────────
// analyzer.js  –  All heuristic analysis logic (no external APIs)
// ─────────────────────────────────────────────────────────────
import { buildCompanyIntel } from './companyIntel'

export const SKILL_MAP = {
  'Core CS':      ['dsa', 'oop', 'dbms', 'os', 'networks'],
  'Languages':    ['java', 'python', 'javascript', 'typescript', 'c\\+\\+', 'c#', '\\bc\\b', 'go'],
  'Web':          ['react', 'next\\.js', 'node\\.js', 'express', 'rest', 'graphql'],
  'Data':         ['sql', 'mongodb', 'postgresql', 'mysql', 'redis'],
  'Cloud/DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'linux'],
  'Testing':      ['selenium', 'cypress', 'playwright', 'junit', 'pytest'],
}

// Display labels for regex keys
const DISPLAY = {
  'c\\+\\+': 'C++', 'c#': 'C#', '\\bc\\b': 'C',
  'next\\.js': 'Next.js', 'node\\.js': 'Node.js',
  'ci/cd': 'CI/CD',
}
const label = (key) => DISPLAY[key] ?? key.charAt(0).toUpperCase() + key.slice(1)

// ── 1. Skill Extraction ───────────────────────────────────
export function extractSkills(jdText) {
  const text = jdText.toLowerCase()
  const result = {}

  for (const [category, keywords] of Object.entries(SKILL_MAP)) {
    const found = keywords.filter((kw) => new RegExp(kw, 'i').test(text))
    if (found.length) result[category] = found.map(label)
  }

  if (Object.keys(result).length === 0) {
    result['General'] = ['General fresher stack']
  }

  return result
}

// ── 2. Readiness Score ────────────────────────────────────
export function calcScore({ extractedSkills, company, role, jdText }) {
  let score = 35
  const categories = Object.keys(extractedSkills).filter((c) => c !== 'General')
  score += Math.min(categories.length * 5, 30)
  if (company?.trim()) score += 10
  if (role?.trim())    score += 10
  if (jdText?.length > 800) score += 10
  return Math.min(score, 100)
}

// ── 3. Round-wise Checklist ───────────────────────────────
export function buildChecklist(extractedSkills) {
  const has = (cat) => Boolean(extractedSkills[cat])
  const hasSkill = (skill) =>
    Object.values(extractedSkills).flat().some((s) => s.toLowerCase() === skill.toLowerCase())

  const rounds = [
    {
      round: 'Round 1 — Aptitude & Basics',
      items: [
        'Revise quantitative aptitude: ratios, percentages, time-speed',
        'Practice logical reasoning: series, syllogisms, puzzles',
        'Revise verbal ability: reading comprehension, sentence correction',
        'Solve 20 aptitude questions under timed conditions',
        'Review number systems and basic math shortcuts',
        has('Core CS') ? 'Brush up OS fundamentals: processes, threads, scheduling' : 'Review basic computer science concepts',
        has('Core CS') ? 'Revise DBMS: normalization, ACID, transactions' : 'Understand data storage basics',
      ],
    },
    {
      round: 'Round 2 — DSA & Core CS',
      items: [
        'Arrays, strings, and hashing — solve 5 problems each',
        'Linked lists, stacks, queues — implement from scratch',
        'Trees and graphs — BFS, DFS, shortest path',
        hasSkill('dsa') ? 'Dynamic programming — top 10 classic problems' : 'Recursion and backtracking basics',
        'Sorting algorithms — merge sort, quick sort, time complexity',
        has('Core CS') ? 'OS: deadlocks, memory management, virtual memory' : 'Understand Big-O notation deeply',
        has('Core CS') ? 'Networks: TCP/IP, HTTP, DNS, OSI model' : 'Review system fundamentals',
        has('Data') ? 'SQL queries: joins, subqueries, window functions' : 'Practice problem-solving patterns',
      ],
    },
    {
      round: 'Round 3 — Technical Interview',
      items: [
        'Prepare 2-3 strong project explanations (STAR format)',
        has('Web') ? 'Deep-dive into your primary framework (React/Node/Next.js)' : 'Review your primary tech stack thoroughly',
        hasSkill('react') ? 'React: hooks, lifecycle, state management, performance' : 'Review frontend/backend architecture',
        hasSkill('sql') || hasSkill('mongodb') ? 'Database design: schema, indexing, query optimization' : 'Understand data modeling basics',
        has('Cloud/DevOps') ? 'Cloud/DevOps: deployment pipeline, containers, CI/CD' : 'Understand software deployment basics',
        has('Testing') ? 'Testing: unit tests, integration tests, test coverage' : 'Understand testing principles',
        'System design basics: load balancing, caching, scalability',
        'Code quality: clean code, SOLID principles, design patterns',
      ],
    },
    {
      round: 'Round 4 — Managerial & HR',
      items: [
        'Prepare "Tell me about yourself" — 90-second version',
        'List 3 strengths with concrete examples from projects',
        'Prepare answers for: conflict resolution, failure, teamwork',
        'Research the company: products, culture, recent news',
        'Prepare 5 thoughtful questions to ask the interviewer',
        'Practice salary negotiation and offer evaluation',
        'Review your resume line-by-line — be ready to defend every point',
      ],
    },
  ]

  return rounds
}

// ── 4. 7-Day Plan ─────────────────────────────────────────
export function buildPlan(extractedSkills) {
  const hasSkill = (skill) =>
    Object.values(extractedSkills).flat().some((s) => s.toLowerCase() === skill.toLowerCase())
  const has = (cat) => Boolean(extractedSkills[cat])

  return [
    {
      day: 'Day 1–2',
      theme: 'Basics & Core CS',
      tasks: [
        'Revise OS: processes, threads, memory management, scheduling',
        'Revise DBMS: normalization, ACID, ER diagrams, transactions',
        has('Core CS') ? 'Revise Networks: OSI model, TCP/IP, HTTP/HTTPS, DNS' : 'Review computer science fundamentals',
        'Solve 10 aptitude problems (time, speed, logical reasoning)',
        hasSkill('sql') ? 'Practice SQL: joins, aggregations, subqueries' : 'Review data structures theory',
      ],
    },
    {
      day: 'Day 3–4',
      theme: 'DSA & Coding Practice',
      tasks: [
        'Arrays & strings: sliding window, two pointers — 6 problems',
        'Trees & graphs: BFS, DFS, cycle detection — 4 problems',
        hasSkill('dsa') ? 'Dynamic programming: memoization vs tabulation — 4 problems' : 'Recursion and divide-and-conquer — 4 problems',
        'Sorting & searching: binary search variants — 3 problems',
        'Practice on a timed mock coding round (45 min)',
      ],
    },
    {
      day: 'Day 5',
      theme: 'Projects & Resume Alignment',
      tasks: [
        'Write STAR-format explanations for your top 2 projects',
        hasSkill('react') ? 'Revise React: hooks, context, performance optimization' : has('Web') ? 'Revise your primary web framework deeply' : 'Review your primary tech stack',
        hasSkill('docker') || hasSkill('aws') ? 'Review deployment: Docker, CI/CD, cloud setup of your projects' : 'Understand how your projects are deployed',
        'Audit your resume: quantify impact, remove weak points',
        'Prepare GitHub — clean READMEs, pinned repos, commit history',
      ],
    },
    {
      day: 'Day 6',
      theme: 'Mock Interview Practice',
      tasks: [
        'Do a full 45-min mock coding interview (use Pramp or a peer)',
        'Practice 5 behavioral questions out loud (record yourself)',
        has('Web') ? 'Answer 5 framework-specific questions without notes' : 'Answer 5 technical questions without notes',
        hasSkill('sql') || hasSkill('mongodb') ? 'Whiteboard a database schema for a real-world system' : 'Whiteboard a system design for a simple app',
        'Review all mistakes from Days 1–5',
      ],
    },
    {
      day: 'Day 7',
      theme: 'Revision & Weak Areas',
      tasks: [
        'Re-solve 3 problems you got wrong earlier',
        'Re-read your project explanations and refine them',
        'Quick-revise: OS, DBMS, Networks — key concepts only',
        has('Cloud/DevOps') ? 'Review cloud/DevOps concepts you are less confident about' : 'Review any topic you feel least confident about',
        'Sleep well, prepare documents, plan your interview day logistics',
      ],
    },
  ]
}

// ── 5. Interview Questions ────────────────────────────────
export function buildQuestions(extractedSkills) {
  const hasSkill = (skill) =>
    Object.values(extractedSkills).flat().some((s) => s.toLowerCase() === skill.toLowerCase())
  const has = (cat) => Boolean(extractedSkills[cat])

  const pool = [
    // Always included
    { q: 'Walk me through your most complex project end-to-end.', always: true },
    { q: 'How do you approach debugging a production issue you have never seen before?', always: true },

    // Conditional
    { q: 'Explain indexing in databases — when does it help and when does it hurt?', when: () => hasSkill('sql') || hasSkill('dbms') },
    { q: 'What is the difference between SQL and NoSQL? When would you choose MongoDB over PostgreSQL?', when: () => hasSkill('mongodb') || hasSkill('postgresql') },
    { q: 'Explain state management options in React and when you would use each.', when: () => hasSkill('react') },
    { q: 'How does the React reconciliation algorithm (virtual DOM diffing) work?', when: () => hasSkill('react') },
    { q: 'How would you optimize search in a large sorted dataset?', when: () => hasSkill('dsa') || has('Core CS') },
    { q: 'Explain the difference between BFS and DFS — give a real use case for each.', when: () => hasSkill('dsa') || has('Core CS') },
    { q: 'What happens when you type a URL in the browser and press Enter?', when: () => has('Web') || hasSkill('networks') },
    { q: 'Explain REST vs GraphQL — what are the trade-offs?', when: () => hasSkill('rest') || hasSkill('graphql') },
    { q: 'How does Docker differ from a virtual machine? Explain layers and image caching.', when: () => hasSkill('docker') },
    { q: 'Describe a CI/CD pipeline you have set up or worked with.', when: () => hasSkill('ci/cd') || has('Cloud/DevOps') },
    { q: 'What is the difference between process and thread? Explain context switching.', when: () => hasSkill('os') || has('Core CS') },
    { q: 'Explain ACID properties with a real-world transaction example.', when: () => hasSkill('dbms') || hasSkill('sql') },
    { q: 'How does Python\'s GIL affect multi-threaded programs?', when: () => hasSkill('python') },
    { q: 'Explain Java\'s memory model: heap, stack, garbage collection.', when: () => hasSkill('java') },
    { q: 'What are TypeScript generics and when would you use them?', when: () => hasSkill('typescript') },
    { q: 'How would you write a test strategy for a feature you just built?', when: () => has('Testing') },
    { q: 'Explain the difference between unit, integration, and end-to-end tests.', when: () => has('Testing') },
    { q: 'What is Redis used for? Explain cache invalidation strategies.', when: () => hasSkill('redis') },
    { q: 'Describe the CAP theorem and how it applies to distributed systems.', when: () => has('Cloud/DevOps') || has('Data') },
  ]

  const selected = [
    ...pool.filter((p) => p.always),
    ...pool.filter((p) => p.when && p.when()),
  ]

  // Deduplicate and cap at 10
  const seen = new Set()
  const unique = selected.filter(({ q }) => {
    if (seen.has(q)) return false
    seen.add(q)
    return true
  })

  // If fewer than 10, pad with generic but useful questions
  const fallback = [
    'Describe a time you had to learn a new technology quickly under pressure.',
    'How do you ensure code quality in a team environment?',
    'What is your approach to estimating task complexity?',
    'How do you handle disagreements with a teammate on a technical decision?',
    'Where do you see yourself in 3 years, and how does this role fit that path?',
  ]

  const result = [...unique]
  for (const f of fallback) {
    if (result.length >= 10) break
    result.push({ q: f })
  }

  return result.slice(0, 10).map((item, i) => ({ id: i + 1, question: item.q }))
}

// ── Master analyze function ───────────────────────────────
// Returns raw analysis result (not the full entry — Practice.jsx builds the entry)
export function analyze({ company, role, jdText }) {
  const rawSkills      = extractSkills(jdText)
  // Apply fallback if nothing detected (schema.js also does this, belt-and-suspenders)
  const extractedSkills = Object.keys(rawSkills).length === 0
    ? { 'General': ['Communication', 'Problem Solving', 'Basic Coding', 'Projects'] }
    : rawSkills

  const readinessScore = calcScore({ extractedSkills, company, role, jdText })
  const checklist      = buildChecklist(extractedSkills)
  const plan           = buildPlan(extractedSkills)
  const questions      = buildQuestions(extractedSkills)
  const companyIntel   = buildCompanyIntel({ company, jdText, extractedSkills })

  return { extractedSkills, readinessScore, checklist, plan, questions, companyIntel }
}
