import type { ReactNode } from 'react'
import { useAppData } from '../hooks/useAppData'
import { computeDomainResults, computeTopicMastery } from '../services/analyticsEngine'
import { getQuestionById } from '../services/questionEngine'

export default function Analytics() {
  const { data } = useAppData()
  const domainResults = computeDomainResults(data)
  const mastery = Object.values(computeTopicMastery(data))

  const approachCounts: Record<string, { correct: number; total: number }> = {}
  data.attempts.forEach((a) => {
    const q = getQuestionById(a.questionId)
    if (!q) return
    approachCounts[q.approach] ??= { correct: 0, total: 0 }
    approachCounts[q.approach].total += 1
    if (a.correct) approachCounts[q.approach].correct += 1
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <Section title="Accuracy por dominio ECO">
        {domainResults.map((d) => (
          <Bar
            key={d.domain}
            label={d.domain === 'BusinessEnvironment' ? 'Business Environment' : d.domain}
            value={d.total ? Math.round(d.accuracy * 100) : 0}
            sub={`${d.correct}/${d.total}`}
          />
        ))}
      </Section>

      <Section title="Accuracy por enfoque (Predictive / Agile / Hybrid)">
        {Object.entries(approachCounts).map(([approach, c]) => (
          <Bar key={approach} label={approach} value={Math.round((c.correct / c.total) * 100)} sub={`${c.correct}/${c.total}`} />
        ))}
        {Object.keys(approachCounts).length === 0 && <p className="text-sm text-slate-500">Sin datos aún.</p>}
      </Section>

      <Section title="Dominio por tema">
        <div className="grid gap-2 sm:grid-cols-2">
          {mastery.map((m) => (
            <div key={m.topic} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
              <div className="mb-1 flex justify-between">
                <span>{m.topic}</span>
                <span className={m.mastered ? 'text-emerald-600' : 'text-amber-600'}>
                  {m.mastered ? '✅ Dominado' : `${Math.round(m.accuracyRecent * 100)}%`}
                </span>
              </div>
              <p className="text-xs text-slate-400">{m.questionsAnswered} preguntas respondidas</p>
            </div>
          ))}
          {mastery.length === 0 && <p className="text-sm text-slate-500">Sin datos aún.</p>}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 font-medium">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Bar({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-slate-500">
          {value}% ({sub})
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
