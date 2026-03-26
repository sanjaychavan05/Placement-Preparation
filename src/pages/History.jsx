import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, ChevronRight, AlertTriangle } from 'lucide-react'
import { getHistory, clearHistory } from '../lib/storage'

const PRIMARY = 'hsl(245, 58%, 51%)'

function ScorePill({ score }) {
  const color =
    score >= 75 ? 'bg-emerald-50 text-emerald-700' :
    score >= 50 ? 'bg-indigo-50 text-indigo-700'   :
                  'bg-orange-50 text-orange-700'
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
      {score} / 100
    </span>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [entries, setEntries]       = useState([])
  const [hasCorrupt, setHasCorrupt] = useState(false)

  useEffect(() => {
    const { entries: loaded, hasCorrupt: corrupt } = getHistory()
    setEntries(loaded)
    setHasCorrupt(corrupt)
  }, [])

  function handleClear() {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory()
      setEntries([])
      setHasCorrupt(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-sm text-gray-500 mt-1">
            {entries.length} saved {entries.length === 1 ? 'analysis' : 'analyses'}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Corruption warning */}
      {hasCorrupt && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            One saved entry couldn't be loaded and was skipped. Create a new analysis to continue.
          </p>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-gray-500 text-sm mb-4">No analysis history yet.</p>
          <button
            onClick={() => navigate('/app/practice')}
            className="text-sm font-medium px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Analyze a JD
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => navigate('/app/results', { state: { id: entry.id } })}
              className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {entry.company || 'Unknown Company'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {entry.role || 'Unknown Role'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.keys(entry.extractedSkills).map((cat) => (
                      <span key={cat} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Show finalScore (reflects skill toggles) */}
                  <ScorePill score={entry.finalScore ?? entry.baseScore ?? 0} />
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
