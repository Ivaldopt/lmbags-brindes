import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`

function Dashboard() {
  const { token, email, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setStats(r.data)).catch(console.error)
  }, [])

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header admin */}
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
            <p className="text-3xl font-bold text-sky-500">{stats?.totalProdutos || '...'}</p>
            <p className="text-sm text-gray-500 mt-1">Produtos</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-sky-500">{stats?.totalCategorias || '...'}</p>
            <p className="text-sm text-gray-500 mt-1">Categorias</p>
          </div>
        </div>

        {/* Ações rápidas */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/produtos"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-sky-300 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-semibold text-gray-800">Gerenciar Produtos</h3>
            <p className="text-sm text-gray-400 mt-1">Editar, deletar ou adicionar produtos</p>
          </Link>
          <Link to="/admin/produtos/novo"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-sky-300 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">➕</div>
            <h3 className="font-semibold text-gray-800">Novo Produto</h3>
            <p className="text-sm text-gray-400 mt-1">Cadastrar um novo produto</p>
          </Link>
          <Link to="/"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-sky-300 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-semibold text-gray-800">Ver Site</h3>
            <p className="text-sm text-gray-400 mt-1">Visualizar o site público</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard