import { Link } from 'react-router-dom'
import { business } from '../lib/business'
import { openCookieSettings } from '../lib/consent'

const policies = [['termos-de-uso','Termos de uso'],['politica-de-privacidade','Política de privacidade'],['politica-de-cookies','Política de cookies'],['trocas-e-devolucoes','Trocas e devoluções'],['entrega-e-pagamento','Entrega e pagamento']]
export default function Footer() {
  return <footer className="bg-[#0a2139] text-slate-300 mt-14">
    <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div><Link to="/"><img src="/Logo LM BAGS E BRINDES Branco.png" alt="LM Bags e Brindes" className="h-24 w-auto mb-5" loading="lazy" /></Link><p className="text-sm leading-7">Brindes que aproximam pessoas e dão presença à sua marca.</p><p className="text-sm mt-4">{business.address || business.city}</p>{business.legalName && <p className="text-sm mt-3">{business.legalName}<br />{business.taxId}</p>}</div>
      <nav aria-label="Institucional"><h2 className="text-white font-semibold mb-5">Conheça a LM Bags & Brindes</h2><ul className="space-y-3 text-sm"><li><Link to="/quem-somos">Quem somos</Link></li><li><Link to="/catalogo">Todos os produtos</Link></li><li><Link to="/outubro-rosa">Outubro Rosa</Link></li><li><Link to="/atendimento-e-reclamacoes">Atendimento e reclamações</Link></li>{business.complaintsBookUrl && <li><a href={business.complaintsBookUrl} target="_blank" rel="noopener noreferrer">Livro de Reclamações</a></li>}</ul></nav>
      <nav aria-label="Políticas e privacidade"><h2 className="text-white font-semibold mb-5">Informações e políticas</h2><ul className="space-y-3 text-sm">{policies.map(([path,label]) => <li key={path}><Link to={`/${path}`}>{label}</Link></li>)}<li><button type="button" onClick={openCookieSettings} className="underline cursor-pointer">Preferências de cookies</button></li></ul></nav>
      <div><h2 className="text-white font-semibold mb-5">Vamos conversar?</h2><p className="text-sm leading-7 mb-4">Conte sua ideia e encontre os produtos para a próxima ação da sua empresa.</p><a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-3 border border-slate-500 rounded-lg text-white text-sm">Falar pelo WhatsApp</a><a className="block text-sm mt-4 break-all" href={`mailto:${business.email}`}>{business.email}</a></div>
    </div><div className="border-t border-slate-700 px-6 py-5 text-xs text-center">© {new Date().getFullYear()} LM Bags &amp; Brindes. Todos os direitos reservados.</div>
  </footer>
}
