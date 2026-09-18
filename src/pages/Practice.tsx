import { useState } from 'react'
import type { Approach, ConfidenceLevel, EcoDomain, MistakeCategory, PracticeMode, Question } from '../types'
import { useAppData } from '../hooks/useAppData'
import { selectForMode, getAllQuestions } from '../services/questionEngine'
import QuestionCard from '../components/QuestionCard'

const MODES: { mode: PracticeMode; label: string; desc: string }[] = [
  { mode: 'QuickPractice', label: 'Quick Practice', desc: '10 preguntas aleatorias' },
  { mode: 'FocusMode', label: 'Focus Mode', desc: 'Preguntas de un solo tema' },
  { mode: 'DomainPractice', label: 'Domain Practice', desc: 'People / Process / Business Environment' },
  { mode: 'ApproachPractice', label: 'Approach Practice', desc: 'Predictive / Agile / Hybrid' },
  { mode: 'WeakAreas', label: 'Weak Areas', desc: 'Tus temas más débiles' },
  { mode: 'MistakesRetry', label: 'Mistakes Retry', desc: 'Reintenta lo que fallaste' },
  { mode: 'RandomChallenge', label: 'Random Challenge', desc: 'Combinación aleatoria' },
  { mode: 'MindsetChallenge', label: 'PMP Mindset Challenge', desc: 'Casos de razonamiento situacional' },
]

export default function Practice() {
  const { data, setData } = useAppData()
  const [activeMode, setActiveMode] = useState<PracticeMode | null>(null)
  const [pendingTopic, setPendingTopic] = useState('')
  const [pendingDomain, setPendingDomain] = useState<EcoDomain>('People')
  const [pendingApproach, setPendingApproach] = useState<Approach>('Predictive')

  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null)

  const topics = Array.from(new Set(getAllQuestions().map((q) => q.topic)))

  const start = (mode: PracticeMode) => {
    const qs = selectForMode(mode, data, { topic: pendingTopic, domain: pendingDomain, approach: pendingApproach })
    if (qs.length === 0) return
    setQuestions(qs)
    setIndex(0)
    setResults(null)
    setActiveMode(mode)
  }

  const handleAnswer = (payload: {
    selected: 0 | 1 | 2 | 3
    confidence: ConfidenceLevel
    correct: boolean
    mistakeCategory?: MistakeCategory
  }) => {
    const q = questions[index]
    const attemptId = `attempt-${Date.now()}-${index}`
    setData((prev) => {
      const attempt = {
        id: attemptId,
        questionId: q.id,
        sessionId,
        selectedAnswer: payload.selected,
        correct: payload.correct,
        confidence: payload.confidence,
        timeSpentSeconds: 0,
        timestamp: new Date().toISOString(),
        mode: activeMode ?? 'QuickPractice',
      }
      const errorLog = payload.correct
        ? prev.errorLog
        : [
            ...prev.errorLog,
            {
              id: `err-${Date.now()}-${index}`,
              questionId: q.id,
              attemptId,
              topic: q.topic,
              domain: q.domain,
              selectedAnswer: payload.selected,
              correctAnswer: q.correctAnswer,
              mistakeCategory: payload.mistakeCategory ?? 'KnowledgeGap',
              mentalRule: q.mentalRule,
              date: new Date().toISOString(),
              occurrences: 1,
            },
          ]
      return { ...prev, attempts: [...prev.attempts, attempt], errorLog }
    })
  }

  const handleNext = () => {
    const isLast = index === questions.length - 1
    if (isLast) {
      const sessionAttempts = data.attempts.filter((a) => a.sessionId === sessionId)
      const correctCount = sessionAttempts.filter((a) => a.correct).length
      setResults({ correct: correctCount, total: questions.length })
      setData((prev) => ({
        ...prev,
        sessions: [
          ...prev.sessions,
          {
            id: sessionId,
            mode: activeMode ?? 'QuickPractice',
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
            questionIds: questions.map((q) => q.id),
            attemptIds: sessionAttempts.map((a) => a.id),
          },
        ],
        gamification: { ...prev.gamification, sessionsCompleted: prev.gamification.sessionsCompleted + 1 },
      }))
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (results) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-semibold">Session Review</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          {results.correct} correctas de {results.total} ({Math.round((results.correct / results.total) * 100)}%)
        </p>
        <button
          onClick={() => setActiveMode(null)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Volver a modos de práctica
        </button>
      </div>
    )
  }

  if (activeMode && questions.length > 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <QuestionCard
          question={questions[index]}
          index={index}
          total={questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Practice</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => (
          <div
            key={m.mode}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-medium">{m.label}</h3>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>

            {m.mode === 'FocusMode' && (
              <select
                value={pendingTopic}
                onChange={(e) => setPendingTopic(e.target.value)}
                className="mb-2 w-full rounded-md border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">Selecciona un tema…</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
            {m.mode === 'DomainPractice' && (
              <select
                value={pendingDomain}
                onChange={(e) => setPendingDomain(e.target.value as EcoDomain)}
                className="mb-2 w-full rounded-md border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="People">People</option>
                <option value="Process">Process</option>
                <option value="BusinessEnvironment">Business Environment</option>
              </select>
            )}
            {m.mode === 'ApproachPractice' && (
              <select
                value={pendingApproach}
                onChange={(e) => setPendingApproach(e.target.value as Approach)}
                className="mb-2 w-full rounded-md border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="Predictive">Predictive</option>
                <option value="Agile">Agile</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            )}

            <button
              onClick={() => start(m.mode)}
              className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white"
            >
              Empezar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
