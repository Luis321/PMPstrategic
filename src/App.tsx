import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppDataProvider, useAppData } from './hooks/useAppData'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import StudyPlanPage from './pages/StudyPlanPage'
import Practice from './pages/Practice'
import Simulator from './pages/Simulator'
import ErrorLog from './pages/ErrorLog'
import Patterns from './pages/Patterns'
import Mindset from './pages/Mindset'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function Gate() {
  const { data } = useAppData()
  if (!data.profile.onboardingCompleted) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    )
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/study-plan" element={<StudyPlanPage />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/error-log" element={<ErrorLog />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/mindset" element={<Mindset />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Gate />
      </HashRouter>
    </AppDataProvider>
  )
}
