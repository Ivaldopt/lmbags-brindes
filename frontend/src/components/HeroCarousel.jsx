import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

// Artes horizontais aprovadas: 2172 × 724 px, sem logomarca.
// Enquanto os arquivos não estiverem em public/banners, cada slide mantém
// uma versão de catálogo funcional em vez de mostrar uma imagem quebrada.
const slides = [
  {
    name: 'Mochilas e Bolsas',
    image: '/banners/lm-mochilas.png',
    fallbackImage: '/banners/mochilas.webp',
    title: 'Mochilas e bolsas para acompanhar sua marca.',
    description: 'Praticidade, estilo e presença para a rotina dos seus clientes.',
    search: 'Mochila',
  },
  {
    name: 'Garrafas e Copos',
    image: '/banners/lm-garrafas.png',
    fallbackImage: '/banners/garrafas.webp',
    title: 'Sua marca, todos os dias.',
    description: 'Produtos que fazem parte da rotina dos seus clientes.',
    search: 'Garrafa',
  },
  {
    name: 'Sacolas e Ecobags',
    image: '/banners/lm-sacolas.png',
    fallbackImage: '/banners/ecobags.webp',
    title: 'Sua marca em movimento.',
    description: 'Praticidade e visibilidade em cada ocasião.',
    search: 'Sacola',
  },
]

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [focused, setFocused] = useState(false)
  const [ready, setReady] = useState({})
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

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
    }, 6500)
    return () => clearInterval(timer)
  }, [rotating])

  return (
    <section
      className="lm-banner-carousel"
      aria-label="Coleções em destaque"
      aria-roledescription="carrossel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <h1 className="sr-only">LM Bags &amp; Brindes — brindes personalizados para empresas</h1>
      <div aria-live={rotating ? 'off' : 'polite'}>
        {slides.map((slide, index) => {
          const href = `/catalogo?busca=${encodeURIComponent(slide.search)}`
          return (
            <div
              key={slide.name}
              className="lm-banner-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}: ${slide.name}`}
              hidden={index !== active}
            >
              <img
                className="lm-banner-preload"
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading={index === 0 ? 'eager' : 'lazy'}
                onLoad={() => setReady(prev => ({ ...prev, [slide.image]: true }))}
                onError={() => setReady(prev => ({ ...prev, [slide.image]: false }))}
              />
              {ready[slide.image] ? (
                <Link className="lm-banner-art" to={href}
                  aria-label={`Veja mais: ${slide.name} no catálogo`}>
                  <img src={slide.image} alt={`${slide.name}: ${slide.description}`}
                    width="2172" height="724" decoding="async" />
                </Link>
              ) : (
                <div className="lm-banner-fallback">
                  <div className="lm-banner-fallback-copy">
                    <p className="lm-banner-category">{slide.name}</p>
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                    <Link to={href} className="lm-banner-fallback-button">Veja mais →</Link>
                  </div>
                  <Link to={href} className="lm-banner-fallback-photo"
                    aria-label={`Conhecer ${slide.name.toLowerCase()}`}>
                    <img src={slide.fallbackImage} alt={slide.name} width="797" height="393" />
                  </Link>
                </div>
              )}
              {ready[slide.image] && (
                <Link to={href} className="lm-banner-mobile-cta">Veja mais sobre {slide.name} →</Link>
              )}
            </div>
          )
        })}
      </div>
      <button type="button" className="lm-banner-prev" aria-label="Banner anterior"
        onClick={() => setActive(i => (i + slides.length - 1) % slides.length)}>‹</button>
      <button type="button" className="lm-banner-next" aria-label="Próximo banner"
        onClick={() => setActive(i => (i + 1) % slides.length)}>›</button>
      <div className="lm-banner-dots" aria-label="Selecionar banner">
        {slides.map((slide, index) => (
          <button
            key={slide.name} type="button"
            aria-label={`Mostrar ${slide.name}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => setActive(index)}
          />
        ))}
        <button type="button" className="lm-banner-pause"
          aria-label={paused ? 'Retomar rotação automática' : 'Pausar rotação automática'}
          onClick={() => setPaused(value => !value)}>{paused ? '▶' : 'Ⅱ'}</button>
      </div>
    </section>
  )
}
