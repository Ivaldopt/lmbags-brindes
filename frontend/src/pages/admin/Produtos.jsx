import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`

function Produtos() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregar()
  }, [pagina])

  async function carregar() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ pagina, limite: 20 })
      if (busca) params.set('busca', busca)
      const res = await axios.get(`${API}/api/admin/produtos?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProdutos(res.data.produtos)
      setTotal(res.data.total)
      setTotalPaginas(res.data.totalPaginas)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/admin/login') }
    } finally {
      setLoading(false)
    }
  }

  async function deletar(id, nome) {
    if (!confirm(`Deletar "${nome}"?`)) return
    try {
      await axios.delete(`${API}/api/admin/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      carregar()
    } catch (err) {
      alert('Erro ao deletar produto')
    }
  }

  function handleBusca(e) {
    e.preventDefault()
    setPagina(1)
    carregar()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-400 hover:text-white">← Dashboard</Link>
          <span className="text-lg font-bold">📦 Produtos</span>
        </div>
        <Link to="/admin/produtos/novo"
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + Novo Produto
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Busca */}
        <form onSubmit={handleBusca} className="flex gap-3 mb-6">
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou categoria..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
          />
          <button type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg text-sm transition-colors">
            Buscar
          </button>
        </form>

        <p className="text-sm text-gray-500 mb-4">{total} produtos encontrados</p>

        {/* Tabela */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Imagem</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Código</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Nome</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Categoria</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => {
                  const nomeArquivo = p.imagem ? p.imagem.split('/').pop().replace(/\.[^/.]+$/, '') : ''
                  const src = nomeArquivo ? `https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${nomeArquivo}` : ''
                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img src={src} alt={p.nome}
                          className="w-12 h-12 object-contain"
                          onError={e => { e.target.src = 'https://placehold.co/48x48?text=?' }} />
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-400">{String(p.codigo).padStart(5, '0')}</td>
                      <td className="px-4 py-3 font-medium text-gray-700 max-w-xs truncate">{p.nome}</td>
                      <td className="px-4 py-3 text-gray-500">{p.categoria}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/produtos/editar/${p.id}`}
                            className="bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1 rounded text-xs font-medium transition-colors">
                            Editar
                          </Link>
                          <button onClick={() => deletar(p.id, p.nome)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded text-xs font-medium transition-colors">
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            ← Anterior
          </button>
          <span className="text-sm text-gray-500">Página {pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Produtos