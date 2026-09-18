// Validates src/data/questions.ts structurally.
// Run with: npm run validate-questions
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as esbuild from 'esbuild'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '..', 'src', 'data', 'questions.ts')
const source = readFileSync(filePath, 'utf-8')

const { code } = await esbuild.transform(source, { loader: 'ts', format: 'esm', target: 'es2020' })

const compiledPath = path.join(__dirname, '_questions_compiled.mjs')
writeFileSync(compiledPath, code)

let questions
try {
  const mod = await import(`file://${compiledPath}?t=${Date.now()}`)
  questions = mod.questions
} finally {
  unlinkSync(compiledPath)
}

const errors = []
const ids = new Set()
const validDomains = ['People', 'Process', 'BusinessEnvironment']
const validApproaches = ['Predictive', 'Agile', 'Hybrid']
const validDifficulties = ['Easy', 'Medium', 'Hard']

questions.forEach((q, idx) => {
  const prefix = `[${q.id ?? `index ${idx}`}]`
  if (!q.id) errors.push(`${prefix} falta id`)
  if (ids.has(q.id)) errors.push(`${prefix} id duplicado`)
  ids.add(q.id)

  if (!validDomains.includes(q.domain)) errors.push(`${prefix} domain inválido: ${q.domain}`)
  if (!validApproaches.includes(q.approach)) errors.push(`${prefix} approach inválido: ${q.approach}`)
  if (!validDifficulties.includes(q.difficulty)) errors.push(`${prefix} difficulty inválido: ${q.difficulty}`)

  if (!Array.isArray(q.answers) || q.answers.length !== 4) errors.push(`${prefix} debe tener exactamente 4 answers`)
  if (q.answers?.some((a) => !a || !a.trim())) errors.push(`${prefix} tiene una respuesta vacía`)

  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
    errors.push(`${prefix} correctAnswer inválido`)
  }

  if (!Array.isArray(q.explanationPerAlternative) || q.explanationPerAlternative.length !== 4) {
    errors.push(`${prefix} debe tener explicación para las 4 alternativas`)
  }

  ;['scenario', 'question', 'explanation', 'mindset', 'mentalRule', 'source', 'topic', 'task'].forEach((field) => {
    if (!q[field] || !String(q[field]).trim()) errors.push(`${prefix} campo vacío: ${field}`)
  })
})

if (errors.length > 0) {
  console.error(`❌ ${errors.length} error(es) encontrados:\n`)
  errors.forEach((e) => console.error(' - ' + e))
  process.exit(1)
} else {
  console.log(`✅ ${questions.length} preguntas válidas. Sin errores.`)
}
