import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

const slides = [
  { name: 'Outubro Rosa', theme: 'pink', title: 'Pequenos gestos. Grandes lembranças.', text: 'Brindes que espalham cuidado e conscientização.', href: '/outubro-rosa', cta: 'Conheça a seleção' },
  { name: 'Ecobags', theme: 'eco', title: 'Sua marca vai junto.', text: 'Ecobags e sacolas para fazer parte de cada dia.', image: '/banners/sacola-lona.webp', alt: 'Sacola de lona natural com alças compridas', href: '/catalogo?busca=Sacola', cta: 'Confira' },
  { name: 'Garrafas', theme: 'bottle', title: 'Presença em cada pausa.', text: 'Garrafas e squeezes para acompanhar todos os momentos.', image: '/banners/garrafas.webp', alt: 'Garrafas e copos térmicos coloridos do catálogo', href: '/catalogo?busca=Garrafa', cta: 'Confira' },
  { name: 'Mochilas', theme: 'bag', title: 'Para levar boas ideias.', text: 'Mochilas e bolsas para o trabalho e para ir mais longe.', image: '/categorias/mochilas.webp', alt: 'Mochila bege e preta do catálogo', href: '/catalogo?busca=Mochila', cta: 'Confira' },
  { name: 'Canetas', theme: 'pen', title: 'Grandes marcas deixam traços.', text: 'Canetas que colocam sua empresa nas mãos de quem importa.', image: '/banners/canetas.webp', alt: 'Canetas e acessórios de escrita do catálogo', href: '/catalogo?busca=Caneta', cta: 'Confira' },
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
    const timer = setInterval(() => { if (!document.hidden) setActive(i => (i + 1) % slides.length) }, 6000)
    return () => clearInterval(timer)
  }, [rotating])
  return <section className="hero-carousel" aria-label="Coleções em destaque" aria-roledescription="carrossel"
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <h1 className="sr-only">Brindes personalizados para empresas — LM Bags &amp; Brindes</h1>
    <div aria-live={rotating ? 'off' : 'polite'}>
      {slides.map((slide, index) => <div key={slide.name} hidden={active !== index} className={`hero-slide hero-${slide.theme}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}: ${slide.name}`}>
        {slide.theme === 'pink' && <img className="hero-backdrop" src="/banners/outubro-cenario.webp" alt="" width="2172" height="724" fetchPriority="high" />}<div className="hero-inner"><div className="hero-copy">
          {slide.theme === 'pink' ? <><p className="october-script">Outubro</p><p className="october-word">ROSA</p><p className="hero-awareness">Cuidado que inspira. Presença que acolhe.</p></> : <><p className="hero-eyebrow">Feito para acompanhar sua marca</p><h2>{slide.title}</h2><p className="hero-description">{slide.text}</p></>}
          <Link className="hero-cta" to={slide.href}>{slide.cta} <span aria-hidden="true">→</span></Link>
        </div>
        {slide.theme === 'pink' ? <div className="pink-scene"><div className="pink-message"><h2>{slide.text}</h2><p>Um convite à atenção e ao autocuidado.</p></div><Link to="/outubro-rosa" aria-label="Ver produtos para a campanha Outubro Rosa" className="pink-products"><img className="pink-product pink-product-0" src="/categorias/sacolas.webp" alt="Sacola de lona do catálogo" width="400" height="400" fetchPriority="high" /><img className="pink-product pink-product-1" src="/categorias/mochilas.webp" alt="Mochila bege do catálogo" width="400" height="400" fetchPriority="high" /><img className="pink-product pink-product-2" src="/categorias/garrafas.webp" alt="Garrafa rosa do catálogo" width="400" height="400" fetchPriority="high" /><img className="pink-product pink-product-3" src="/categorias/copos.webp" alt="Copo térmico do catálogo" width="400" height="400" fetchPriority="high" /><img className="pink-product pink-product-4" src="/categorias/cadernetas.webp" alt="Caderneta do catálogo" width="400" height="400" fetchPriority="high" /><img className="pink-product pink-product-5" src="/categorias/necessaires.webp" alt="Nécessaire do catálogo" width="400" height="400" fetchPriority="high" /></Link></div> : <Link className="hero-photo" to={slide.href} aria-label={`Ver ${slide.name.toLowerCase()} no catálogo`}><img src={slide.image} alt={slide.alt} width="797" height="393" loading="lazy" decoding="async" /></Link>}
        </div>
      </div>)}
    </div>
    <button type="button" className="hero-prev" aria-label="Banner anterior" onClick={() => setActive((active - 1 + slides.length) % slides.length)}>‹</button>
    <button type="button" className="hero-next" aria-label="Próximo banner" onClick={() => setActive((active + 1) % slides.length)}>›</button>
    <div className="hero-controls"><div className="hero-dots">{slides.map((slide, index) => <button key={slide.name} type="button" aria-label={`Mostrar banner de ${slide.name}`} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)}><span /></button>)}</div>
      <button type="button" className="hero-pause" aria-label={paused ? 'Retomar carrossel automático' : 'Pausar carrossel automático'} onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button>
    </div>
  </section>
}
