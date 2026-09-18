import { useState } from 'react'
import { useAppData } from '../hooks/useAppData'
import { generateStudyPlan } from '../services/studyPlanGenerator'

export default function StudyPlanPage() {
  const { data, setData } = useAppData()
  const [examDate, setExamDate] = useState(data.profile.examDate ?? '')
  const [hours, setHours] = useState(data.profile.hoursPerWeek)
  const [openWeek, setOpenWeek] = useState<number | null>(1)

  const regenerate = () => {
    const plan = generateStudyPlan({
      startDate: new Date().toISOString().slice(0, 10),
      examDate: examDate || undefined,
      daysAvailable: data.profile.daysAvailable,
      hoursPerWeek: hours,
    })
    setData((prev) => ({
      ...prev,
      studyPlan: plan,
      profile: { ...prev.profile, examDate: examDate || undefined, hoursPerWeek: hours },
    }))
  }

  if (!data.studyPlan) {
    return (
      <div className="text-center">
        <p className="mb-4 text-slate-500">Aún no tienes una ruta de estudio.</p>
        <button onClick={regenerate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
          Generar ruta de 8 semanas
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold">Study Plan — 8 semanas</h1>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-slate-500">Fecha del examen</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="rounded-md border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Horas/semana</label>
            <input
              type="number"
              min={3}
              max={30}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <button onClick={regenerate} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white">
            Recalcular ruta
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {data.studyPlan.weeks.map((w) => (
          <div
            key={w.weekNumber}
            className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenWeek(openWeek === w.weekNumber ? null : w.weekNumber)}
            >
              <div>
                <p className="font-medium">
                  Semana {w.weekNumber} · {w.startDate} → {w.endDate}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{w.objective}</p>
              </div>
              <span className="text-slate-400">{openWeek === w.weekNumber ? '▲' : '▼'}</span>
            </button>
            {openWeek === w.weekNumber && (
              <div className="space-y-4 border-t border-slate-100 px-5 py-4 text-sm dark:border-slate-800">
                <Field label="Temas" value={w.topics.join(', ')} />
                <Field label="Conceptos clave" value={w.keyConcepts.join(', ')} />
                <Field label="Lectura recomendada" value={w.recommendedReading} />
                <Field label="Resultados esperados" value={w.expectedOutcomes.join(' · ')} />
                <Field label="Preguntas sugeridas" value={String(w.suggestedQuestionCount)} />
                <Field label="Reto de aplicación" value={w.applicationChallenge} />
                <Field label="Prueba corta" value={w.shortQuiz} />
                <Field label="Criterio de dominio" value={w.masteryCriteria} />

                <div>
                  <p className="mb-2 font-medium">Sesiones diarias</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {w.dailySessions.map((d) => (
                      <div key={d.day} className="rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                        <p className="font-medium">{d.day}</p>
                        <p className="text-slate-500 dark:text-slate-400">{d.focus}</p>
                        {d.minutesConcepts + d.minutesPractice + d.minutesErrorAnalysis > 0 && (
                          <p className="mt-1 text-slate-400">
                            {d.minutesConcepts}m concepto · {d.minutesPractice}m práctica · {d.minutesErrorAnalysis}m
                            errores · {d.suggestedQuestionCount} preguntas
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p>{value}</p>
    </div>
  )
}
