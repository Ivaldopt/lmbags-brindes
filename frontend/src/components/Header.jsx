import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { business } from '../lib/business'

export default function Header() {
  const [busca, setBusca] = useState('')
  const navigate = useNavigate()
  function search(event) { event.preventDefault(); if (busca.trim()) navigate(`/catalogo?busca=${encodeURIComponent(busca.trim())}`) }
  const navStyle = ({ isActive }) => `px-3 sm:px-5 py-3.5 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${isActive ? 'border-sky-400 text-white bg-white/5' : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'}`
  return <header className="w-full bg-white">
    <div className="bg-[#081d31] text-slate-200 px-5 py-2.5 text-xs"><div className="max-w-7xl mx-auto flex justify-between gap-4"><p>Personalização para empresas e ocasiões especiais</p><Link to="/atendimento-e-reclamacoes" className="hidden sm:inline underline underline-offset-4">Central de atendimento</Link></div></div>
    <div className="max-w-7xl mx-auto px-5 py-5 flex flex-wrap md:flex-nowrap items-center gap-5 md:gap-10">
      <Link to="/" className="shrink-0"><img src="/Logo LM BAGS E BRINDES ATUALIZADO.png" alt="LM Bags e Brindes — início" className="h-16 md:h-20 w-auto object-contain" /></Link>
      <form role="search" onSubmit={search} className="order-3 md:order-none w-full md:flex-1 flex items-center rounded-lg border border-slate-300 overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-sky-700">
        <input type="search" aria-label="Buscar produtos" placeholder="O que você procura para sua marca?" maxLength={200} value={busca} onChange={e => setBusca(e.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
        <button type="submit" className="bg-[#0a435e] text-white px-5 self-stretch text-sm hover:bg-sky-800">Buscar</button>
      </form>
      <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm text-[#0a435e] border border-slate-200 rounded-lg px-4 py-3 hover:bg-slate-50"><span className="hidden lg:block text-xs text-slate-500 mb-1">Vamos tirar sua ideia do papel?</span>Solicitar orçamento ↗</a>
    </div>
    <nav aria-label="Navegação principal" className="bg-[#0a2139]"><div className="max-w-7xl mx-auto px-2 sm:px-5 flex flex-wrap"><NavLink to="/" end className={navStyle}>Início</NavLink><NavLink to="/catalogo" className={navStyle}>Produtos</NavLink><NavLink to="/quem-somos" className={navStyle}>Quem somos</NavLink><NavLink to="/atendimento-e-reclamacoes" className={navStyle}>Atendimento</NavLink></div></nav>
  </header>
}
