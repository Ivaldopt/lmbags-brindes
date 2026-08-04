import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`

function Dashboard() {
  const { token, email, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [topProdutos, setTopProdutos] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => {
      setStats(r.data)
      setTopProdutos(r.data.topProdutos || [])
    }).catch(console.error)
  }, [])

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">⚙️ Painel Admin</span>
          <span className="text-gray-400 text-sm">LMBags e Brindes</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{email}</span>
          <Link to="/" className="text-gray-400 hover:text-white text-sm">Ver site →</Link>
          <button onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-sky-500">{stats?.totalProdutos ?? '...'}</p>
            <p className="text-sm text-gray-500 mt-1">Produtos</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-sky-500">{stats?.totalCategorias ?? '...'}</p>
            <p className="text-sm text-gray-500 mt-1">Categorias</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-green-500">{stats?.visitasHoje ?? '...'}</p>
            <p className="text-sm text-gray-500 mt-1">Visitas hoje</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-green-500">{stats?.visitasMes ?? '...'}</p>
            <p className="text-sm text-gray-500 mt-1">Visitas este mês</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Top 5 produtos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">🏆 Top 5 produtos mais acessados</h2>
            {topProdutos.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma visita registrada ainda.</p>
            ) : (
              <div className="space-y-3">
                {topProdutos.map((p, i) => (
                  <div key={p.referencia} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                    <div className="flex-1">
                      <Link to={`/catalogo/${p.referencia}`}
                        className="text-sm font-medium text-sky-500 hover:text-sky-600">
                        Produto #{p.referencia}
                      </Link>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{p.total} visitas</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ações rápidas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">⚡ Ações rápidas</h2>
            <div className="space-y-3">
              <Link to="/admin/produtos"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Gerenciar Produtos</p>
                  <p className="text-xs text-gray-400">Editar, deletar ou adicionar</p>
                </div>
              </Link>
              <Link to="/admin/produtos/novo"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <span className="text-2xl">➕</span>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Novo Produto</p>
                  <p className="text-xs text-gray-400">Cadastrar um novo produto</p>
                </div>
              </Link>
              <Link to="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Ver Site</p>
                  <p className="text-xs text-gray-400">Visualizar o site público</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard