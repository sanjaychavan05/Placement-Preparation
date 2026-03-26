import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import {
  CheckCircle2, Circle, ChevronLeft,
  Copy, Download, Check, Building2, Info,
} from 'lucide-react'
import { getEntryById, getHistory, updateEntry } from '../lib/storage'
import { buildCompanyIntel } from '../lib/companyIntel'

const PRIMARY = 'hsl(245, 58%, 51%)'

// ── Primitives ─────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  )
}
function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
      {children}
    </h2>
  )
}

// ── Readiness Ring ─────────────────────────────────────────
function ReadinessRing({ score }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100)
  const color = score >= 75 ? '#3A6B4A' : score >= 50 ? PRIMARY : '#B45309'
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.4s ease' }}
        />
        <text x="80" y="76" textAnchor="middle" fontSize="30" fontWeight="700" fill="#111827">
          {score}
        </text>
        <text x="80" y="94" textAnchor="middle" fontSize="11" fill="#6B7280">/ 100</text>
      </svg>
      <p className="text-sm text-gray-500 -mt-1">Readiness Score</p>
      <p className="text-xs text-gray-400 mt-1">Updates as you rate skills below</p>
    </div>
  )
}

// ── Skill Tag with toggle ──────────────────────────────────
const CAT_COLORS = {
  'Core CS':      { base: 'bg-indigo-50 text-indigo-700 border-indigo-200',   know: 'bg-indigo-600 text-white border-indigo-600' },
  'Languages':    { base: 'bg-purple-50 text-purple-700 border-purple-200',   know: 'bg-purple-600 text-white border-purple-600' },
  'Web':          { base: 'bg-sky-50 text-sky-700 border-sky-200',            know: 'bg-sky-600 text-white border-sky-600' },
  'Data':         { base: 'bg-emerald-50 text-emerald-700 border-emerald-200',know: 'bg-emerald-600 text-white border-emerald-600' },
  'Cloud/DevOps': { base: 'bg-orange-50 text-orange-700 border-orange-200',   know: 'bg-orange-600 text-white border-orange-600' },
  'Testing':      { base: 'bg-pink-50 text-pink-700 border-pink-200',         know: 'bg-pink-600 text-white border-pink-600' },
  'General':      { base: 'bg-gray-100 text-gray-600 border-gray-200',        know: 'bg-gray-600 text-white border-gray-600' },
}

function SkillTag({ skill, category, confidence, onToggle }) {
  const isKnow = confidence === 'know'
  const colors = CAT_COLORS[category] ?? CAT_COLORS['General']
  return (
    <button
      onClick={() => onToggle(skill)}
      title={isKnow ? 'Click → Need practice' : 'Click → I know this'}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-150 ${
        isKnow ? colors.know : colors.base
      }`}
    >
      {isKnow
        ? <Check className="w-3 h-3 flex-shrink-0" />
        : <Circle className="w-3 h-3 flex-shrink-0 opacity-50" />
      }
      {skill}
    </button>
  )
}

// ── Checklist Round ────────────────────────────────────────
function ChecklistRound({ round, items }) {
  const [checked, setChecked] = useState({})
  return (
    <div className="mb-5 last:mb-0">
      <p className="text-sm font-semibold text-gray-800 mb-2">{round}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
            className="flex items-start gap-2 cursor-pointer group"
          >
            {checked[i]
              ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: PRIMARY }} />
              : <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300 group-hover:text-gray-400" />
            }
            <span className={`text-sm leading-relaxed ${checked[i] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Day Plan Row ───────────────────────────────────────────
function DayRow({ day, theme, tasks }) {
  return (
    <div className="flex gap-4 pb-5 last:pb-0 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-20 pt-0.5">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{day}</span>
        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{theme}</p>
      </div>
      <ul className="space-y-1 flex-1">
        {tasks.map((t, i) => (
          <li key={i} className="text-sm text-gray-700 flex gap-2">
            <span className="text-gray-300 flex-shrink-0">›</span>{t}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Copy button with feedback ──────────────────────────────
function CopyButton({ label, getText }) {
  const [copied, setCopied] = useState(false)
  function handle() {
    navigator.clipboard.writeText(getText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

// ── Export helpers ─────────────────────────────────────────
function planText(plan) {
  return plan.map(({ day, theme, tasks }) =>
    `${day} — ${theme}\n${tasks.map((t) => `  • ${t}`).join('\n')}`
  ).join('\n\n')
}

function checklistText(checklist) {
  return checklist.map(({ round, items }) =>
    `${round}\n${items.map((t) => `  ☐ ${t}`).join('\n')}`
  ).join('\n\n')
}

function questionsText(questions) {
  return questions.map(({ id, question }) => `${id}. ${question}`).join('\n')
}

function fullTxt(entry, liveScore) {
  const { company, role, createdAt, extractedSkills, checklist, questions } = entry
  const plan = entry.plan7Days ?? entry.plan ?? []
  const skillLines = Object.entries(extractedSkills)
    .map(([cat, skills]) => `  ${cat}: ${skills.join(', ')}`)
    .join('\n')
  return [
    `PLACEMENT PREP REPORT`,
    `Company: ${company}  |  Role: ${role}`,
    `Date: ${new Date(createdAt).toLocaleString()}`,
    `Readiness Score: ${liveScore} / 100`,
    ``,
    `── EXTRACTED SKILLS ──`,
    skillLines,
    ``,
    `── ROUND-WISE CHECKLIST ──`,
    checklistText(checklist),
    ``,
    `── 7-DAY PLAN ──`,
    planText(plan),
    ``,
    `── 10 INTERVIEW QUESTIONS ──`,
    questionsText(questions),
  ].join('\n')
}

function downloadTxt(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Company Intel Card ────────────────────────────────────
function CompanyIntelCard({ intel }) {
  const { companyName, industry, sizeLabel, sizeBadge, sizeBadgeColor, hiringFocus } = intel
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-1">
        <SectionTitle>Company Intel</SectionTitle>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${sizeBadgeColor}`}>
          {sizeBadge}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Company</p>
            <p className="text-sm font-semibold text-gray-900">{companyName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Industry</p>
            <p className="text-sm font-medium text-gray-800">{industry}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Size</p>
            <p className="text-sm font-medium text-gray-800">{sizeLabel}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Typical Hiring Focus</p>
          <p className="text-sm text-gray-700 leading-relaxed">{hiringFocus}</p>
        </div>
      </div>
      <p className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1">
        <Info className="w-3 h-3" />
        Demo Mode: Company intel generated heuristically.
      </p>
    </Card>
  )
}

// ── Round Timeline ────────────────────────────────────────
function RoundTimeline({ rounds }) {
  return (
    <Card className="lg:col-span-2">
      <SectionTitle>Interview Round Mapping</SectionTitle>
      <p className="text-xs text-gray-400 mb-5">Expected process based on company size and detected skills.</p>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-0">
          {rounds.map(({ number, title, focus, why }) => (
            <div key={number} className="relative flex gap-5 pb-7 last:pb-0">
              <div
                className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                {number}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">{title}</p>
                <p className="text-xs text-gray-500 mb-2">{focus}</p>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    <span className="font-semibold">Why this round matters: </span>{why}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1">
        <Info className="w-3 h-3" />
        Demo Mode: Round mapping generated heuristically.
      </p>
    </Card>
  )
}

// ── Action Next box ────────────────────────────────────────
function ActionNext({ weakSkills }) {
  const top3 = weakSkills.slice(0, 3)
  return (
    <Card className="border-l-4" style={{ borderLeftColor: PRIMARY }}>
      <SectionTitle>Action Next</SectionTitle>
      {top3.length === 0 ? (
        <p className="text-sm text-gray-700">
          All skills marked as known. You are well-prepared — do a full mock interview today.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Your top weak areas to address:
          </p>
          <ul className="space-y-1.5 mb-4">
            {top3.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-gray-900">
            → Start Day 1 plan now.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Focus on your weak skills during Days 1–2 before moving to DSA practice.
          </p>
        </>
      )}
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────
export default function Results() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const [entry, setEntry]               = useState(null)
  const [confidenceMap, setConfidenceMap] = useState({})  // skill → 'know' | 'practice'
  const [liveScore, setLiveScore]       = useState(0)

  // Load entry on mount / navigation
  useEffect(() => {
    let loaded = null
    if (state?.id) {
      loaded = getEntryById(state.id)
    } else {
      const { entries } = getHistory()
      if (entries.length) loaded = entries[0]
    }
    if (!loaded) return
    setEntry(loaded)

    // Restore saved confidence map; fall back to all 'practice'
    const allSkills = Object.values(loaded.extractedSkills).flat()
    const saved = loaded.skillConfidenceMap ?? {}
    const map = {}
    allSkills.forEach((s) => { map[s] = saved[s] ?? 'practice' })
    setConfidenceMap(map)
    // Use persisted finalScore if available, else compute from baseScore
    setLiveScore(loaded.finalScore ?? computeLiveScore(loaded.baseScore ?? loaded.readinessScore ?? 0, map))
  }, [state])

  function computeLiveScore(base, map) {
    const delta = Object.values(map).reduce((acc, v) => acc + (v === 'know' ? 2 : -2), 0)
    return Math.max(0, Math.min(100, base + delta))
  }

  // Toggle a skill — storage.updateEntry recomputes finalScore + stamps updatedAt
  const toggleSkill = useCallback((skill) => {
    setConfidenceMap((prev) => {
      const next = { ...prev, [skill]: prev[skill] === 'know' ? 'practice' : 'know' }
      const base = entry.baseScore ?? entry.readinessScore ?? 0
      setLiveScore(computeLiveScore(base, next))
      updateEntry(entry.id, { skillConfidenceMap: next })
      return next
    })
  }, [entry])

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 text-sm mb-4">No analysis found. Analyze a JD first.</p>
        <button
          onClick={() => navigate('/app/practice')}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: PRIMARY }}
        >
          Go to JD Analyzer
        </button>
      </div>
    )
  }

  const {
    company, role, createdAt,
    extractedSkills, checklist,
    plan7Days, questions,
  } = entry
  // plan7Days is the canonical field; fall back to legacy 'plan' for old entries
  const plan = plan7Days ?? entry.plan ?? []
  const intel = entry.companyIntel ?? buildCompanyIntel({ company, jdText: entry.jdText ?? '', extractedSkills })
  const weakSkills = Object.entries(confidenceMap)
    .filter(([, v]) => v === 'practice')
    .map(([k]) => k)

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-700 transition-colors mt-1"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company} — {role}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Export toolbar */}
        <div className="flex flex-wrap gap-2 flex-shrink-0">
          <CopyButton label="Copy 7-day plan"  getText={() => planText(plan)} />
          <CopyButton label="Copy checklist"   getText={() => checklistText(checklist)} />
          <CopyButton label="Copy questions"   getText={() => questionsText(questions)} />
          <button
            onClick={() => downloadTxt(fullTxt({ ...entry, plan }, liveScore), `${company || 'company'}-${role || 'role'}-prep.txt`.replace(/\s+/g, '-'))}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download TXT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Live Readiness Score */}
        <Card className="flex flex-col items-center justify-center">
          <SectionTitle>Readiness Score</SectionTitle>
          <ReadinessRing score={liveScore} />
        </Card>

        {/* Company Intel */}
        <CompanyIntelCard intel={intel} />

        {/* Round Timeline */}
        <div className="lg:col-span-2">
          <RoundTimeline rounds={intel.rounds} />
        </div>

        {/* Skill Self-Assessment */}
        <Card>
          <SectionTitle>Skill Self-Assessment</SectionTitle>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Click each skill to toggle between{' '}
            <span className="font-medium text-gray-600">I know this</span> (filled) and{' '}
            <span className="font-medium text-gray-600">Need practice</span> (outline).
            Score updates live.
          </p>
          <div className="space-y-4">
            {Object.entries(extractedSkills).map(([cat, skills]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-500 mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <SkillTag
                      key={s}
                      skill={s}
                      category={cat}
                      confidence={confidenceMap[s] ?? 'practice'}
                      onToggle={toggleSkill}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-indigo-600" />
              I know this (+2 pts each)
            </span>
            <span className="flex items-center gap-1.5">
              <Circle className="w-3 h-3" />
              Need practice (−2 pts each)
            </span>
          </div>
        </Card>

        {/* Round-wise Checklist */}
        <Card className="lg:col-span-2">
          <SectionTitle>Round-wise Preparation Checklist</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {checklist.map(({ round, items }) => (
              <ChecklistRound key={round} round={round} items={items} />
            ))}
          </div>
        </Card>

        {/* 7-Day Plan */}
        <Card className="lg:col-span-2">
          <SectionTitle>7-Day Preparation Plan</SectionTitle>
          <div className="space-y-0">
            {plan.map(({ day, theme, tasks }) => (
              <DayRow key={day} day={day} theme={theme} tasks={tasks} />
            ))}
          </div>
        </Card>

        {/* Interview Questions */}
        <Card className="lg:col-span-2">
          <SectionTitle>10 Likely Interview Questions</SectionTitle>
          <ol className="space-y-3">
            {questions.map(({ id, question }) => (
              <li key={id} className="flex gap-3 text-sm text-gray-700">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white mt-0.5"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {id}
                </span>
                <span className="leading-relaxed">{question}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Action Next */}
        <div className="lg:col-span-2">
          <ActionNext weakSkills={weakSkills} />
        </div>

      </div>
    </div>
  )
}
