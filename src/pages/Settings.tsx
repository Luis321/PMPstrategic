import { useRef, useState } from 'react'
import { useAppData } from '../hooks/useAppData'
import { exportAppData, importAppDataFromFile } from '../services/storage'

export default function Settings() {
  const { data, setData, reset } = useAppData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importAppDataFromFile(file)
    if (result.success && result.data) {
      setData(result.data)
      setImportMessage('✅ Progreso importado correctamente.')
    } else {
      setImportMessage(`❌ ${result.error}`)
    }
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
      reset()
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 font-medium">Perfil</h2>
        <label className="mb-1 block text-xs text-slate-500">Nombre</label>
        <input
          value={data.profile.name ?? ''}
          onChange={(e) => setData((prev) => ({ ...prev, profile: { ...prev.profile, name: e.target.value } }))}
          className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <label className="mb-1 block text-xs text-slate-500">Umbral de dominio (accuracy)</label>
        <input
          type="number"
          min={0.5}
          max={1}
          step={0.05}
          value={data.profile.masteryThresholdAccuracy}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              profile: { ...prev.profile, masteryThresholdAccuracy: Number(e.target.value) },
            }))
          }
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 font-medium">Backup</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Tu progreso permanece en este dispositivo salvo que exportes manualmente tus datos.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportAppData(data)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Export Progress
          </button>
          <button
            onClick={handleImportClick}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
          >
            Import Progress
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChange} />
        </div>
        {importMessage && <p className="mt-3 text-sm">{importMessage}</p>}
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950">
        <h2 className="mb-2 font-medium text-red-700 dark:text-red-300">Zona de riesgo</h2>
        <p className="mb-3 text-sm text-red-600 dark:text-red-400">
          Esto borra todo tu progreso local (respuestas, error log, plan de estudio, configuraciones).
        </p>
        <button onClick={handleReset} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
          Reset Data
        </button>
      </section>

      <p className="text-xs text-slate-400">
        Toda la aplicación se ejecuta localmente en tu navegador. No se envía información a ningún servidor.
      </p>
    </div>
  )
}
