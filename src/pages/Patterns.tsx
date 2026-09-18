import { useAppData } from '../hooks/useAppData'
import { detectPatterns, MISTAKE_RULES } from '../services/analyticsEngine'

export default function Patterns() {
  const { data } = useAppData()
  const patterns = detectPatterns(data)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Mis Patrones</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Detectamos automáticamente errores que se repiten al menos 2 veces.
      </p>

      {patterns.length === 0 && (
        <p className="text-sm text-slate-500">
          Todavía no hay suficientes datos para detectar patrones. Sigue practicando.
        </p>
      )}

      <div className="space-y-3">
        {patterns.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-medium">{MISTAKE_RULES[p.mistakeCategory].label}</h3>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {p.frequency} veces
              </span>
            </div>
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{p.ruleDescription}</p>
            <p className="text-sm font-medium text-indigo-600">→ {p.recommendedPractice}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
