const KEY = 'lm_visitante_v1'
const MAX_AGE = 30 * 86400000
let current
export function clearVisitorId() {
  current = undefined
  try { localStorage.removeItem(KEY) } catch { /* Armazenamento bloqueado. */ }
}
export function getVisitorId() {
  const now = Date.now()
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (/^[0-9a-f-]{36}$/i.test(saved?.id) && saved.expires > now && saved.expires <= now + MAX_AGE) current = saved
  } catch { /* Sem armazenamento, usa identidade em memória. */ }
  if (!current || current.expires <= now) current = { id: crypto.randomUUID(), expires: now + MAX_AGE }
  try { localStorage.setItem(KEY, JSON.stringify(current)) } catch { /* Válido nesta página. */ }
  return current.id
}
