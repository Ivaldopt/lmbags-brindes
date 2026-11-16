import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

const slides = [
  {
    name: 'Sacolas e Ecobags', theme: 'nature',
    eyebrow: 'SACOLAS & ECOBAGS', title: 'Sua marca em todos os lugares.',
    text: 'Soluções personalizadas para eventos, empresas e ações promocionais.',
    image: '/categorias/sacolas.webp', alt: 'Sacolas promocionais da LM Bags & Brindes',
    detailImage: '/banners/ecobags.webp', detailAlt: 'Ecobags do catálogo',
    href: '/catalogo?busca=Sacola', quote: 'sacolas e ecobags',
  },
  {
    name: 'Garrafas e Copos', theme: 'sky',
    eyebrow: 'GARRAFAS & COPOS', title: 'Brindes que fazem parte da rotina.',
    text: 'Produtos úteis e marcantes para divulgar a sua empresa todos os dias.',
    image: '/categorias/garrafas.webp', alt: 'Garrafas personalizáveis do catálogo',
    detailImage: '/categorias/copos.webp', detailAlt: 'Copos promocionais do catálogo',
    href: '/catalogo?busca=Garrafa', quote: 'garrafas e copos',
  },
  {
    name: 'Mochilas e Bolsas', theme: 'sand',
    eyebrow: 'MOCHILAS & BOLSAS', title: 'Leve sua marca mais longe.',
    text: 'Praticidade e visibilidade para equipes, clientes e eventos.',
    image: '/categorias/mochilas.webp', alt: 'Mochilas promocionais do catálogo',
    detailImage: '/categorias/bolsas-termicas.webp', detailAlt: 'Bolsas térmicas do catálogo',
    href: '/catalogo?busca=Mochila', quote: 'mochilas e bolsas',
  },
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
    <section className="hero-carousel hero-showcase" aria-label="Destaques do catálogo" aria-roledescription="carrossel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <h1 className="sr-only">Brindes personalizados para empresas — LM Bags &amp; Brindes</h1>
      <div aria-live={rotating ? 'off' : 'polite'}>
        {slides.map((slide, index) => (
          <div key={slide.name} hidden={active !== index}
            className={`hero-slide hero-showcase-${slide.theme}`} role="group"
            aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}: ${slide.name}`}>
            <div className="hero-inner">
              <div className="hero-copy">
                <p className="hero-eyebrow"><span className="hero-pulse" /> {slide.eyebrow}</p>
                <h2>{slide.title}</h2>
                <p className="hero-description">{slide.text}</p>
                <div className="hero-actions">
                  <Link className="hero-cta" to={slide.href}>EXPLORAR PRODUTOS <span aria-hidden="true">→</span></Link>
                  <a className="hero-secondary" href={quoteUrl(slide.quote)}
                    target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
                </div>
              </div>
              <div className="hero-showcase-visual">
                <div className="hero-showcase-orbit" aria-hidden="true" />
                <Link className="hero-showcase-main" to={slide.href} aria-label={`Explorar ${slide.name.toLowerCase()}`}>
                  <img src={slide.image} alt={slide.alt} width="540" height="540"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : undefined} decoding="async" />
                </Link>
                <Link className="hero-showcase-mini" to={slide.href} aria-label={`Ver mais opções de ${slide.name.toLowerCase()}`}>
                  <img src={slide.detailImage} alt={slide.detailAlt} width="220" height="220"
                    loading="lazy" decoding="async" />
                </Link>
                <div className="hero-showcase-note">PERSONALIZE COM SUA MARCA <span aria-hidden="true">✳</span></div>
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
        <div className="hero-dots">{slides.map((slide, index) =>
          <button key={slide.name} type="button" aria-label={`Mostrar banner de ${slide.name}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => setActive(index)}><span /></button>
        )}</div>
        <button type="button" className="hero-pause"
          aria-label={paused ? 'Retomar carrossel automático' : 'Pausar carrossel automático'}
          onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button>
      </div>
    </section>
  )
}
