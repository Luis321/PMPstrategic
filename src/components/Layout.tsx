import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppData } from '../hooks/useAppData'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/study-plan', label: 'Study Plan', icon: '🗓️' },
  { to: '/practice', label: 'Practice', icon: '🎯' },
  { to: '/simulator', label: 'Simulator', icon: '⏱️' },
  { to: '/error-log', label: 'Error Log', icon: '📋' },
  { to: '/patterns', label: 'Mis Patrones', icon: '🔍' },
  { to: '/mindset', label: 'PMP Mindset', icon: '🧠' },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout() {
  const { data, setData } = useAppData()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const theme = data.profile.theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
    root.classList.toggle('dark', isDark)
  }, [data.profile.theme])

  const toggleTheme = () => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, theme: prev.profile.theme === 'dark' ? 'light' : 'dark' },
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md p-2 text-lg md:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <span className="text-lg font-semibold tracking-tight">PMP Mastery Lab</span>
        </div>
        <button
          onClick={toggleTheme}
          className="rounded-md border border-slate-200 px-3 py-1 text-sm dark:border-slate-700"
        >
          {data.profile.theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <nav
          className={`${
            navOpen ? 'block' : 'hidden'
          } w-full shrink-0 border-b border-slate-200 bg-white px-3 py-4 dark:border-slate-800 dark:bg-slate-950 md:block md:w-56 md:border-b-0 md:border-r`}
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
