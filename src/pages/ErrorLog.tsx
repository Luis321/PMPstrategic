import { useAppData } from '../hooks/useAppData'
import { MISTAKE_RULES } from '../services/analyticsEngine'
import { getQuestionById } from '../services/questionEngine'
import type { MistakeCategory } from '../types'

export default function ErrorLog() {
  const { data, setData } = useAppData()

  const updateCategory = (entryId: string, category: MistakeCategory) => {
    setData((prev) => ({
      ...prev,
      errorLog: prev.errorLog.map((e) => (e.id === entryId ? { ...e, userOverrideCategory: category } : e)),
    }))
  }

  const sorted = [...data.errorLog].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Error Log</h1>
      {sorted.length === 0 && <p className="text-sm text-slate-500">Aún no tienes errores registrados. 🎉</p>}
      <div className="space-y-3">
        {sorted.map((entry) => {
          const q = getQuestionById(entry.questionId)
          const category = entry.userOverrideCategory ?? entry.mistakeCategory
          return (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{entry.topic}</p>
                <span className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              {q && <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{q.question}</p>}
              <p className="mb-2 text-xs text-slate-500">
                Tu respuesta: {String.fromCharCode(65 + entry.selectedAnswer)} · Correcta:{' '}
                {String.fromCharCode(65 + entry.correctAnswer)}
              </p>
              <p className="mb-2 text-xs italic text-slate-500">Regla aprendida: {q?.mentalRule}</p>
              <label className="mb-1 block text-xs font-medium text-slate-400">Clasificación del error</label>
              <select
                value={category}
                onChange={(e) => updateCategory(entry.id, e.target.value as MistakeCategory)}
                className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                {(Object.keys(MISTAKE_RULES) as MistakeCategory[]).map((m) => (
                  <option key={m} value={m}>
                    {MISTAKE_RULES[m].label}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}
