import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

// Catálogo LM: chamadas editoriais sem especificações técnicas não verificadas.
const slides = [
  {
    name: 'Mochilas e Bolsas',
    label: 'Coleção corporativa',
    title: ['Mochilas e bolsas', 'para acompanhar', 'sua marca.'],
    description: 'Praticidade, estilo e presença para a rotina dos seus clientes.',
    features: ['Para equipes e eventos', 'Personalização sob consulta'],
    background: '/banners/mochilas.webp',
    main: '/categorias/mochilas.webp',
    secondary: '/categorias/bolsas-termicas.webp',
    search: 'Mochila',
  },
  {
    name: 'Garrafas e Copos',
    label: 'Brindes para o dia a dia',
    title: ['Garrafas e copos', 'que fazem sua', 'marca circular.'],
    description: 'Produtos de uso frequente para ações e presentes corporativos.',
    features: ['Diversas opções', 'Sua marca em destaque'],
    background: '/banners/garrafas.webp',
    main: '/categorias/garrafas.webp',
    secondary: '/categorias/copos.webp',
    search: 'Garrafa',
  },
  {
    name: 'Sacolas e Ecobags',
    label: 'Presença em movimento',
    title: ['Sacolas e ecobags', 'para levar sua', 'marca mais longe.'],
    description: 'Uma escolha versátil para eventos, lojas e campanhas.',
    features: ['Uso no dia a dia', 'Modelos personalizáveis'],
    background: '/banners/ecobags.webp',
    main: '/categorias/sacolas.webp',
    secondary: '/banners/sacola-lona.webp',
    search: 'Sacola',
  },
]

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
    }, 6500)
    return () => clearInterval(timer)
  }, [rotating])

  return (
    <section
      className="lm-hero"
      aria-label="Produtos em destaque"
      aria-roledescription="carrossel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    >
      <h1 className="sr-only">LM Bags &amp; Brindes — brindes personalizados para empresas</h1>
      <div aria-live={rotating ? 'off' : 'polite'}>
        {slides.map((slide, index) => (
          <div
            className="lm-hero-slide"
            key={slide.name}
            hidden={active !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${slides.length}: ${slide.name}`}
          >
            <div className="lm-hero-texture" aria-hidden="true" />
            <div className="lm-hero-photo" aria-hidden="true">
              <img
                src={slide.background}
                alt=""
                width="1000"
                height="650"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </div>
            <div className="lm-hero-content">
              <div className="lm-hero-copy">
                <p className="lm-hero-label">{slide.label}</p>
                <h2>{slide.title.map((line, lineIndex) =>
                  <span key={lineIndex}>{line}</span>
                )}</h2>
                <p className="lm-hero-description">{slide.description}</p>
                <div className="lm-hero-features">
                  {slide.features.map((feature, featureIndex) => (
                    <div key={feature} className="lm-hero-feature">
                      <span className="lm-hero-feature-icon" aria-hidden="true">{featureIndex === 0 ? '✓' : '✦'}</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="lm-hero-bottom">
                  <div className="lm-hero-thumbs" aria-label="Exemplos da categoria">
                    <div className="lm-hero-thumb"><img src={slide.main} alt={`Produto da categoria ${slide.name}`} width="120" height="120" loading="lazy" /></div>
                    <div className="lm-hero-thumb"><img src={slide.secondary} alt={`Outra opção de ${slide.name}`} width="120" height="120" loading="lazy" /></div>
                  </div>
                  <Link className="lm-hero-cta" to={`/catalogo?busca=${encodeURIComponent(slide.search)}`}>Veja mais <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="lm-hero-prev" type="button" aria-label="Banner anterior" onClick={() => setActive(i => (i + slides.length - 1) % slides.length)}>‹</button>
      <button className="lm-hero-next" type="button" aria-label="Próximo banner" onClick={() => setActive(i => (i + 1) % slides.length)}>›</button>
      <div className="lm-hero-controls">
        {slides.map((slide, index) =>
          <button key={slide.name} type="button" className={index === active ? 'is-active' : ''}
            aria-label={`Exibir ${slide.name}`} aria-current={index === active ? 'true' : undefined}
            onClick={() => setActive(index)} />
        )}
        <button type="button" className="lm-hero-pause" aria-label={paused ? 'Retomar rotação' : 'Pausar rotação'} onClick={() => setPaused(p => !p)}>{paused ? '▶' : 'Ⅱ'}</button>
      </div>
    </section>
  )
}
