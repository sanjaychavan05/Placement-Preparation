import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage    from './pages/LandingPage'
import DashboardShell from './layouts/DashboardShell'
import Dashboard      from './pages/Dashboard'
import Practice       from './pages/Practice'
import Assessments    from './pages/Assessments'
import Resources      from './pages/Resources'
import Profile        from './pages/Profile'
import Results        from './pages/Results'
import History        from './pages/History'
import TestChecklist  from './pages/TestChecklist'
import Ship           from './pages/Ship'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<DashboardShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"      element={<Dashboard />} />
          <Route path="practice"       element={<Practice />} />
          <Route path="assessments"    element={<Assessments />} />
          <Route path="resources"      element={<Resources />} />
          <Route path="profile"        element={<Profile />} />
          <Route path="results"        element={<Results />} />
          <Route path="history"        element={<History />} />
          <Route path="test-checklist" element={<TestChecklist />} />
          <Route path="ship"           element={<Ship />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
