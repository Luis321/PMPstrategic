# PMP-MINDSET.md

El "PMP Mindset" son patrones de razonamiento que el examen evalúa implícitamente en
cada pregunta situacional. **No son reglas absolutas** — el contexto del escenario
siempre determina la mejor respuesta. Se usan como heurísticas de primera lectura,
no como respuestas automáticas.

Implementados en `src/pages/Mindset.tsx` y referenciados en cada pregunta del banco
(`question.mindset`).

## Los 17 principios

1. **Analizar antes de actuar** cuando sea razonable.
2. **Comprender la causa** antes de aplicar una solución.
3. **Colaborar antes de imponer.**
4. **Facilitar antes de ordenar.**
5. **Involucrar al equipo.**
6. **Gestionar conflictos tempranamente.**
7. **Proteger al equipo.**
8. **Gestionar stakeholders** de forma proactiva.
9. **Entender el impacto de los cambios** antes de aceptarlos o rechazarlos.
10. **Seguir el proceso apropiado de gestión del cambio**, sin importar el tamaño del cambio.
11. **Diferenciar riesgo de issue** (incierto/futuro vs. ya ocurrido).
12. **Diferenciar acción preventiva, correctiva y de reparación/contingencia.**
13. **Considerar el valor de negocio** en cada decisión relevante.
14. **Considerar compliance** ante cualquier señal de incumplimiento.
15. **Adaptar el enfoque** según Predictive, Agile o Hybrid — nunca por defecto.
16. **No asumir que escalar es la primera respuesta.**
17. **No reemplazar colaboración por autoridad innecesariamente.**

## Cómo se entrena en la app

- **PMP Mindset Challenge** (modo de práctica): casos diseñados específicamente para
  ejercitar estos patrones.
- **Mis Patrones**: cuando el sistema detecta que repites un error relacionado con
  alguno de estos principios (ej. "escalaste demasiado pronto" 3+ veces), lo muestra
  como un patrón con frecuencia, ejemplos y práctica recomendada.
- **Feedback de cada pregunta**: todo `Question` incluye el campo `mindset`, que
  vincula explícitamente la pregunta con el principio evaluado.

## Advertencia de diseño

Evita convertir estos principios en respuestas automáticas ("si veo conflicto → la
respuesta siempre es colaborar"). El examen premia el juicio contextual, no la
aplicación mecánica de reglas. Cada pregunta del banco está diseñada para que el
principio aplique *en ese contexto específico*, no como ley universal.
