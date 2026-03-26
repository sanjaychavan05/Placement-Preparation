import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { CalendarClock, ChevronRight } from 'lucide-react'

// ── constants ──────────────────────────────────────────────
const PRIMARY = 'hsl(245, 58%, 51%)'
const SCORE = 72
const CIRCUMFERENCE = 2 * Math.PI * 70 // r=70 → ~440
const DASH_OFFSET = CIRCUMFERENCE * (1 - SCORE / 100)

const skillData = [
  { subject: 'DSA',           value: 75 },
  { subject: 'System Design', value: 60 },
  { subject: 'Communication', value: 80 },
  { subject: 'Resume',        value: 85 },
  { subject: 'Aptitude',      value: 70 },
]

const assessments = [
  { title: 'DSA Mock Test',        time: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', time: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep',    time: 'Friday, 11:00 AM' },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const activedays = [true, true, false, true, true, false, false]

// ── sub-components ─────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{children}</h2>
}

function ProgressBar({ value, max, className = '' }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: PRIMARY }}
      />
    </div>
  )
}

// ── 1. Overall Readiness ───────────────────────────────────
function ReadinessCard() {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardTitle>Overall Readiness</CardTitle>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* track */}
        <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="12" />
        {/* progress */}
        <circle
          cx="90"
          cy="90"
          r="70"
          fill="none"
          stroke={PRIMARY}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 90 90)"
          className="readiness-ring"
          style={{ '--dash-offset': DASH_OFFSET }}
        />
        <text x="90" y="86" textAnchor="middle" fontSize="36" fontWeight="700" fill="#111827">
          {SCORE}
        </text>
        <text x="90" y="108" textAnchor="middle" fontSize="12" fill="#6B7280">
          / 100
        </text>
      </svg>
      <p className="text-sm text-gray-500 -mt-2">Readiness Score</p>
    </Card>
  )
}

// ── 2. Skill Breakdown ─────────────────────────────────────
function SkillBreakdownCard() {
  return (
    <Card>
      <CardTitle>Skill Breakdown</CardTitle>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={skillData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <Radar
            dataKey="value"
            stroke={PRIMARY}
            fill={PRIMARY}
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 3, fill: PRIMARY }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── 3. Continue Practice ───────────────────────────────────
function ContinuePracticeCard() {
  return (
    <Card>
      <CardTitle>Continue Practice</CardTitle>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-base mb-1">Dynamic Programming</p>
          <p className="text-sm text-gray-400 mb-3">3 of 10 problems completed</p>
          <ProgressBar value={3} max={10} />
        </div>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: PRIMARY }}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

// ── 4. Weekly Goals ────────────────────────────────────────
function WeeklyGoalsCard() {
  return (
    <Card>
      <CardTitle>Weekly Goals</CardTitle>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-700 font-medium">Problems Solved</p>
          <p className="text-sm font-semibold text-gray-900">12 / 20 this week</p>
        </div>
        <ProgressBar value={12} max={20} />
      </div>
      <div className="flex justify-between mt-5">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
              style={
                activedays[i]
                  ? { backgroundColor: PRIMARY, color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
              }
            >
              {activedays[i] ? '✓' : ''}
            </div>
            <span className="text-xs text-gray-400">{day}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── 5. Upcoming Assessments ────────────────────────────────
function UpcomingAssessmentsCard() {
  return (
    <Card>
      <CardTitle>Upcoming Assessments</CardTitle>
      <ul className="space-y-3">
        {assessments.map(({ title, time }) => (
          <li
            key={title}
            className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <CalendarClock className="w-3 h-3" /> {time}
              </p>
            </div>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary-light)', color: PRIMARY }}
            >
              Upcoming
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Your placement journey continues here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ReadinessCard />
        <SkillBreakdownCard />
        <ContinuePracticeCard />
        <WeeklyGoalsCard />
        <div className="lg:col-span-2">
          <UpcomingAssessmentsCard />
        </div>
      </div>
    </div>
  )
}
