import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { generateStudyPlan } from '../services/studyPlanGenerator'
import type { Approach } from '../types'

const APPROACHES: Approach[] = ['Predictive', 'Agile', 'Hybrid']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Onboarding() {
  const { setData } = useAppData()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [examDate, setExamDate] = useState('')
  const [hours, setHours] = useState(8)
  const [days, setDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  const [experience, setExperience] = useState<Approach[]>(['Agile'])

  const toggleDay = (d: string) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  const toggleApproach = (a: Approach) =>
    setExperience((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))

  const finish = () => {
    const plan = generateStudyPlan({
      startDate: new Date().toISOString().slice(0, 10),
      examDate: examDate || undefined,
      daysAvailable: days,
      hoursPerWeek: hours,
    })
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: name || undefined,
        examDate: examDate || undefined,
        hoursPerWeek: hours,
        daysAvailable: days,
        priorExperience: experience,
        onboardingCompleted: true,
      },
      studyPlan: plan,
    }))
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-semibold">Construyamos tu ruta PMP</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Unos datos rápidos para personalizar tu plan de 8 semanas. Todo se guarda solo en este dispositivo.
      </p>

      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre (opcional)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Luis"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fecha objetivo del examen (opcional)</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Horas disponibles por semana: {hours}h</label>
          <input
            type="range"
            min={3}
            max={20}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Días disponibles</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  days.includes(d)
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Experiencia previa</label>
          <div className="flex flex-wrap gap-2">
            {APPROACHES.map((a) => (
              <button
                key={a}
                onClick={() => toggleApproach(a)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  experience.includes(a)
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={finish}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Generar mi ruta de estudio →
        </button>
        <p className="text-center text-xs text-slate-400">
          Después de esto te recomendamos hacer el Assessment inicial desde Practice.
        </p>
      </div>
    </div>
  )
}
