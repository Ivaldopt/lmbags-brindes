import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollReveal() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/admin') || !('IntersectionObserver' in window)) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const seen = new WeakSet()
    const animations = new Set()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        if (media.matches || !entry.target.animate) continue
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 600, easing: 'cubic-bezier(.2,.65,.3,1)' })
        animations.add(animation)
        animation.onfinish = () => animations.delete(animation)
      }
    }, { threshold: 0.08 })
    const main = document.getElementById('conteudo')
    if (!main) return () => observer.disconnect()
    const scan = () => main.querySelectorAll('[data-reveal]').forEach(el => {
      if (!seen.has(el)) { seen.add(el); observer.observe(el) }
    })
    scan()
    const changes = new MutationObserver(scan)
    changes.observe(main, { childList: true, subtree: true })
    const stop = () => { if (media.matches) { animations.forEach(a => a.cancel()); animations.clear() } }
    media.addEventListener('change', stop)
    return () => { observer.disconnect(); changes.disconnect(); animations.forEach(a => a.cancel()); media.removeEventListener('change', stop) }
  }, [pathname, search])
  return null
}
