import { useEffect } from 'react'
import api, { API } from './api'
import { useConsent } from './consent'
import { useAuth } from '../context/auth'
import { getVisitorId, clearVisitorId } from './visitor'

export default function useVisit(tipo, referencia) {
  const { statistics } = useConsent()
  const { autenticado } = useAuth()
  useEffect(() => {
    if (!statistics) { clearVisitorId(); return }
    if (autenticado) return
    const visitante = getVisitorId()
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bahia' }).format(new Date())
    const key = `lm_visita_${visitante}_${day}_${tipo}_${referencia || ''}`
    try { if (sessionStorage.getItem(key)) return } catch { /* Sem persistência. */ }
    const controller = new AbortController()
    api.post(`${API}/api/admin/visitas`, { tipo, visitante, ...(referencia ? { referencia: String(referencia) } : {}) }, { signal: controller.signal })
      .then(() => { try { sessionStorage.setItem(key, '1') } catch { /* Sem persistência. */ } })
      .catch(() => {})
    return () => controller.abort()
  }, [statistics, autenticado, tipo, referencia])
}

