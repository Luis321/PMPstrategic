import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppData } from '../types'
import { loadAppData, saveAppData, resetAppData } from '../services/storage'

interface AppDataContextValue {
  data: AppData
  setData: (updater: AppData | ((prev: AppData) => AppData)) => void
  reset: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData>(() => loadAppData())

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const setData = (updater: AppData | ((prev: AppData) => AppData)) => {
    setDataState((prev) => (typeof updater === 'function' ? (updater as (p: AppData) => AppData)(prev) : updater))
  }

  const reset = () => setDataState(resetAppData())

  return <AppDataContext.Provider value={{ data, setData, reset }}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
