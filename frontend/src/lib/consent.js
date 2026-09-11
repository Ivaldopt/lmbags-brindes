import { clearVisitorId } from './visitor.js'
import { useSyncExternalStore } from 'react'

const KEY = 'lmbags_privacidade_v1'
const empty = Object.freeze({ decided: false, statistics: false, external: false })
const listeners = new Set()
function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved?.version === 1 && typeof saved.statistics === 'boolean' && typeof saved.external === 'boolean' && Number.isFinite(saved.savedAt) && Date.now() - saved.savedAt < 180 * 86400000 && saved.savedAt <= Date.now()) return { ...saved, decided: true }
  } catch { /* Armazenamento indisponível: opcionais permanecem desligados. */ }
  return empty
}
let current = typeof window === 'undefined' ? empty : read()
function emit() { listeners.forEach(fn => fn()) }
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key === KEY || event.key === null) { current = read(); emit() }
})
export function saveConsent(choices) {
  if (choices.statistics !== true) clearVisitorId()
  current = { decided: true, version: 1, statistics: choices.statistics === true, external: choices.external === true, savedAt: Date.now() }
  try { localStorage.setItem(KEY, JSON.stringify(current)) } catch { /* Escolha válida nesta sessão. */ }
  emit()
}
export function openCookieSettings() { window.dispatchEvent(new Event('lmbags-cookie-settings')) }
export function getConsent() { return current }
export function useConsent() {
  return useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn) }, getConsent, () => empty)
}

