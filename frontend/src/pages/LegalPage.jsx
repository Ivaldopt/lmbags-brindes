import { Link, useParams } from 'react-router-dom'
import { business } from '../lib/business'
import { legalContent } from '../lib/legalContent'
import { openCookieSettings } from '../lib/consent'
import '../components/Privacy.css'

export default function LegalPage() {
  const { page } = useParams()
  const content = Object.hasOwn(legalContent, page) ? legalContent[page] : null
  if (!content) return <div className="legal-page"><h1>Página não encontrada</h1><Link to="/">Voltar ao início</Link></div>
  return <article className="legal-page">
    <Link to="/">Início</Link><h1>{content.title}</h1><p className="legal-intro">{content.intro}</p>
    <p className="text-sm">Atualizado em 10 de setembro de 2026</p>
    {content.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
    {page === 'politica-de-cookies' && <button type="button" onClick={openCookieSettings} className="underline font-semibold text-sky-800">Abrir preferências de cookies</button>}
    {page === 'atendimento-e-reclamacoes' && <p><a href="https://www.consumidor.gov.br/" target="_blank" rel="noopener noreferrer">Consultar o Consumidor.gov.br</a>{business.complaintsBookUrl && <> · <a href={business.complaintsBookUrl} target="_blank" rel="noopener noreferrer">Livro de Reclamações</a></>}</p>}
    <aside className="contact-card"><h2 className="!mt-0">{business.brand}</h2>
      {business.legalName && <p>{business.legalName} · {business.taxId}</p>}
      <p>{business.address || business.city}</p>
      <p><a href={`mailto:${business.email}`}>{business.email}</a></p>
      <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">Atendimento pelo WhatsApp</a>
    </aside>
  </article>
}
