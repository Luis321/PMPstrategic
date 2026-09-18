# STUDY-METHODOLOGY.md

## Fuente de verdad para el contenido

1. **Exam Content Outline (ECO) vigente de PMI**, efectivo desde **julio 2026**.
2. **Guía PMBOK 8va edición** (ANSI/PMI 99-001-2025), proporcionada por el usuario.
3. Agile Practice Guide.
4. Documentación oficial de PMI relacionada con PMP.

## Diferencia documentada: ECO 2026 vs. guía PMBOK

Confirmado directamente en `pmi.org/certifications/project-management-pmp/new-exam`
(consultado en septiembre de 2026):

| Dominio ECO | Peso hasta jun. 2026 | Peso vigente (jul. 2026+) |
|---|---|---|
| People | 42% | **33%** |
| Process | 50% | **41%** |
| Business Environment | 8% | **26%** |

Cambios adicionales del ECO 2026:
- Mayor peso de escenarios Agile/Hybrid, entrelazados en los tres dominios (no como
  sección separada).
- Nuevos temas: IA en gestión de proyectos, sostenibilidad/ESG, engagement de
  stakeholders ampliado.
- Formato de examen (según fuentes recientes, no verificado línea por línea contra
  el PDF oficial del ECO): 180 preguntas, ~240 minutos, ~170 puntuadas + 10 piloto,
  dos descansos de 10 min.

**Importante**: el PMBOK Guide usa una estructura propia de **7 dominios de
desempeño** + **5 áreas de enfoque** (grupos de procesos reintroducidos en la 8va
edición) + **40 procesos no prescriptivos**. Esta estructura **no coincide 1:1**
con los 3 dominios / 26 tareas del ECO. PMP Mastery Lab usa la taxonomía del ECO
(`People` / `Process` / `BusinessEnvironment`) como esquema de clasificación de
preguntas, y mapea el contenido de la guía PMBOK a esa taxonomía tema por tema —
no dominio de desempeño por dominio de desempeño.

**Consecuencia práctica para tu perfil (experiencia previa en Agile/Scrum)**:
dado que Business Environment triplicó su peso, es probable que esta sea tu mayor
brecha real, más que Process. El diagnóstico inicial (Assessment) es quien decide
esto con datos reales, no una suposición.

## El ciclo pedagógico

Cada pregunta situacional sigue este ciclo:

```
CONCEPTO → ESCENARIO → DECISIÓN → RESPUESTA DEL USUARIO → FEEDBACK
  → EXPLICACIÓN → PATRÓN DE ERROR → REGLA APRENDIDA → NUEVO RETO
```

La respuesta correcta nunca se muestra antes de responder. Después de responder, se
muestra: respuesta correcta, explicación general, explicación por cada alternativa,
concepto evaluado, dominio, enfoque (Predictive/Agile/Hybrid), dificultad, principio
de PMP Mindset involucrado, fuente, y una regla mental reutilizable.

## Ruta de 8 semanas — diseño instruccional

La ruta (`src/services/studyPlanGenerator.ts`) sigue esta secuencia:

1. **Semanas 1–3 — People**: mentalidad PMP → liderazgo/conflicto → stakeholders/comunicación.
2. **Semanas 4–6 — Process**: planificación integrada → riesgo/calidad → entrega de valor/cambio/cierre.
3. **Semana 7 — Business Environment**: valor de negocio, compliance, cambio organizacional, ESG (dominio con mayor peso relativo desde el ECO 2026).
4. **Semana 8 — Integración**: repaso cruzado, simulacros completos, cierre de patrones de error.

Cada semana define: objetivo, temas, conceptos clave, lectura recomendada,
resultados esperados, ejercicios, número sugerido de preguntas, reto de aplicación,
prueba corta y criterio de dominio. Cada semana se subdivide en sesiones diarias
(lunes–viernes: 60–90 min con bloques de concepto/práctica/análisis de errores;
sábado: bloque largo de práctica + simulacro; domingo: descanso o repaso ligero).

## Plan adaptativo

Después del Assessment inicial y de cada simulacro importante, `adaptStudyPlan()`
reajusta los pesos de dominio de las semanas restantes, dando más énfasis al dominio
con menor accuracy, sin eliminar cobertura de los otros dos.

## Regla de "Mastered"

Un tema se considera dominado cuando, simultáneamente:

- accuracy reciente ≥ umbral configurado (por defecto 80%, ajustable en Settings);
- al menos 8 preguntas respondidas (por defecto, ajustable);
- preguntas de más de una dificultad distinta;
- respondidas en más de una sesión distinta;
- confianza promedio ≥ "Confident".

Ver `analyticsEngine.computeTopicMastery()`.

## PMP Readiness (no oficial)

Combina: cobertura del banco de preguntas, accuracy ponderada por peso de dominio
ECO, proporción de temas dominados, y una penalización por patrones de error
detectados. Se muestra siempre junto al texto: *"Este indicador representa tu nivel
interno de preparación dentro de PMP Mastery Lab y no corresponde a una calificación
oficial de PMI."*
