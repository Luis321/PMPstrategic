// ============================================================
// PMP Mastery Lab — Core domain types
// ============================================================

export type EcoDomain = 'People' | 'Process' | 'BusinessEnvironment'

export type Approach = 'Predictive' | 'Agile' | 'Hybrid'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type ConfidenceLevel = 'Guess' | 'NotSure' | 'Confident' | 'VeryConfident'

export type MistakeCategory =
  | 'KnowledgeGap'
  | 'MisreadQuestion'
  | 'ActedTooFast'
  | 'EscalatedTooEarly'
  | 'ConfusedRiskVsIssue'
  | 'AgileMindsetError'
  | 'ChangeControlError'
  | 'StakeholderError'
  | 'LeadershipError'
  | 'PredictiveProcessError'
  | 'BusinessValueError'

// ------------------------------------------------------------
// Question bank
// ------------------------------------------------------------

export interface Question {
  id: string // e.g. "PMP-0001"
  domain: EcoDomain
  task: string // ECO task reference, e.g. "People Task 3: Empower team members"
  topic: string // e.g. "Risk Management", "Conflict Management"
  approach: Approach
  difficulty: Difficulty
  scenario: string
  question: string
  answers: [string, string, string, string]
  correctAnswer: 0 | 1 | 2 | 3
  explanation: string
  explanationPerAlternative: [string, string, string, string]
  mindset: string // PMP mindset principle involved
  mentalRule: string // reusable rule of thumb
  source: string // e.g. "PMBOK 8th Ed. §2.4" or "ECO Business Environment Task 2"
  tags: string[]
}

// ------------------------------------------------------------
// User attempts / responses
// ------------------------------------------------------------

export interface Attempt {
  id: string
  questionId: string
  sessionId: string
  selectedAnswer: 0 | 1 | 2 | 3
  correct: boolean
  confidence: ConfidenceLevel
  timeSpentSeconds: number
  timestamp: string // ISO
  mode: PracticeMode
  mistakeCategory?: MistakeCategory // set only when incorrect
  flaggedForReview?: boolean
}

export type PracticeMode =
  | 'QuickPractice'
  | 'FocusMode'
  | 'DomainPractice'
  | 'ApproachPractice'
  | 'WeakAreas'
  | 'MistakesRetry'
  | 'RandomChallenge'
  | 'MindsetChallenge'
  | 'Assessment'
  | 'Simulator'
  | 'DailySession'

// ------------------------------------------------------------
// Sessions
// ------------------------------------------------------------

export interface Session {
  id: string
  mode: PracticeMode
  startedAt: string
  finishedAt?: string
  questionIds: string[]
  attemptIds: string[]
  weekNumber?: number
  dayLabel?: string // "Monday", "Saturday", etc.
}

// ------------------------------------------------------------
// Error log
// ------------------------------------------------------------

export interface ErrorLogEntry {
  id: string
  questionId: string
  attemptId: string
  topic: string
  domain: EcoDomain
  selectedAnswer: number
  correctAnswer: number
  mistakeCategory: MistakeCategory
  mentalRule: string
  date: string
  occurrences: number // how many times this pattern occurred
  userOverrideCategory?: MistakeCategory
}

// ------------------------------------------------------------
// Pattern detection
// ------------------------------------------------------------

export interface DetectedPattern {
  id: string
  mistakeCategory: MistakeCategory
  frequency: number
  exampleQuestionIds: string[]
  ruleDescription: string
  recommendedPractice: string
}

// ------------------------------------------------------------
// Study plan
// ------------------------------------------------------------

export interface DailySessionPlan {
  day: string // "Monday" ... "Sunday"
  focus: string
  minutesConcepts: number
  minutesPractice: number
  minutesErrorAnalysis: number
  suggestedQuestionCount: number
  topics: string[]
}

export interface WeekPlan {
  weekNumber: number
  objective: string
  topics: string[]
  keyConcepts: string[]
  recommendedReading: string
  expectedOutcomes: string[]
  exercises: string[]
  suggestedQuestionCount: number
  applicationChallenge: string
  shortQuiz: string
  masteryCriteria: string
  domainWeights: Record<EcoDomain, number> // relative emphasis for this week (adaptive)
  dailySessions: DailySessionPlan[]
  startDate?: string
  endDate?: string
}

export interface StudyPlan {
  id: string
  createdAt: string
  examDate?: string
  daysAvailable: string[] // ['Monday', 'Tuesday', ...]
  hoursPerWeek: number
  weeks: WeekPlan[]
  adaptedAt?: string
}

// ------------------------------------------------------------
// Diagnostic / assessment
// ------------------------------------------------------------

export interface DomainResult {
  domain: EcoDomain
  correct: number
  total: number
  accuracy: number
}

export interface ApproachResult {
  approach: Approach
  correct: number
  total: number
  accuracy: number
}

export interface AssessmentResult {
  id: string
  completedAt: string
  totalQuestions: number
  correct: number
  byDomain: DomainResult[]
  byApproach: ApproachResult[]
  byDifficulty: Record<Difficulty, DomainResult>
  strengths: string[]
  gaps: string[]
  risks: string[]
  studyPriorities: string[]
}

// ------------------------------------------------------------
// User profile / settings
// ------------------------------------------------------------

export interface UserProfile {
  name?: string
  examDate?: string
  hoursPerWeek: number
  daysAvailable: string[]
  priorExperience: Approach[]
  onboardingCompleted: boolean
  theme: 'light' | 'dark' | 'system'
  masteryThresholdAccuracy: number // default 0.80
  masteryMinQuestions: number // default 8
}

// ------------------------------------------------------------
// Topic mastery
// ------------------------------------------------------------

export interface TopicMastery {
  topic: string
  domain: EcoDomain
  accuracyRecent: number
  questionsAnswered: number
  distinctDifficulties: Difficulty[]
  distinctSessions: number
  avgConfidence: number
  mastered: boolean
  lastPracticed?: string
  nextReviewDue?: string // spaced repetition
}

// ------------------------------------------------------------
// Gamification
// ------------------------------------------------------------

export interface GamificationState {
  streakDays: number
  lastActiveDate?: string
  sessionsCompleted: number
  badgesEarned: string[]
  level: number
}

// ------------------------------------------------------------
// Full app state (what gets persisted / exported)
// ------------------------------------------------------------

export interface AppData {
  version: number
  profile: UserProfile
  attempts: Attempt[]
  sessions: Session[]
  errorLog: ErrorLogEntry[]
  studyPlan?: StudyPlan
  assessments: AssessmentResult[]
  gamification: GamificationState
  topicMastery: Record<string, TopicMastery>
}
