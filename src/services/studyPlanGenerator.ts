import type { AssessmentResult, EcoDomain, StudyPlan, WeekPlan, DailySessionPlan } from '../types'

interface WeekTemplate {
  objective: string
  topics: string[]
  keyConcepts: string[]
  recommendedReading: string
  focusDomain: EcoDomain
}

// 8-week instructional design: mapped to ECO domains (People 33% / Process 41% / Business Environment 26%)
// and sequenced from foundations → integration → mixed practice → simulation.
const WEEK_TEMPLATES: WeekTemplate[] = [
  {
    objective: 'Establecer las bases: mentalidad PMP, dominios de desempeño y principios de gestión de proyectos.',
    topics: ['PMP Mindset', 'Principios de gestión de proyectos', 'Dominios de desempeño', 'Enfoques Predictive/Agile/Hybrid'],
    keyConcepts: ['Mentalidad PMP', 'Principios rectores', 'Selección de enfoque de desarrollo'],
    recommendedReading: 'PMBOK 8th Ed. — Introducción y Estándar para la Dirección de Proyectos (cap. 1–3)',
    focusDomain: 'People',
  },
  {
    objective: 'Profundizar en liderazgo de equipos, conflicto y empoderamiento — el núcleo del dominio People.',
    topics: ['Liderazgo de equipos', 'Gestión de conflictos', 'Empoderamiento', 'Servant leadership'],
    keyConcepts: ['Team performance domain', 'Modelo de Tuckman', 'Inteligencia emocional'],
    recommendedReading: 'PMBOK 8th Ed. — Dominio de desempeño del equipo',
    focusDomain: 'People',
  },
  {
    objective: 'Cubrir stakeholders, comunicación y compromiso — cierre del dominio People.',
    topics: ['Gestión de stakeholders', 'Comunicación', 'Transferencia de conocimiento'],
    keyConcepts: ['Estrategias de engagement', 'Planificación de comunicaciones'],
    recommendedReading: 'PMBOK 8th Ed. — Dominio de desempeño de stakeholders',
    focusDomain: 'People',
  },
  {
    objective: 'Entrar al dominio Process: planificación integrada, alcance y cronograma.',
    topics: ['Planificación integrada', 'Gestión del alcance', 'Gestión del cronograma'],
    keyConcepts: ['Line base', 'Descomposición del trabajo', 'Estimación'],
    recommendedReading: 'PMBOK 8th Ed. — Dominio de desempeño de planificación',
    focusDomain: 'Process',
  },
  {
    objective: 'Riesgo, incertidumbre y calidad — procesos técnicos centrales del examen.',
    topics: ['Gestión de riesgos', 'Incertidumbre', 'Gestión de calidad'],
    keyConcepts: ['Riesgo vs issue', 'Respuestas al riesgo', 'Costo de calidad'],
    recommendedReading: 'PMBOK 8th Ed. — Dominio de desempeño de incertidumbre',
    focusDomain: 'Process',
  },
  {
    objective: 'Entrega de valor, control de cambios y cierre — completar el dominio Process.',
    topics: ['Entrega de valor', 'Control integrado de cambios', 'Cierre de proyecto'],
    keyConcepts: ['Value-based delivery', 'Control de cambios', 'Transición y cierre'],
    recommendedReading: 'PMBOK 8th Ed. — Dominio de desempeño de entrega',
    focusDomain: 'Process',
  },
  {
    objective:
      'Business Environment a fondo: valor de negocio, compliance y cambio organizacional (dominio con mayor peso relativo desde el ECO de julio 2026).',
    topics: ['Caso de negocio y valor', 'Compliance', 'Cambio organizacional', 'Sostenibilidad y ESG'],
    keyConcepts: ['Business case', 'Beneficios vs entregables', 'Gestión de cambio organizacional'],
    recommendedReading: 'PMBOK 8th Ed. — capítulos relacionados con entorno de negocio y Apéndice X5',
    focusDomain: 'BusinessEnvironment',
  },
  {
    objective: 'Integración final, simulacros completos y cierre de brechas antes del examen.',
    topics: ['Repaso integrado', 'Simulacros completos', 'Cierre de patrones de error'],
    keyConcepts: ['Integración de los 3 dominios', 'Gestión del tiempo de examen'],
    recommendedReading: 'Repaso cruzado de todo el material cubierto',
    focusDomain: 'Process',
  },
]

function buildDailySessions(topics: string[], suggestedQuestionCount: number): DailySessionPlan[] {
  const weekdayFocus = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  return [
    ...weekdayFocus.map((day, i) => ({
      day,
      focus: topics[i % topics.length],
      minutesConcepts: 25,
      minutesPractice: 35,
      minutesErrorAnalysis: 18,
      suggestedQuestionCount: Math.round(suggestedQuestionCount / 5),
      topics: [topics[i % topics.length]],
    })),
    {
      day: 'Saturday',
      focus: 'Práctica intensiva + simulacro + análisis de errores',
      minutesConcepts: 0,
      minutesPractice: 90,
      minutesErrorAnalysis: 30,
      suggestedQuestionCount: Math.round(suggestedQuestionCount * 0.8),
      topics,
    },
    {
      day: 'Sunday',
      focus: 'Descanso o repaso ligero opcional',
      minutesConcepts: 15,
      minutesPractice: 0,
      minutesErrorAnalysis: 0,
      suggestedQuestionCount: 0,
      topics: [],
    },
  ]
}

function defaultDomainWeights(): Record<EcoDomain, number> {
  return { People: 0.33, Process: 0.41, BusinessEnvironment: 0.26 }
}

export function generateStudyPlan(params: {
  startDate: string
  examDate?: string
  daysAvailable: string[]
  hoursPerWeek: number
}): StudyPlan {
  const start = new Date(params.startDate)
  const weeks: WeekPlan[] = WEEK_TEMPLATES.map((tpl, idx) => {
    const weekStart = new Date(start)
    weekStart.setDate(start.getDate() + idx * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const suggestedQuestionCount = Math.round((params.hoursPerWeek * 60) / 4) // rough: ~4 min/question incl. review

    return {
      weekNumber: idx + 1,
      objective: tpl.objective,
      topics: tpl.topics,
      keyConcepts: tpl.keyConcepts,
      recommendedReading: tpl.recommendedReading,
      expectedOutcomes: tpl.topics.map((t) => `Explicar y aplicar correctamente escenarios de "${t}"`),
      exercises: [`Quick Practice de ${tpl.topics[0]}`, `Focus Mode en cada tema de la semana`],
      suggestedQuestionCount,
      applicationChallenge: `Resuelve 5 escenarios situacionales combinando los temas de la semana (${tpl.topics.join(', ')}).`,
      shortQuiz: `Prueba corta de 10 preguntas al final de la semana sobre: ${tpl.topics.join(', ')}.`,
      masteryCriteria: 'Accuracy ≥ 80% en al menos 8 preguntas, en más de una sesión y más de una dificultad.',
      domainWeights: defaultDomainWeights(),
      dailySessions: buildDailySessions(tpl.topics, suggestedQuestionCount),
      startDate: weekStart.toISOString().slice(0, 10),
      endDate: weekEnd.toISOString().slice(0, 10),
    }
  })

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    examDate: params.examDate,
    daysAvailable: params.daysAvailable,
    hoursPerWeek: params.hoursPerWeek,
    weeks,
  }
}

// After a diagnostic or major simulation, re-weight future weeks toward weaker domains
// while preserving coverage of the rest (per prompt requirement #26).
export function adaptStudyPlan(plan: StudyPlan, assessment: AssessmentResult, fromWeek: number): StudyPlan {
  const weakest = [...assessment.byDomain].sort((a, b) => a.accuracy - b.accuracy)
  const boost = 0.12
  const domainOrder: EcoDomain[] = weakest.map((d) => d.domain)

  const newWeights: Record<EcoDomain, number> = defaultDomainWeights()
  if (domainOrder.length === 3) {
    newWeights[domainOrder[0]] += boost
    newWeights[domainOrder[2]] -= boost / 2
    newWeights[domainOrder[1]] -= boost / 2
  }

  const updatedWeeks = plan.weeks.map((w) =>
    w.weekNumber >= fromWeek ? { ...w, domainWeights: newWeights } : w,
  )

  return { ...plan, weeks: updatedWeeks, adaptedAt: new Date().toISOString() }
}
