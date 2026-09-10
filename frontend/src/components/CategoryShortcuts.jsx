import { Link } from 'react-router-dom'
import { FiGrid, FiShoppingBag, FiDroplet, FiBriefcase, FiEdit3, FiBookOpen, FiDownload, FiArrowUpRight } from 'react-icons/fi'

const shortcuts = [
  { label: 'Ecobags', search: 'Sacola', Icon: FiShoppingBag },
  { label: 'Garrafas', search: 'Garrafa', Icon: FiDroplet },
  { label: 'Mochilas', search: 'Mochila', Icon: FiBriefcase },
  { label: 'Canetas', search: 'Caneta', Icon: FiEdit3 },
  { label: 'Cadernetas', search: 'Caderneta', Icon: FiBookOpen },
]
export default function CategoryShortcuts() {
  return <nav aria-label="Acesso rápido ao catálogo" className="border-b border-slate-200 bg-white">
    <div className="max-w-7xl mx-auto px-5 flex items-center gap-2 overflow-x-auto py-3">
      <Link to="/catalogo" className="flex shrink-0 items-center gap-2 rounded-lg bg-[#0a2139] text-white px-4 py-3 text-sm font-semibold"><FiGrid aria-hidden="true" />Todos os produtos</Link>
      {shortcuts.map(({ label, search, Icon }) => <Link key={search} to={`/catalogo?busca=${search}`} className="flex shrink-0 items-center gap-2 px-4 py-3 rounded-lg text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-800"><Icon aria-hidden="true" />{label}<FiArrowUpRight className="hidden xl:block" aria-hidden="true" /></Link>)}
      <a href="#baixar-catalogo" className="ml-auto flex shrink-0 items-center gap-2 px-4 py-3 text-sm text-sky-800 font-semibold"><FiDownload aria-hidden="true" />Baixar catálogo</a>
    </div>
  </nav>
}
