import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:3001'

function CardProduto({ produto }) {
  const src = `${API}/imagens/${produto.imagem ? produto.imagem.split('/').pop() : ''}`
  return (
    <Link to={`/catalogo/${produto.codigo}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
      <div className="bg-gray-50 p-4 h-44 flex items-center justify-center">
        <img src={src} alt={produto.nome}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
          onError={e => { e.target.src = 'https://placehold.co/200x200?text=Sem+foto' }} />
      </div>
      <div className="p-3 text-center">
        <p className="text-xs text-gray-400 font-mono">{String(produto.codigo).padStart(5, '0')}</p>
        <p className="text-sm font-medium text-gray-700 mt-1 leading-tight line-clamp-2">{produto.nome}</p>
      </div>
    </Link>
  )
}

function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [loading, setLoading] = useState(true)

  const categoriaAtual = searchParams.get('categoria') || ''
  const buscaAtual = searchParams.get('busca') || ''
  const paginaAtual = parseInt(searchParams.get('pagina') || '1')

  useEffect(() => {
    axios.get(`${API}/api/produtos/categorias`)
      .then(r => setCategorias(r.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (categoriaAtual) params.set('categoria', categoriaAtual)
    if (buscaAtual) params.set('busca', buscaAtual)
    params.set('pagina', paginaAtual)
    params.set('limite', 20)

    axios.get(`${API}/api/produtos?${params}`)
      .then(r => {
        setProdutos(r.data.produtos)
        setTotal(r.data.total)
        setTotalPaginas(r.data.totalPaginas)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [categoriaAtual, buscaAtual, paginaAtual])

  function mudarCategoria(cat) {
    setSearchParams(cat ? { categoria: cat, pagina: 1 } : { pagina: 1 })
  }

  function mudarPagina(p) {
    const params = {}
    if (categoriaAtual) params.categoria = categoriaAtual
    if (buscaAtual) params.busca = buscaAtual
    params.pagina = p
    setSearchParams(params)
    window.scrollTo(0, 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar categorias */}
      <aside className="w-56 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Categorias</h3>
        <ul className="space-y-1">
          <li>
            <button onClick={() => mudarCategoria('')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoriaAtual ? 'bg-sky-500 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Todos os produtos
              <span className="float-right text-xs opacity-70">{total}</span>
            </button>
          </li>
          {categorias.map(cat => (
            <li key={cat.categoria}>
              <button onClick={() => mudarCategoria(cat.categoria)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoriaAtual === cat.categoria ? 'bg-sky-500 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                {cat.categoria}
                <span className="float-right text-xs opacity-70">{cat.total}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-700">
              {categoriaAtual || 'Todos os produtos'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{total} produtos encontrados</p>
          </div>
          {buscaAtual && (
            <div className="bg-sky-50 text-sky-600 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              Busca: <strong>{buscaAtual}</strong>
              <button onClick={() => setSearchParams({})} className="hover:text-sky-800">✕</button>
            </div>
          )}
        </div>

        {/* Grid produtos */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg">Nenhum produto encontrado</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtos.map(p => <CardProduto key={p.codigo} produto={p} />)}
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                ← Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                const p = Math.max(1, paginaAtual - 2) + i
                if (p > totalPaginas) return null
                return (
                  <button key={p} onClick={() => mudarPagina(p)}
                    className={`w-10 h-10 rounded-lg text-sm transition-colors ${p === paginaAtual ? 'bg-sky-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Próxima →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Catalogo