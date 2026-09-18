import { Link } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { computeDomainResults, computeReadiness } from '../services/analyticsEngine'

export default function Dashboard() {
  const { data } = useAppData()
  const readiness = computeReadiness(data)
  const domainResults = computeDomainResults(data)
  const totalQuestions = data.attempts.length
  const correct = data.attempts.filter((a) => a.correct).length
  const accuracy = totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0
  const currentWeek =
    data.studyPlan?.weeks.find((w) => w.startDate && w.endDate && isWithin(w.startDate, w.endDate)) ??
    data.studyPlan?.weeks[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {data.profile.name ? `Hola, ${data.profile.name} 👋` : 'Tu progreso PMP'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">¿Cómo voy?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="PMP Readiness" value={`${readiness}%`} accent />
        <StatCard label="Preguntas respondidas" value={String(totalQuestions)} />
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Racha" value={`${data.gamification.streakDays} días`} />
      </div>

      <p className="rounded-lg bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        El Readiness es un indicador interno de preparación dentro de PMP Mastery Lab y no corresponde a una
        calificación oficial de PMI.
      </p>

      {currentWeek && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-1 font-medium">Semana {currentWeek.weekNumber}: {currentWeek.objective}</h2>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Temas: {currentWeek.topics.join(', ')}</p>
          <Link to="/study-plan" className="text-sm font-medium text-indigo-600">
            Ver ruta completa →
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-medium">Dominios ECO (People 33% · Process 41% · Business Environment 26%)</h2>
        <div className="space-y-3">
          {domainResults.map((d) => (
            <div key={d.domain}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{d.domain === 'BusinessEnvironment' ? 'Business Environment' : d.domain}</span>
                <span className="text-slate-500">
                  {d.total ? `${Math.round(d.accuracy * 100)}% (${d.correct}/${d.total})` : 'Sin datos'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-indigo-600"
                  style={{ width: `${Math.round(d.accuracy * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/practice" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
          Practicar ahora
        </Link>
        <Link
          to="/simulator"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
        >
          Ir a un simulacro
        </Link>
      </div>
    </div>
  )
}

function isWithin(start: string, end: string): boolean {
  const now = new Date().toISOString().slice(0, 10)
  return now >= start && now <= end
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
