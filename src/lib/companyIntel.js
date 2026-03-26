// ─────────────────────────────────────────────────────────────
// companyIntel.js  –  Heuristic company intel + round mapping
// No external APIs. No scraping. Everything offline.
// ─────────────────────────────────────────────────────────────

// ── Known company registry ────────────────────────────────
const ENTERPRISE = new Set([
  'amazon', 'google', 'microsoft', 'meta', 'apple', 'netflix',
  'infosys', 'tcs', 'wipro', 'hcl', 'cognizant', 'accenture',
  'ibm', 'oracle', 'sap', 'salesforce', 'adobe', 'intel',
  'qualcomm', 'cisco', 'deloitte', 'capgemini', 'ltimindtree',
  'tech mahindra', 'mphasis', 'hexaware', 'persistent',
  'jpmorgan', 'goldman sachs', 'morgan stanley', 'wells fargo',
  'uber', 'airbnb', 'twitter', 'linkedin', 'spotify',
  'samsung', 'sony', 'lg', 'bosch', 'siemens',
])

const MIDSIZE = new Set([
  'freshworks', 'zoho', 'razorpay', 'phonepe', 'paytm',
  'swiggy', 'zomato', 'meesho', 'cred', 'groww', 'zerodha',
  'browserstack', 'postman', 'hasura', 'chargebee', 'leadsquared',
  'druva', 'icertis', 'mindtickle', 'unacademy', 'byju',
  'sharechat', 'moj', 'dailyhunt', 'nykaa', 'mamaearth',
  'atlassian', 'zendesk', 'hubspot', 'twilio', 'datadog',
  'hashicorp', 'confluent', 'elastic', 'mongodb', 'cockroachdb',
])

// ── Industry inference ────────────────────────────────────
const INDUSTRY_SIGNALS = [
  { keywords: ['bank', 'finance', 'fintech', 'payment', 'trading', 'insurance', 'wealth'], industry: 'Financial Technology' },
  { keywords: ['health', 'medical', 'hospital', 'pharma', 'clinical', 'biotech'],          industry: 'Healthcare & Life Sciences' },
  { keywords: ['ecommerce', 'e-commerce', 'retail', 'marketplace', 'shopping'],            industry: 'E-Commerce & Retail' },
  { keywords: ['edtech', 'education', 'learning', 'course', 'tutor', 'school'],            industry: 'Education Technology' },
  { keywords: ['game', 'gaming', 'unity', 'unreal', 'esport'],                             industry: 'Gaming & Entertainment' },
  { keywords: ['cloud', 'saas', 'platform', 'infrastructure', 'devops', 'kubernetes'],     industry: 'Cloud & Infrastructure' },
  { keywords: ['ai', 'machine learning', 'ml', 'data science', 'nlp', 'computer vision'], industry: 'Artificial Intelligence & Data' },
  { keywords: ['security', 'cybersecurity', 'soc', 'siem', 'penetration'],                 industry: 'Cybersecurity' },
  { keywords: ['logistics', 'supply chain', 'fleet', 'delivery', 'warehouse'],             industry: 'Logistics & Supply Chain' },
  { keywords: ['telecom', 'network', '5g', 'broadband', 'isp'],                            industry: 'Telecommunications' },
]

function inferIndustry(companyName, jdText) {
  const haystack = `${companyName} ${jdText}`.toLowerCase()
  for (const { keywords, industry } of INDUSTRY_SIGNALS) {
    if (keywords.some((k) => haystack.includes(k))) return industry
  }
  return 'Technology Services'
}

// ── Size classification ───────────────────────────────────
function classifySize(companyName) {
  const key = companyName.toLowerCase().trim()
  if (ENTERPRISE.has(key)) return 'enterprise'
  if (MIDSIZE.has(key))    return 'midsize'
  return 'startup'
}

const SIZE_META = {
  enterprise: {
    label:       'Enterprise (2000+ employees)',
    badge:       'Enterprise',
    badgeColor:  'bg-indigo-50 text-indigo-700 border-indigo-200',
    hiringFocus: 'Structured multi-round process. Heavy emphasis on DSA, core CS fundamentals, and system design. Expect online assessments with strict time limits before any human interview.',
  },
  midsize: {
    label:       'Mid-size (200–2000 employees)',
    badge:       'Mid-size',
    badgeColor:  'bg-sky-50 text-sky-700 border-sky-200',
    hiringFocus: 'Balanced process. Moderate DSA with strong focus on practical stack knowledge and project depth. Culture and team fit matter alongside technical ability.',
  },
  startup: {
    label:       'Startup (<200 employees)',
    badge:       'Startup',
    badgeColor:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    hiringFocus: 'Practical, fast-moving process. Prioritises stack depth, shipping ability, and problem-solving over theoretical CS. Expect take-home tasks or live coding on real problems.',
  },
}

// ── Round mapping engine ──────────────────────────────────
function buildRounds(size, extractedSkills) {
  const has      = (cat)   => Boolean(extractedSkills[cat])
  const hasSkill = (skill) =>
    Object.values(extractedSkills).flat().some((s) => s.toLowerCase() === skill.toLowerCase())

  const hasDSA     = hasSkill('dsa') || has('Core CS')
  const hasWeb     = has('Web')
  const hasData    = has('Data')
  const hasCloud   = has('Cloud/DevOps')
  const hasTesting = has('Testing')

  if (size === 'enterprise') {
    return [
      {
        number: 1,
        title:  'Online Assessment',
        focus:  hasDSA
          ? 'DSA (arrays, trees, DP) + Aptitude + Core CS MCQs'
          : 'Aptitude + Logical Reasoning + Basic CS MCQs',
        why:    'Filters a large applicant pool quickly. Expect 2–3 coding problems and 20–30 MCQs under 90 minutes. Accuracy and speed both matter.',
      },
      {
        number: 2,
        title:  'Technical Round 1 — DSA & Core CS',
        focus:  'Data structures, algorithms, OS, DBMS, Networks',
        why:    'Tests depth of CS fundamentals. Interviewers probe time/space complexity, edge cases, and your ability to optimise solutions under pressure.',
      },
      {
        number: 3,
        title:  'Technical Round 2 — Stack & Projects',
        focus:  [
          hasWeb   ? 'Framework depth (React/Node/Next.js)' : null,
          hasData  ? 'Database design & query optimisation'  : null,
          hasCloud ? 'Cloud/DevOps architecture'             : null,
          'Project walkthrough (STAR format)',
        ].filter(Boolean).join(', ') || 'Tech stack + project deep-dive',
        why:    'Validates that you can build real systems, not just solve toy problems. Prepare to defend every architectural decision in your projects.',
      },
      {
        number: 4,
        title:  'System Design',
        focus:  'Scalability, load balancing, caching, database sharding, API design',
        why:    'Assesses senior thinking even for fresher roles at large companies. Show structured thinking: clarify requirements → estimate scale → design components.',
      },
      {
        number: 5,
        title:  'HR & Managerial',
        focus:  'Behavioural questions, culture fit, career goals, compensation',
        why:    'Final gate. Interviewers check communication, self-awareness, and alignment with company values. Prepare STAR stories for conflict, failure, and leadership.',
      },
    ]
  }

  if (size === 'midsize') {
    return [
      {
        number: 1,
        title:  hasDSA ? 'Online Test — DSA + Aptitude' : 'Screening Call or Online Test',
        focus:  hasDSA ? 'Moderate DSA problems + aptitude' : 'Aptitude + basic coding',
        why:    'Initial filter. Usually 1–2 coding problems of medium difficulty. Speed matters less than correctness and clean code.',
      },
      {
        number: 2,
        title:  'Technical Interview — Stack & Problem Solving',
        focus:  [
          hasWeb     ? 'Framework-specific questions'    : null,
          hasData    ? 'Database & query design'         : null,
          hasTesting ? 'Testing approach & code quality' : null,
          'Live coding or whiteboard problem',
        ].filter(Boolean).join(', ') || 'Tech stack + live coding',
        why:    'Core technical evaluation. Interviewers want to see how you think through problems and whether you know your stack deeply enough to be productive from day one.',
      },
      {
        number: 3,
        title:  'Project & System Discussion',
        focus:  'Architecture decisions, trade-offs, scalability thinking',
        why:    'Mid-size companies care about ownership. Be ready to explain why you made specific choices and what you would do differently now.',
      },
      {
        number: 4,
        title:  'Culture Fit & HR',
        focus:  'Team dynamics, growth mindset, role expectations',
        why:    'Smaller teams mean culture fit is weighted heavily. Show genuine curiosity about the product and the team.',
      },
    ]
  }

  // startup
  return [
    {
      number: 1,
      title:  hasWeb ? 'Practical Coding Task' : 'Take-home or Live Coding',
      focus:  hasWeb
        ? `Build a small feature using ${Object.values(extractedSkills['Web'] ?? []).slice(0, 2).join('/')} or solve a real product problem`
        : 'Solve a practical problem relevant to the role',
      why:    'Startups skip theory and go straight to "can you ship?". Expect a real-world task, not LeetCode. Clean code, good naming, and a working solution matter most.',
    },
    {
      number: 2,
      title:  'System & Architecture Discussion',
      focus:  [
        hasCloud ? 'Deployment, infra, CI/CD'    : null,
        hasData  ? 'Data modelling & DB choices' : null,
        'Trade-off reasoning, scalability basics',
      ].filter(Boolean).join(', ') || 'Architecture trade-offs and design thinking',
      why:    'Startups need engineers who think about the whole system. Show you understand trade-offs, not just implementation details.',
    },
    {
      number: 3,
      title:  'Founder / Team Culture Fit',
      focus:  'Motivation, ownership mindset, adaptability, communication',
      why:    'At a startup, every hire shapes the culture. Be honest about what you want to build and why this company specifically. Generic answers fail here.',
    },
  ]
}

// ── Master function ───────────────────────────────────────
export function buildCompanyIntel({ company, jdText, extractedSkills }) {
  const name    = company?.trim() || 'Unknown Company'
  const size    = classifySize(name)
  const meta    = SIZE_META[size]
  const industry = inferIndustry(name, jdText)
  const rounds  = buildRounds(size, extractedSkills)

  return {
    companyName:  name,
    industry,
    size,
    sizeLabel:    meta.label,
    sizeBadge:    meta.badge,
    sizeBadgeColor: meta.badgeColor,
    hiringFocus:  meta.hiringFocus,
    rounds,
  }
}
