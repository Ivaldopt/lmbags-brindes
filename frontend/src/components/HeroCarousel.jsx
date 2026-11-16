import { useEffect, useState } from 'react'
import './HeroCarousel.css'

const slides = [
  { name: 'Mochilas e Bolsas', theme: 'bag', category: 'MOCHILAS & BOLSAS', title: 'Leve sua marca mais longe.', text: 'Produtos funcionais para equipes, eventos e ações promocionais.', image: '/banners/mochilas.webp', alt: 'Mochilas do catálogo LM Bags & Brindes', quote: 'mochilas e bolsas' },
  { name: 'Garrafas e Copos', theme: 'bottle', category: 'GARRAFAS & COPOS', title: 'Sua marca, todos os dias.', text: 'Garrafas e copos personalizados que permanecem na rotina do cliente.', image: '/banners/garrafas.webp', alt: 'Garrafas do catálogo LM Bags & Brindes', quote: 'garrafas e copos' },
  { name: 'Sacolas e Ecobags', theme: 'eco', category: 'SACOLAS & ECOBAGS', title: 'Sua marca em movimento.', text: 'Sacolas personalizadas para destacar sua empresa em cada ocasião.', image: '/banners/sacola-lona.webp', alt: 'Sacolas de lona do catálogo LM Bags & Brindes', quote: 'sacolas e ecobags' },
]

const quoteUrl = category =>
  `https://wa.me/557199124780?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento de ${category} personalizados pela LM Bags & Brindes.`)}`

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setReduced(media.matches)
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])

  const rotating = !paused && !focused && !reduced
  useEffect(() => {
    if (!rotating) return
    const timer = setInterval(() => {
      if (!document.hidden) setActive(i => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [rotating])

  return (
    <section className="hero-carousel hero-reference" aria-label="Coleções em destaque" aria-roledescription="carrossel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}>
      <h1 className="sr-only">Brindes personalizados para empresas — LM Bags &amp; Brindes</h1>
      <div aria-live={rotating ? 'off' : 'polite'}>
        {slides.map((slide, index) => (
          <div key={slide.name} hidden={active !== index}
            className={`hero-slide hero-${slide.theme}`} role="group"
            aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}: ${slide.name}`}>
            <div className="hero-inner">
              <div className="hero-copy">
                <div className="hero-brand">
                  <span className="hero-brand-line" aria-hidden="true" />
                  <span>LM&nbsp; / &nbsp;BAGS &amp; BRINDES</span>
                </div>
                <p className="hero-eyebrow">{slide.category}</p>
                <h2>{slide.title}</h2>
                <p className="hero-description">{slide.text}</p>
                <a className="hero-cta" href={quoteUrl(slide.quote)} target="_blank" rel="noopener noreferrer">SOLICITAR ORÇAMENTO</a>
              </div>
              <div className="hero-photo">
                <img src={slide.image} alt={slide.alt} width="797" height="393"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : undefined} decoding="async" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="hero-prev" aria-label="Banner anterior"
        onClick={() => setActive(i => (i - 1 + slides.length) % slides.length)}>‹</button>
      <button type="button" className="hero-next" aria-label="Próximo banner"
        onClick={() => setActive(i => (i + 1) % slides.length)}>›</button>
      <div className="hero-controls">
        <div className="hero-dots">
          {slides.map((slide, index) => (
            <button key={slide.name} type="button" aria-label={`Mostrar banner de ${slide.name}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => setActive(index)}><span /></button>
          ))}
        </div>
        <button type="button" className="hero-pause"
          aria-label={paused ? 'Retomar carrossel automático' : 'Pausar carrossel automático'}
          onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button>
      </div>
    </section>
  )
}
