import type {
  AppData,
  Attempt,
  DetectedPattern,
  DomainResult,
  EcoDomain,
  MistakeCategory,
  TopicMastery,
} from '../types'
import { getQuestionById } from './questionEngine'

const MISTAKE_RULES: Record<MistakeCategory, { label: string; rule: string; practice: string }> = {
  KnowledgeGap: {
    label: 'Vacío de conocimiento',
    rule: 'No conoces el concepto o proceso evaluado.',
    practice: 'Repasa el concepto en la guía antes de seguir practicando este tema.',
  },
  MisreadQuestion: {
    label: 'Lectura apresurada',
    rule: 'Leíste el escenario o la pregunta demasiado rápido y pasaste por alto un detalle clave.',
    practice: 'Practica leer el escenario completo dos veces antes de mirar las respuestas.',
  },
  ActedTooFast: {
    label: 'Actuaste antes de analizar',
    rule: 'Elegiste una acción inmediata cuando primero correspondía analizar la situación.',
    practice: 'Antes de elegir, pregúntate: ¿ya tengo suficiente información para actuar?',
  },
  EscalatedTooEarly: {
    label: 'Escalaste demasiado pronto',
    rule: 'Escalaste una decisión que podía resolverse colaborando dentro del equipo.',
    practice: 'Antes de escalar, determina si corresponde analizar, colaborar o resolver dentro del equipo.',
  },
  ConfusedRiskVsIssue: {
    label: 'Confundiste riesgo con issue',
    rule: 'Trataste un evento ya ocurrido como si fuera incierto y futuro (o viceversa).',
    practice: 'Practica 5 casos enfocados en diferenciar riesgo de issue.',
  },
  AgileMindsetError: {
    label: 'Error de mentalidad Agile',
    rule: 'Aplicaste un enfoque predictivo (control, aprobación previa) en un escenario Agile.',
    practice: 'Repasa los principios de autoorganización y servant leadership del Agile Practice Guide.',
  },
  ChangeControlError: {
    label: 'Error de control de cambios',
    rule: 'Aceptaste o ignoraste un cambio sin pasar por el proceso formal.',
    practice: 'Practica casos de control integrado de cambios en contexto predictivo.',
  },
  StakeholderError: {
    label: 'Error de gestión de stakeholders',
    rule: 'No consideraste adecuadamente el impacto o la involucración de un stakeholder clave.',
    practice: 'Repasa las estrategias de engagement de stakeholders.',
  },
  LeadershipError: {
    label: 'Error de liderazgo',
    rule: 'Reemplazaste colaboración por autoridad, o evitaste una responsabilidad de liderazgo.',
    practice: 'Practica casos de liderazgo situacional y toma de decisiones colaborativa.',
  },
  PredictiveProcessError: {
    label: 'Error de proceso predictivo',
    rule: 'No aplicaste correctamente un proceso o secuencia predictiva estándar.',
    practice: 'Repasa la secuencia de procesos del área de conocimiento correspondiente.',
  },
  BusinessValueError: {
    label: 'Error de valor de negocio',
    rule: 'No priorizaste o reevaluaste el valor de negocio ante un cambio de contexto.',
    practice: 'Practica casos centrados en caso de negocio y priorización por valor.',
  },
}

export function detectPatterns(data: AppData): DetectedPattern[] {
  const grouped = new Map<MistakeCategory, Attempt[]>()
  data.errorLog.forEach((entry) => {
    const attempt = data.attempts.find((a) => a.id === entry.attemptId)
    if (!attempt) return
    const cat = entry.userOverrideCategory ?? entry.mistakeCategory
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(attempt)
  })

  const patterns: DetectedPattern[] = []
  grouped.forEach((attempts, category) => {
    if (attempts.length < 2) return // require at least 2 occurrences to call it a "pattern"
    const meta = MISTAKE_RULES[category]
    patterns.push({
      id: `pattern-${category}`,
      mistakeCategory: category,
      frequency: attempts.length,
      exampleQuestionIds: attempts.slice(0, 3).map((a) => a.questionId),
      ruleDescription: meta.rule,
      recommendedPractice: meta.practice,
    })
  })

  return patterns.sort((a, b) => b.frequency - a.frequency)
}

export function computeDomainResults(data: AppData): DomainResult[] {
  const domains: EcoDomain[] = ['People', 'Process', 'BusinessEnvironment']
  return domains.map((domain) => {
    const relevant = data.attempts.filter((a) => {
      const q = getQuestionById(a.questionId)
      return q?.domain === domain
    })
    const correct = relevant.filter((a) => a.correct).length
    return {
      domain,
      correct,
      total: relevant.length,
      accuracy: relevant.length ? correct / relevant.length : 0,
    }
  })
}

export function computeTopicMastery(data: AppData): Record<string, TopicMastery> {
  const byTopic = new Map<string, Attempt[]>()
  data.attempts.forEach((a) => {
    const q = getQuestionById(a.questionId)
    if (!q) return
    if (!byTopic.has(q.topic)) byTopic.set(q.topic, [])
    byTopic.get(q.topic)!.push(a)
  })

  const result: Record<string, TopicMastery> = {}
  byTopic.forEach((attempts, topic) => {
    const q = getQuestionById(attempts[0].questionId)!
    const recent = attempts.slice(-10)
    const correct = recent.filter((a) => a.correct).length
    const accuracyRecent = recent.length ? correct / recent.length : 0
    const distinctDifficulties = new Set(
      attempts.map((a) => getQuestionById(a.questionId)?.difficulty).filter(Boolean),
    )
    const distinctSessions = new Set(attempts.map((a) => a.sessionId)).size
    const avgConfidence =
      attempts.reduce((sum, a) => sum + confidenceScore(a.confidence), 0) / attempts.length

    const mastered =
      accuracyRecent >= data.profile.masteryThresholdAccuracy &&
      recent.length >= data.profile.masteryMinQuestions &&
      distinctDifficulties.size >= 2 &&
      distinctSessions >= 2 &&
      avgConfidence >= 2.5

    result[topic] = {
      topic,
      domain: q.domain,
      accuracyRecent,
      questionsAnswered: attempts.length,
      distinctDifficulties: Array.from(distinctDifficulties) as TopicMastery['distinctDifficulties'],
      distinctSessions,
      avgConfidence,
      mastered,
      lastPracticed: attempts[attempts.length - 1]?.timestamp,
    }
  })
  return result
}

function confidenceScore(c: Attempt['confidence']): number {
  switch (c) {
    case 'Guess':
      return 0
    case 'NotSure':
      return 1
    case 'Confident':
      return 2
    case 'VeryConfident':
      return 3
  }
}

// Internal readiness indicator — explicitly NOT an official PMI prediction.
export function computeReadiness(data: AppData): number {
  const domainResults = computeDomainResults(data)
  const totalAnswered = data.attempts.length
  const coverage = Math.min(1, totalAnswered / 150) // coverage relative to a full bank pass

  const weightedAccuracy = domainResults.reduce((sum, d) => {
    const weight = d.domain === 'People' ? 0.33 : d.domain === 'Process' ? 0.41 : 0.26
    return sum + d.accuracy * weight
  }, 0)

  const masteryValues = Object.values(computeTopicMastery(data))
  const masteredRatio = masteryValues.length ? masteryValues.filter((m) => m.mastered).length / masteryValues.length : 0

  const patterns = detectPatterns(data)
  const patternPenalty = Math.min(0.15, patterns.length * 0.03)

  const raw = coverage * 0.25 + weightedAccuracy * 0.45 + masteredRatio * 0.3 - patternPenalty
  return Math.round(Math.max(0, Math.min(1, raw)) * 100)
}

export function classifyMistake(selectedAnswer: number, correctAnswer: number): MistakeCategory {
  // Simple heuristic default; the user can always override via the Error Log UI.
  void selectedAnswer
  void correctAnswer
  return 'KnowledgeGap'
}

export { MISTAKE_RULES }
