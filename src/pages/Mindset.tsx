const PRINCIPLES = [
  { title: 'Analizar antes de actuar', desc: 'Cuando sea razonable, entiende la situación antes de elegir una acción.' },
  { title: 'Comprender la causa antes de resolver', desc: 'No trates el síntoma sin entender qué lo está causando.' },
  { title: 'Colaborar antes de imponer', desc: 'Prioriza la construcción conjunta sobre las decisiones unilaterales.' },
  { title: 'Facilitar antes que ordenar', desc: 'El liderazgo situacional PMP favorece habilitar al equipo, no dirigirlo todo.' },
  { title: 'Involucrar al equipo', desc: 'Las decisiones que afectan al equipo se construyen con el equipo.' },
  { title: 'Gestionar conflictos tempranamente', desc: 'No esperes a que el conflicto afecte entregables.' },
  { title: 'Proteger al equipo', desc: 'Remueve impedimentos y protege el espacio de trabajo del equipo.' },
  { title: 'Gestionar stakeholders', desc: 'El engagement activo previene sorpresas y resistencia.' },
  { title: 'Entender el impacto de los cambios', desc: 'Todo cambio tiene efectos en alcance, costo, cronograma o personas.' },
  { title: 'Seguir el proceso de gestión del cambio', desc: 'Ningún cambio, por pequeño que sea, se salta el control formal.' },
  { title: 'Diferenciar riesgo de issue', desc: 'Riesgo = incierto y futuro. Issue = ya ocurrió.' },
  { title: 'Diferenciar preventivo, correctivo y reparación', desc: 'Cada uno responde a un momento distinto del problema.' },
  { title: 'Considerar el valor de negocio', desc: 'Toda decisión de proyecto debe evaluarse también por el valor que genera.' },
  { title: 'Considerar compliance', desc: 'Los riesgos regulatorios y legales se escalan, no se asumen solo.' },
  { title: 'Adaptar el enfoque', desc: 'Predictive, Agile o Hybrid según el contexto — nunca por defecto.' },
  { title: 'No asumir que escalar es la primera respuesta', desc: 'Antes de escalar, evalúa si puedes resolver colaborando.' },
  { title: 'No reemplazar colaboración por autoridad', desc: 'La autoridad formal no sustituye el trabajo de construir acuerdo.' },
]

export default function Mindset() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">PMP Mindset</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Patrones de razonamiento para preguntas situacionales. El contexto siempre determina la mejor respuesta —
          estas reglas no son absolutas.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="mb-1 font-medium">{p.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
