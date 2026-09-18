import type { AppData } from '../types'

const STORAGE_KEY = 'pmp-mastery-lab:data'
const CURRENT_VERSION = 1

export function defaultAppData(): AppData {
  return {
    version: CURRENT_VERSION,
    profile: {
      hoursPerWeek: 8,
      daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      priorExperience: [],
      onboardingCompleted: false,
      theme: 'system',
      masteryThresholdAccuracy: 0.8,
      masteryMinQuestions: 8,
    },
    attempts: [],
    sessions: [],
    errorLog: [],
    assessments: [],
    gamification: {
      streakDays: 0,
      sessionsCompleted: 0,
      badgesEarned: [],
      level: 1,
    },
    topicMastery: {},
  }
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultAppData()
    const parsed = JSON.parse(raw) as AppData
    // Simple migration guard: if version mismatches in the future, merge with defaults.
    return { ...defaultAppData(), ...parsed }
  } catch (err) {
    console.error('Failed to load app data, resetting to defaults.', err)
    return defaultAppData()
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save app data.', err)
  }
}

export function resetAppData(): AppData {
  const fresh = defaultAppData()
  saveAppData(fresh)
  return fresh
}

export function exportAppData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'pmp-mastery-backup.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export interface ImportResult {
  success: boolean
  error?: string
  data?: AppData
}

// Minimal structural validation before we trust an imported file.
export function validateImportedData(raw: unknown): ImportResult {
  if (typeof raw !== 'object' || raw === null) {
    return { success: false, error: 'El archivo no contiene un objeto JSON válido.' }
  }
  const obj = raw as Record<string, unknown>
  const requiredKeys = ['profile', 'attempts', 'sessions', 'errorLog', 'assessments', 'gamification', 'topicMastery']
  for (const key of requiredKeys) {
    if (!(key in obj)) {
      return { success: false, error: `Falta el campo requerido: "${key}". Este no parece ser un backup válido de PMP Mastery Lab.` }
    }
  }
  if (!Array.isArray(obj.attempts) || !Array.isArray(obj.sessions) || !Array.isArray(obj.errorLog)) {
    return { success: false, error: 'Los campos attempts, sessions o errorLog no tienen el formato esperado (array).' }
  }
  return { success: true, data: { ...defaultAppData(), ...(obj as unknown as AppData) } }
}

export async function importAppDataFromFile(file: File): Promise<ImportResult> {
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    return validateImportedData(parsed)
  } catch (err) {
    return { success: false, error: `No se pudo leer el archivo: ${(err as Error).message}` }
  }
}
