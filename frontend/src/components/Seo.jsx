import { legalContent } from '../lib/legalContent'
import { business } from '../lib/business'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Seo() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    const admin = pathname.startsWith('/admin')
    const legal = Object.hasOwn(legalContent, pathname.slice(1)) ? legalContent[pathname.slice(1)] : null
    const title = legal?.title || (pathname === '/outubro-rosa' ? 'Outubro Rosa — Brindes para sua campanha' : admin ? 'Área administrativa' : pathname === '/quem-somos' ? 'Quem somos' : pathname.startsWith('/catalogo/') ? 'Detalhes do produto' : pathname === '/catalogo' ? 'Catálogo de brindes personalizados' : 'Brindes personalizados para empresas')
    document.title = `${title} | LM Bags & Brindes`
    const params = new URLSearchParams(search)
    const canonicalParams = new URLSearchParams()
    for (const key of ['categoria', 'pagina']) if (params.get(key)) canonicalParams.set(key, params.get(key))
    const suffix = pathname === '/catalogo' && canonicalParams.size ? `?${canonicalParams}` : ''
    const canonical = `https://lmbagsebrindes.com.br${pathname}${suffix}`
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = canonical
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[name="description"]')?.setAttribute('content', legal ? legal.intro : pathname === '/outubro-rosa' ? 'Ideias de brindes para ações de conscientização no Outubro Rosa. Conheça opções de sacolas, garrafas, mochilas e canetas.' : pathname === '/quem-somos' ? 'Conheça a LM Bags & Brindes e encontre opções para a sua próxima ação promocional.' : 'Ecobags, garrafas, mochilas e canetas para personalização. Explore o catálogo da LM Bags & Brindes e solicite um orçamento.')
    document.querySelector('meta[name="robots"]')?.setAttribute('content', admin || params.has('busca') || (legal && (!business.legalName || !business.taxId || !business.address)) ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  }, [pathname, search])
  return null
}
