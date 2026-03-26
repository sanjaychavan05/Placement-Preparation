import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import { analyze } from '../lib/analyzer'
import { saveEntry } from '../lib/storage'
import { buildEntry } from '../lib/schema'

const PRIMARY = 'hsl(245, 58%, 51%)'
const MIN_CHARS     = 1    // hard block — JD must not be empty
const WARN_CHARS    = 200  // soft warning — short JD degrades output quality

export default function Practice() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole]       = useState('')
  const [jdText, setJdText]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')   // hard block message
  const [warn, setWarn]       = useState(false) // soft warning flag

  function handleJdChange(e) {
    const val = e.target.value
    setJdText(val)
    // Clear hard error as user types
    if (error) setError('')
    // Show/hide soft warning
    setWarn(val.trim().length > 0 && val.trim().length < WARN_CHARS)
  }

  function handleAnalyze() {
    const trimmed = jdText.trim()

    // Hard validation — JD is required
    if (trimmed.length < MIN_CHARS) {
      setError('Job description is required. Paste the full JD to continue.')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      try {
        const analysisResult = analyze({ company, role, jdText: trimmed })
        const entry = buildEntry({
          company: company.trim(),
          role:    role.trim(),
          jdText:  trimmed,
          analysisResult,
        })
        saveEntry(entry)
        navigate('/app/results', { state: { id: entry.id } })
      } catch (err) {
        console.error('[Practice] Analysis failed:', err)
        setError('Something went wrong during analysis. Please try again.')
        setLoading(false)
      }
    }, 600)
  }

  const charCount  = jdText.length
  const isShort    = warn && charCount < WARN_CHARS
  const borderColor = error
    ? 'border-red-300 focus:border-red-400'
    : isShort
    ? 'border-amber-300 focus:border-amber-400'
    : 'border-gray-200 focus:border-indigo-400'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">JD Analyzer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste a job description and get a personalized preparation plan instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

        {/* Company + Role (optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 transition-colors"
              placeholder="e.g. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role / Position <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 transition-colors"
              placeholder="e.g. Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        {/* JD Text — required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description <span className="text-red-400 text-xs font-normal">required</span>
          </label>
          <textarea
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors resize-none leading-relaxed ${borderColor}`}
            rows={12}
            placeholder="Paste the full job description here…"
            value={jdText}
            onChange={handleJdChange}
          />

          {/* Character counter + contextual hint */}
          <div className="flex items-center justify-between mt-1.5">
            <span className={`text-xs ${isShort ? 'text-amber-600' : 'text-gray-400'}`}>
              {charCount} characters
              {charCount >= 800 && <span className="text-emerald-600 ml-1">— full score unlocked</span>}
            </span>
            <span className="text-xs text-gray-400">800+ for highest readiness score</span>
          </div>
        </div>

        {/* Soft warning — short JD */}
        {isShort && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              This JD is too short to analyze deeply. Paste the full JD for better output.
            </p>
          </div>
        )}

        {/* Hard error */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: PRIMARY }}
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
            : <><Sparkles className="w-4 h-4" /> Analyze JD</>
          }
        </button>
      </div>
    </div>
  )
}
