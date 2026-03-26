// ─────────────────────────────────────────────────────────────
// testChecklist.js  –  Test definitions + localStorage helpers
// ─────────────────────────────────────────────────────────────

const KEY = 'pp_test_checklist'

export const TEST_ITEMS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Go to JD Analyzer, leave the JD field empty, click Analyze. Confirm the red error banner appears and the page does not navigate.',
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Type 50 characters in the JD field. Confirm the amber warning "This JD is too short to analyze deeply" appears and the textarea border turns amber.',
  },
  {
    id: 'skill-extraction',
    label: 'Skill extraction groups correctly',
    hint: 'Paste a JD containing "React, SQL, Docker, DSA, Java". On Results, confirm skills appear under Web, Data, Cloud/DevOps, Core CS, and Languages categories respectively.',
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Analyze once with company "Amazon" (Enterprise → 5 rounds). Analyze again with an unknown company + React/Node (Startup → 3 rounds). Confirm the timelines differ.',
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Analyze the same JD text twice with identical company and role. Confirm both analyses produce the exact same baseScore.',
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'On Results, click a skill tag to mark it "I know this". Confirm the readiness ring score increases by 2. Click again to revert — score decreases by 2.',
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle several skills on Results, then hard-refresh (Ctrl+R / Cmd+R). Confirm the same skills are still toggled and the score matches.',
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Analyze a JD, go to History, confirm the entry appears with the correct company, role, and score. Click it — confirm Results loads the correct data.',
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'On Results, click "Copy 7-day plan" and paste into a text editor. Confirm it contains Day 1–2 through Day 7 with tasks. Repeat for "Copy checklist" and "Copy questions".',
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools Console. Visit Dashboard, JD Analyzer, Results, and History. Confirm zero red errors appear on any of these pages.',
  },
]

export function loadChecklist() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    // Ensure every test id is present; default to false
    const result = {}
    TEST_ITEMS.forEach(({ id }) => {
      result[id] = raw[id] === true
    })
    return result
  } catch {
    return Object.fromEntries(TEST_ITEMS.map(({ id }) => [id, false]))
  }
}

export function saveChecklist(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function resetChecklist() {
  localStorage.removeItem(KEY)
}

export function allPassed(state) {
  return TEST_ITEMS.every(({ id }) => state[id] === true)
}

export function passedCount(state) {
  return TEST_ITEMS.filter(({ id }) => state[id] === true).length
}
