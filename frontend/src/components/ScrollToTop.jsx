import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation()

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = previous }
  }, [])

  useLayoutEffect(() => {
    if (hash) {
      let id
      try { id = decodeURIComponent(hash.slice(1)) } catch { id = hash.slice(1) }
      const section = document.getElementById(id)
      if (section) {
        section.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, search, hash, key])

  return null
}
