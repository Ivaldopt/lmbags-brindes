import { useEffect } from 'react'
import api, { API } from './api'
import { useConsent } from './consent'

export default function useVisit(tipo, referencia) {
  const { statistics } = useConsent()
  useEffect(() => {
    if (!statistics) return
    const day = new Date().toISOString().slice(0, 10)
    const key = `lm_visita_${day}_${tipo}_${referencia || ''}`
    try { if (sessionStorage.getItem(key)) return } catch { /* Sem persistência. */ }
    const controller = new AbortController()
    api.post(`${API}/api/admin/visitas`, { tipo, ...(referencia ? { referencia: String(referencia) } : {}) }, { signal: controller.signal })
      .then(() => { try { sessionStorage.setItem(key, '1') } catch { /* Sem persistência. */ } })
      .catch(() => {})
    return () => controller.abort()
  }, [statistics, tipo, referencia])
}
