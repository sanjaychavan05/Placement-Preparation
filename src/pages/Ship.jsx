import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, ArrowLeft, Rocket, CheckCircle2 } from 'lucide-react'
import { loadChecklist, allPassed, passedCount, TEST_ITEMS } from '../lib/testChecklist'

const PRIMARY = 'hsl(245, 58%, 51%)'
const TOTAL   = TEST_ITEMS.length

const SHIP_STEPS = [
  'Run a final build: npm run build',
  'Deploy to your hosting provider (Vercel, Netlify, etc.)',
  'Verify the production URL loads correctly',
  'Confirm localStorage features work on the deployed URL',
  'Share the link — you shipped.',
]

export default function Ship() {
  const navigate = useNavigate()
  const [checks, setChecks] = useState({})

  useEffect(() => {
    setChecks(loadChecklist())
  }, [])

  const passed  = passedCount(checks)
  const unlocked = allPassed(checks)

  // ── Locked state ─────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Lock className="w-7 h-7 text-gray-400" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Ship is locked</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Complete all {TOTAL} tests in the Test Checklist before shipping.
            You have passed <span className="font-semibold text-gray-800">{passed} of {TOTAL}</span>.
          </p>

          {/* Mini progress */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(passed / TOTAL) * 100}%`, backgroundColor: PRIMARY }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/app/test-checklist')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PRIMARY }}
            >
              Go to Test Checklist
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Unlocked state ────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto">

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center mb-5">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ready to ship</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          All {TOTAL} tests passed. Your Placement Readiness Platform is verified and ready for deployment.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {TOTAL} / {TOTAL} tests passed
        </div>
      </div>

      {/* Ship steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Deployment Steps
        </h2>
        <ol className="space-y-3">
          {SHIP_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white mt-0.5"
                style={{ backgroundColor: PRIMARY }}
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: PRIMARY }}
          >
            <Rocket className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>

    </div>
  )
}
