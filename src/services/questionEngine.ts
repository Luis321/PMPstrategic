import type { AppData, Question, Approach, EcoDomain, PracticeMode } from '../types'
import { questions as bank } from '../data/questions'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getAllQuestions(): Question[] {
  return bank
}

export function getQuestionById(id: string): Question | undefined {
  return bank.find((q) => q.id === id)
}

export function selectQuickPractice(count = 10): Question[] {
  return shuffle(bank).slice(0, count)
}

export function selectByTopic(topic: string): Question[] {
  return shuffle(bank.filter((q) => q.topic === topic))
}

export function selectByDomain(domain: EcoDomain, count?: number): Question[] {
  const filtered = shuffle(bank.filter((q) => q.domain === domain))
  return count ? filtered.slice(0, count) : filtered
}

export function selectByApproach(approach: Approach, count?: number): Question[] {
  const filtered = shuffle(bank.filter((q) => q.approach === approach))
  return count ? filtered.slice(0, count) : filtered
}

export function selectWeakAreas(data: AppData, count = 10): Question[] {
  const weakTopics = new Set(
    Object.values(data.topicMastery)
      .filter((t) => !t.mastered)
      .sort((a, b) => a.accuracyRecent - b.accuracyRecent)
      .map((t) => t.topic),
  )
  const pool = weakTopics.size > 0 ? bank.filter((q) => weakTopics.has(q.topic)) : bank
  return shuffle(pool).slice(0, count)
}

export function selectMistakesRetry(data: AppData, count = 10): Question[] {
  const wrongIds = new Set(data.errorLog.map((e) => e.questionId))
  const pool = bank.filter((q) => wrongIds.has(q.id))
  return shuffle(pool).slice(0, count)
}

export function selectRandomChallenge(count = 15): Question[] {
  return shuffle(bank).slice(0, count)
}

export function selectMindsetChallenge(count = 10): Question[] {
  // Situational questions naturally cover mindset; all of the starter bank qualifies.
  return shuffle(bank).slice(0, count)
}

// Builds an exam simulation respecting the ECO domain weighting (effective July 2026):
// People 33% / Process 41% / Business Environment 26%
export function buildSimulation(totalQuestions: number): Question[] {
  const weights: Record<EcoDomain, number> = {
    People: 0.33,
    Process: 0.41,
    BusinessEnvironment: 0.26,
  }
  const result: Question[] = []
  ;(Object.keys(weights) as EcoDomain[]).forEach((domain) => {
    const target = Math.round(totalQuestions * weights[domain])
    const pool = shuffle(bank.filter((q) => q.domain === domain))
    result.push(...pool.slice(0, target))
  })
  // Top up / trim to exact count if rounding drifted, or bank is smaller than requested.
  if (result.length < totalQuestions) {
    const usedIds = new Set(result.map((q) => q.id))
    const rest = shuffle(bank.filter((q) => !usedIds.has(q.id)))
    result.push(...rest.slice(0, totalQuestions - result.length))
  }
  return shuffle(result.slice(0, Math.min(totalQuestions, bank.length)))
}

export function selectForMode(mode: PracticeMode, data: AppData, opts?: { topic?: string; domain?: EcoDomain; approach?: Approach; count?: number }): Question[] {
  switch (mode) {
    case 'QuickPractice':
      return selectQuickPractice(opts?.count ?? 10)
    case 'FocusMode':
      return opts?.topic ? selectByTopic(opts.topic) : selectQuickPractice(10)
    case 'DomainPractice':
      return opts?.domain ? selectByDomain(opts.domain, opts?.count) : selectQuickPractice(10)
    case 'ApproachPractice':
      return opts?.approach ? selectByApproach(opts.approach, opts?.count) : selectQuickPractice(10)
    case 'WeakAreas':
      return selectWeakAreas(data, opts?.count ?? 10)
    case 'MistakesRetry':
      return selectMistakesRetry(data, opts?.count ?? 10)
    case 'RandomChallenge':
      return selectRandomChallenge(opts?.count ?? 15)
    case 'MindsetChallenge':
      return selectMindsetChallenge(opts?.count ?? 10)
    case 'Simulator':
      return buildSimulation(opts?.count ?? 20)
    default:
      return selectQuickPractice(10)
  }
}
