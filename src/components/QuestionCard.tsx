import { useState } from 'react'
import type { ConfidenceLevel, Question, MistakeCategory } from '../types'
import { MISTAKE_RULES } from '../services/analyticsEngine'

const CONFIDENCE_OPTIONS: ConfidenceLevel[] = ['Guess', 'NotSure', 'Confident', 'VeryConfident']
const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  Guess: 'Adivinando',
  NotSure: 'No muy seguro',
  Confident: 'Confiado',
  VeryConfident: 'Muy confiado',
}

const MISTAKE_OPTIONS: MistakeCategory[] = Object.keys(MISTAKE_RULES) as MistakeCategory[]

interface Props {
  question: Question
  index: number
  total: number
  hideFeedbackUntilEnd?: boolean
  onAnswer: (payload: {
    selected: 0 | 1 | 2 | 3
    confidence: ConfidenceLevel
    correct: boolean
    mistakeCategory?: MistakeCategory
  }) => void
  onNext: () => void
}

export default function QuestionCard({ question, index, total, hideFeedbackUntilEnd, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [mistakeCategory, setMistakeCategory] = useState<MistakeCategory>('KnowledgeGap')

  const correct = selected === question.correctAnswer

  const submit = () => {
    if (selected === null || confidence === null) return
    setSubmitted(true)
    onAnswer({
      selected: selected as 0 | 1 | 2 | 3,
      confidence,
      correct,
      mistakeCategory: correct ? undefined : mistakeCategory,
    })
  }

  const next = () => {
    setSelected(null)
    setConfidence(null)
    setSubmitted(false)
    setMistakeCategory('KnowledgeGap')
    onNext()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {question.domain === 'BusinessEnvironment' ? 'Business Environment' : question.domain}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {question.approach}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {question.difficulty}
        </span>
        <span className="ml-auto text-slate-400">
          {index + 1} / {total}
        </span>
      </div>

      <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {question.scenario}
      </p>
      <p className="mb-4 font-medium text-slate-900 dark:text-slate-100">{question.question}</p>

      <div className="space-y-2">
        {question.answers.map((answer, i) => {
          const isSelected = selected === i
          const isCorrectAnswer = submitted && i === question.correctAnswer
          const isWrongSelected = submitted && isSelected && i !== question.correctAnswer
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                isCorrectAnswer
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                  : isWrongSelected
                    ? 'border-red-500 bg-red-50 dark:bg-red-950'
                    : isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
              }`}
            >
              <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
              {answer}
              {!hideFeedbackUntilEnd && submitted && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {question.explanationPerAlternative[i]}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {!submitted && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">¿Con qué confianza respondes?</p>
          <div className="flex flex-wrap gap-2">
            {CONFIDENCE_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setConfidence(c)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  confidence === c
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {CONFIDENCE_LABELS[c]}
              </button>
            ))}
          </div>
          <button
            disabled={selected === null || confidence === null}
            onClick={submit}
            className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Responder
          </button>
        </div>
      )}

      {submitted && !hideFeedbackUntilEnd && (
        <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800/50">
          <p className={correct ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'}>
            {correct ? '✅ Correcto' : '❌ Incorrecto'}
          </p>
          <p>
            <span className="font-medium">Explicación: </span>
            {question.explanation}
          </p>
          <p>
            <span className="font-medium">Dominio: </span>
            {question.domain} · <span className="font-medium">Enfoque: </span>
            {question.approach} · <span className="font-medium">Tema: </span>
            {question.topic}
          </p>
          <p>
            <span className="font-medium">Mindset PMP: </span>
            {question.mindset}
          </p>
          <p className="italic">
            <span className="not-italic font-medium">Regla mental: </span>
            {question.mentalRule}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fuente: {question.source}</p>

          {!correct && (
            <div className="mt-2">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                ¿Cómo clasificarías este error? (puedes ajustarlo)
              </label>
              <select
                value={mistakeCategory}
                onChange={(e) => setMistakeCategory(e.target.value as MistakeCategory)}
                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                {MISTAKE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {MISTAKE_RULES[m].label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={next}
            className="mt-2 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Siguiente pregunta →
          </button>
        </div>
      )}

      {submitted && hideFeedbackUntilEnd && (
        <button
          onClick={next}
          className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Siguiente pregunta →
        </button>
      )}
    </div>
  )
}
