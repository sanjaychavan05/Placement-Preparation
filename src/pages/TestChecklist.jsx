import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, RotateCcw, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react'
import {
  TEST_ITEMS,
  loadChecklist,
  saveChecklist,
  resetChecklist,
  allPassed,
  passedCount,
} from '../lib/testChecklist'

const PRIMARY = 'hsl(245, 58%, 51%)'
const TOTAL   = TEST_ITEMS.length

export default function TestChecklist() {
  const navigate = useNavigate()
  const [checks, setChecks]     = useState({})
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    setChecks(loadChecklist())
  }, [])

  function toggle(id) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveChecklist(next)
      return next
    })
  }

  function toggleHint(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleReset() {
    if (window.confirm('Reset all test results? This cannot be undone.')) {
      resetChecklist()
      setChecks(loadChecklist())
    }
  }

  const passed  = passedCount(checks)
  const allDone = allPassed(checks)

  return (
    <div className="max-w-2xl mx-auto">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Checklist</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manually verify every feature before shipping. All 10 must pass.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-400 flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset checklist
        </button>
      </div>

      {/* Summary card */}
      <div className={`rounded-2xl border p-5 mb-6 ${allDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {allDone
              ? <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              : <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            }
            <div>
              <p className={`text-lg font-bold ${allDone ? 'text-emerald-800' : 'text-gray-900'}`}>
                Tests Passed: {passed} / {TOTAL}
              </p>
              {!allDone && (
                <p className="text-sm text-amber-700 mt-0.5">
                  Fix issues before shipping. {TOTAL - passed} test{TOTAL - passed !== 1 ? 's' : ''} remaining.
                </p>
              )}
              {allDone && (
                <p className="text-sm text-emerald-700 mt-0.5">
                  All tests passed. You are clear to ship.
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-shrink-0 w-28">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(passed / TOTAL) * 100}%`,
                  backgroundColor: allDone ? '#3A6B4A' : PRIMARY,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{Math.round((passed / TOTAL) * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Test items */}
      <div className="space-y-2">
        {TEST_ITEMS.map(({ id, label, hint }, idx) => {
          const isChecked  = checks[id] === true
          const isExpanded = expanded[id] === true

          return (
            <div
              key={id}
              className={`bg-white rounded-xl border transition-colors ${
                isChecked ? 'border-emerald-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                {/* Number */}
                <span className="text-xs font-semibold text-gray-400 w-5 flex-shrink-0 text-right">
                  {idx + 1}
                </span>

                {/* Checkbox */}
                <button
                  onClick={() => toggle(id)}
                  className="flex-shrink-0 transition-transform active:scale-95"
                  aria-label={isChecked ? 'Mark as not passed' : 'Mark as passed'}
                >
                  {isChecked
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                  }
                </button>

                {/* Label */}
                <span className={`flex-1 text-sm font-medium leading-snug ${
                  isChecked ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'
                }`}>
                  {label}
                </span>

                {/* Hint toggle */}
                <button
                  onClick={() => toggleHint(id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                >
                  How to test
                  {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5" />
                    : <ChevronDown className="w-3.5 h-3.5" />
                  }
                </button>
              </div>

              {/* Hint panel */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 ml-8">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-indigo-700 leading-relaxed">{hint}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA to Ship */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/app/ship')}
          disabled={!allDone}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
            allDone
              ? 'text-white hover:opacity-90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={allDone ? { backgroundColor: PRIMARY } : {}}
        >
          {allDone
            ? <><ShieldCheck className="w-4 h-4" /> Proceed to Ship<ArrowRight className="w-4 h-4" /></>
            : <>Complete all {TOTAL - passed} remaining test{TOTAL - passed !== 1 ? 's' : ''} to unlock Ship</>
          }
        </button>
      </div>

    </div>
  )
}
