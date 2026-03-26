import { useNavigate } from 'react-router-dom'
import { Code2, Video, BarChart2 } from 'lucide-react'

const features = [
  {
    icon: <Code2 className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />,
    title: 'Practice Problems',
    desc: 'Solve curated coding challenges across all difficulty levels.',
  },
  {
    icon: <Video className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />,
    title: 'Mock Interviews',
    desc: 'Simulate real interviews with timed sessions and feedback.',
  },
  {
    icon: <BarChart2 className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />,
    title: 'Track Progress',
    desc: 'Visualize your growth and identify areas to improve.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--color-primary)' }}>
          PlacementPrep
        </span>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-6 py-24 bg-gradient-to-b from-white to-indigo-50">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Ace Your Placement
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-10">
          Practice, assess, and prepare for your dream job
        </p>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="px-8 py-3 rounded-xl text-white font-semibold text-base shadow-md transition-opacity hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
          Everything you need to get placed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} PlacementPrep. All rights reserved.
      </footer>
    </div>
  )
}
