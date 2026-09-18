# Prompt generador de preguntas — PMP Mastery Lab

Usa este prompt (con Claude o cualquier LLM) para generar nuevas preguntas compatibles
con `src/data/questions.ts`, a partir de un capítulo de tu guía PMBOK.

---

## Prompt

```
Eres un diseñador de contenido experto en el examen PMP, alineado al Exam Content
Outline (ECO) vigente desde julio 2026 (People 33% / Process 41% / Business
Environment 26%, con fuerte presencia de escenarios Agile/Hybrid en los tres
dominios).

Te voy a proporcionar un capítulo o sección de la Guía PMBOK 8va edición.

Genera [N] preguntas situacionales ORIGINALES (no copiadas de bancos comerciales),
en formato JSON, siguiendo EXACTAMENTE este esquema TypeScript:

{
  id: string;               // "PMP-0011", "PMP-0012"... continúa la numeración
  domain: "People" | "Process" | "BusinessEnvironment";
  task: string;              // referencia a la tarea del ECO
  topic: string;              // tema específico, consistente con otros topics existentes cuando aplique
  approach: "Predictive" | "Agile" | "Hybrid";
  difficulty: "Easy" | "Medium" | "Hard";
  scenario: string;           // 2-4 oraciones de contexto realista
  question: string;           // la pregunta en sí
  answers: [string, string, string, string];  // 4 alternativas plausibles
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;        // por qué es correcta la respuesta
  explanationPerAlternative: [string, string, string, string]; // por qué cada alternativa es correcta/incorrecta
  mindset: string;            // principio de PMP Mindset involucrado
  mentalRule: string;         // regla reutilizable, ej: "Antes de escalar, determina si corresponde analizar, colaborar o resolver dentro del equipo."
  source: string;             // referencia a la guía o al ECO
  tags: string[];
}

Reglas obligatorias:
- Las preguntas deben ser PRINCIPALMENTE situacionales, no memorísticas.
- Las 4 alternativas deben ser plausibles; evita distractores obviamente absurdos.
- La explicación por alternativa debe justificar CADA opción, no solo la correcta.
- No repitas el mismo "topic" más de 3 veces en el mismo lote sin variar el enfoque
  (Predictive/Agile/Hybrid) o la dificultad.
- Usa terminología consistente con el ECO vigente y el PMBOK 8va edición.
- No copies texto literal de ningún banco comercial de preguntas (Rita Mulcahy, PM
  PrepCast, PMTraining, etc.).
- Devuelve ÚNICAMENTE el array JSON, sin texto adicional.

Capítulo / sección de la guía:
[PEGA AQUÍ EL TEXTO DEL CAPÍTULO]
```

---

## Cómo integrar el resultado

1. Copia el array JSON generado.
2. Pégalo dentro de `src/data/questions.ts`, agregándolo al array `questions`.
3. Ejecuta `npm run validate-questions` para verificar que no haya IDs duplicados,
   campos faltantes, o valores inválidos de `domain`/`approach`/`difficulty`.
4. Ejecuta `npm run build` para confirmar que compila sin errores de tipos.
