import { useState } from 'react'
import type { ConfidenceLevel, MistakeCategory, Question } from '../types'
import { useAppData } from '../hooks/useAppData'
import { buildSimulation } from '../services/questionEngine'
import QuestionCard from '../components/QuestionCard'

const SIZES = [20, 30, 60, 90, 120]

export default function Simulator() {
  const { setData } = useAppData()
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [sessionId] = useState(() => `sim-${Date.now()}`)
  const [pendingAnswers, setPendingAnswers] = useState<
    Record<string, { selected: 0 | 1 | 2 | 3; confidence: ConfidenceLevel; correct: boolean; mistakeCategory?: MistakeCategory }>
  >({})
  const [finished, setFinished] = useState(false)

  const start = (size: number) => {
    setQuestions(buildSimulation(size))
    setIndex(0)
    setPendingAnswers({})
    setFinished(false)
  }

  const handleAnswer = (payload: {
    selected: 0 | 1 | 2 | 3
    confidence: ConfidenceLevel
    correct: boolean
    mistakeCategory?: MistakeCategory
  }) => {
    const q = questions[index]
    setPendingAnswers((prev) => ({ ...prev, [q.id]: payload }))
  }

  const finalize = () => {
    setData((prev) => {
      const attempts = questions.map((q, i) => {
        const ans = pendingAnswers[q.id]
        return {
          id: `attempt-sim-${sessionId}-${i}`,
          questionId: q.id,
          sessionId,
          selectedAnswer: ans?.selected ?? (0 as const),
          correct: !!ans?.correct,
          confidence: ans?.confidence ?? ('Guess' as ConfidenceLevel),
          timeSpentSeconds: 0,
          timestamp: new Date().toISOString(),
          mode: 'Simulator' as const,
        }
      })
      const newErrors = questions
        .map((q, i) => {
          const ans = pendingAnswers[q.id]
          if (!ans || ans.correct) return null
          return {
            id: `err-sim-${sessionId}-${i}`,
            questionId: q.id,
            attemptId: attempts[i].id,
            topic: q.topic,
            domain: q.domain,
            selectedAnswer: ans.selected,
            correctAnswer: q.correctAnswer,
            mistakeCategory: ans.mistakeCategory ?? ('KnowledgeGap' as MistakeCategory),
            mentalRule: q.mentalRule,
            date: new Date().toISOString(),
            occurrences: 1,
          }
        })
        .filter(Boolean) as typeof prev.errorLog

      return {
        ...prev,
        attempts: [...prev.attempts, ...attempts],
        errorLog: [...prev.errorLog, ...newErrors],
        sessions: [
          ...prev.sessions,
          {
            id: sessionId,
            mode: 'Simulator',
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
            questionIds: questions.map((q) => q.id),
            attemptIds: attempts.map((a) => a.id),
          },
        ],
      }
    })
    setFinished(true)
  }

  const handleNext = () => {
    if (index === questions.length - 1) {
      finalize()
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (finished) {
    const correct = Object.values(pendingAnswers).filter((a) => a.correct).length
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-semibold">Resultado del simulacro</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          {correct} correctas de {questions.length} ({Math.round((correct / questions.length) * 100)}%)
        </p>
        <button
          onClick={() => setQuestions([])}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Volver a simulacros
        </button>
      </div>
    )
  }

  if (questions.length > 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">
          Modo simulacro: no verás respuestas ni explicaciones hasta terminar todas las preguntas.
        </p>
        <QuestionCard
          question={questions[index]}
          index={index}
          total={questions.length}
          hideFeedbackUntilEnd
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Simulacros progresivos</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Distribución por dominio según el ECO vigente (julio 2026): People 33% · Process 41% · Business Environment
        26%.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => start(size)}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-2xl font-semibold">{size}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">preguntas</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400">
        Nota: el banco inicial tiene 10 preguntas curadas; simulacros grandes repetirán preguntas hasta que amplíes
        el banco con el generador (docs/question-generator-prompt.md).
      </p>
    </div>
  )
}
