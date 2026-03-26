// ─────────────────────────────────────────────────────────────
// storage.js  –  localStorage persistence helpers
// ─────────────────────────────────────────────────────────────
import { validateEntry, computeFinalScore } from './schema'

const KEY = 'pp_history'

// Returns { entries: Entry[], hasCorrupt: boolean }
export function getHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (!Array.isArray(raw)) return { entries: [], hasCorrupt: true }

    let hasCorrupt = false
    const entries = []

    for (const item of raw) {
      const { valid } = validateEntry(item)
      if (valid) {
        entries.push(item)
      } else {
        hasCorrupt = true
        // Log for debugging without crashing
        console.warn('[storage] Skipped corrupt entry:', item?.id ?? 'unknown')
      }
    }

    return { entries, hasCorrupt }
  } catch {
    return { entries: [], hasCorrupt: true }
  }
}

export function saveEntry(entry) {
  const { entries } = getHistory()
  entries.unshift(entry)
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function getEntryById(id) {
  const { entries } = getHistory()
  return entries.find((e) => e.id === id) ?? null
}

// Patches an entry; always stamps updatedAt.
// If skillConfidenceMap is in the patch, recomputes finalScore.
export function updateEntry(id, patch) {
  const { entries } = getHistory()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return

  const existing = entries[idx]
  const merged   = { ...existing, ...patch, updatedAt: new Date().toISOString() }

  // Keep finalScore in sync whenever confidence map changes
  if (patch.skillConfidenceMap) {
    merged.finalScore = computeFinalScore(merged.baseScore, merged.skillConfidenceMap)
  }

  entries[idx] = merged
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
