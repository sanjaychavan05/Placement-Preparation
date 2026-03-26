import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  UserCircle,
  History,
  FileText,
  FlaskConical,
  Rocket,
} from 'lucide-react'

const navItems = [
  { to: '/app/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/app/practice',       label: 'JD Analyzer',    icon: Code2 },
  { to: '/app/results',        label: 'Results',        icon: FileText },
  { to: '/app/history',        label: 'History',        icon: History },
  { to: '/app/assessments',    label: 'Assessments',    icon: ClipboardList },
  { to: '/app/resources',      label: 'Resources',      icon: BookOpen },
  { to: '/app/profile',        label: 'Profile',        icon: UserCircle },
  { to: '/app/test-checklist', label: 'Test Checklist', icon: FlaskConical },
  { to: '/app/ship',           label: 'Ship',           icon: Rocket },
]

export default function DashboardShell() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="font-bold text-base tracking-tight" style={{ color: 'hsl(245, 58%, 51%)' }}>
            PlacementPrep
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: 'hsl(245, 58%, 51%)' } : {}
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 flex-shrink-0">
          <span className="font-semibold text-gray-800">Placement Prep</span>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: 'hsl(245, 58%, 51%)' }}
          >
            U
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
