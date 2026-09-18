# QUESTION-SCHEMA.md

Toda pregunta vive en `src/data/questions.ts` y debe cumplir el tipo `Question`
definido en `src/types/index.ts`:

```ts
interface Question {
  id: string                                    // "PMP-0001", único, secuencial
  domain: 'People' | 'Process' | 'BusinessEnvironment'
  task: string                                  // referencia a la tarea del ECO
  topic: string                                 // tema específico (agrupa preguntas en Focus Mode)
  approach: 'Predictive' | 'Agile' | 'Hybrid'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  scenario: string                              // 2-4 oraciones de contexto
  question: string                              // la pregunta en sí
  answers: [string, string, string, string]     // exactamente 4 alternativas
  correctAnswer: 0 | 1 | 2 | 3
  explanation: string                           // por qué es correcta la respuesta
  explanationPerAlternative: [string, string, string, string]  // por qué cada alternativa es correcta/incorrecta
  mindset: string                               // principio de PMP Mindset involucrado
  mentalRule: string                            // regla reutilizable
  source: string                                // referencia a guía/ECO
  tags: string[]
}
```

## Reglas de calidad

- **Situacional, no memorística**: el escenario debe requerir juicio, no solo recordar un dato.
- **4 alternativas plausibles**: evita distractores obviamente absurdos.
- **Explicación por cada alternativa**, no solo la correcta — así el usuario entiende
  por qué las otras 3 son subóptimas, no solo que están "mal".
- **`mentalRule` reutilizable**: debe poder aplicarse a otros escenarios similares,
  no ser específica de esta única pregunta. Ejemplo: *"Antes de escalar, determina si
  corresponde analizar, colaborar o resolver dentro del equipo."*
- **`source` verificable**: referencia a la tarea del ECO y/o sección del PMBOK 8va ed.
- **IDs secuenciales**: `PMP-0001`, `PMP-0002`, … sin saltos ni duplicados.

## Validación automática

```bash
npm run validate-questions
```

Verifica: IDs únicos, `domain`/`approach`/`difficulty` con valores válidos, 4
respuestas no vacías, `correctAnswer` en rango 0–3, 4 explicaciones por alternativa,
y que ningún campo de texto obligatorio esté vacío.

**No valida** calidad pedagógica (plausibilidad de distractores, precisión técnica,
alineación real con el ECO) — eso requiere revisión humana o de un LLM con el prompt
de `docs/question-generator-prompt.md`.

## Distribución objetivo del banco

Alineada al ECO vigente (julio 2026):

| Dominio | Peso ECO | Preguntas objetivo (de 150–250) |
|---|---|---|
| People | 33% | ~50–83 |
| Process | 41% | ~62–102 |
| Business Environment | 26% | ~39–65 |

El simulador (`buildSimulation()` en `questionEngine.ts`) ya respeta esta proporción
al armar cualquier simulacro, independientemente de cuántas preguntas totales tenga
el banco.
