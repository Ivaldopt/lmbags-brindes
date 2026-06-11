import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Header() {
  const [busca, setBusca] = useState('')
  const navigate = useNavigate()

  function handleBusca(e) {
    e.preventDefault()
    if (busca.trim()) {
      navigate(`/catalogo?busca=${busca}`)
    }
  }

  return (
    <header className="w-full">
      {/* Topo — logo + busca */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-sky-600 tracking-tight">LM</span>
          <span className="text-2xl font-light text-gray-700 tracking-tight">BAGS</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest ml-1">Brindes</span>
        </Link>

        {/* Busca */}
        <form onSubmit={handleBusca} className="flex items-center gap-2 w-full max-w-md mx-8">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-4 py-2 text-sm transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* Info */}
        <div className="text-right text-xs text-gray-400 hidden lg:block">
          <p>Atendemos somente empresas</p>
          <p>especializadas na revenda de brindes</p>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="bg-sky-500 text-white text-sm font-medium">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
          <Link to="/" className="px-4 py-3 hover:bg-sky-600 transition-colors">
            HOME
          </Link>
          <Link to="/catalogo" className="px-4 py-3 hover:bg-sky-600 transition-colors">
            PRODUTOS
          </Link>
          <Link to="/catalogo?novidades=true" className="px-4 py-3 hover:bg-sky-600 transition-colors">
            LANÇAMENTOS
          </Link>
          <Link to="/quem-somos" className="px-4 py-3 hover:bg-sky-600 transition-colors">
            QUEM SOMOS
          </Link>
          <Link to="/catalogo?outlet=true" className="px-4 py-3 hover:bg-sky-600 transition-colors">
            PONTA DE ESTOQUE
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header