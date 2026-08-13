import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`

function Avaliacoes() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [avaliacoes, setAvaliacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    nome: '', nota: 5, comentario: '', foto_url: '', data_avaliacao: ''
  })
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const res = await axios.get(`${API}/api/admin/avaliacoes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAvaliacoes(res.data)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/admin/login') }
    } finally {
      setLoading(false)
    }
  }

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      if (editando) {
        await axios.put(`${API}/api/admin/avaliacoes/${editando}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API}/api/admin/avaliacoes`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setForm({ nome: '', nota: 5, comentario: '', foto_url: '', data_avaliacao: '' })
      setEditando(null)
      carregar()
    } catch (err) {
      alert('Erro ao salvar avaliação')
    } finally {
      setSalvando(false)
    }
  }

  async function deletar(id) {
    if (!confirm('Deletar esta avaliação?')) return
    try {
      await axios.delete(`${API}/api/admin/avaliacoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      carregar()
    } catch (err) {
      alert('Erro ao deletar')
    }
  }

  async function toggleAtivo(av) {
    try {
      await axios.put(`${API}/api/admin/avaliacoes/${av.id}`, { ...av, ativo: !av.ativo }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      carregar()
    } catch (err) {
      alert('Erro ao atualizar')
    }
  }

  function editar(av) {
    setEditando(av.id)
    setForm({
      nome: av.nome,
      nota: av.nota,
      comentario: av.comentario || '',
      foto_url: av.foto_url || '',
      data_avaliacao: av.data_avaliacao?.split('T')[0] || ''
    })
    window.scrollTo(0, 0)
  }

  function estrelas(nota) {
    return '⭐'.repeat(nota) + '☆'.repeat(5 - nota)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white">← Dashboard</Link>
        <span className="text-lg font-bold">⭐ Avaliações</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            {editando ? '✏️ Editar avaliação' : '➕ Nova avaliação'}
          </h2>
          <form onSubmit={salvar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nome do cliente *</label>
                <input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                  required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nota *</label>
                <select value={form.nota} onChange={e => setForm(p => ({ ...p, nota: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500">
                  <option value={5}>⭐⭐⭐⭐⭐ 5 estrelas</option>
                  <option value={4}>⭐⭐⭐⭐ 4 estrelas</option>
                  <option value={3}>⭐⭐⭐ 3 estrelas</option>
                  <option value={2}>⭐⭐ 2 estrelas</option>
                  <option value={1}>⭐ 1 estrela</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Comentário</label>
              <textarea value={form.comentario} onChange={e => setForm(p => ({ ...p, comentario: e.target.value }))}
                rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                placeholder="O que o cliente disse..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">URL da foto do cliente</label>
                <input value={form.foto_url} onChange={e => setForm(p => ({ ...p, foto_url: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Data da avaliação</label>
                <input type="date" value={form.data_avaliacao} onChange={e => setForm(p => ({ ...p, data_avaliacao: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={salvando}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                {salvando ? 'Salvando...' : editando ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editando && (
                <button type="button" onClick={() => { setEditando(null); setForm({ nome: '', nota: 5, comentario: '', foto_url: '', data_avaliacao: '' }) }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm transition-colors">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">📋 Avaliações cadastradas ({avaliacoes.length})</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            </div>
          ) : avaliacoes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma avaliação cadastrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {avaliacoes.map(av => (
                <div key={av.id} className={`border rounded-lg p-4 flex items-start gap-4 ${av.ativo ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}>
                  {av.foto_url ? (
                    <img src={av.foto_url} alt={av.nome} className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      onError={e => { e.target.src = 'https://placehold.co/40x40?text=?' }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sky-600 font-bold text-sm">{av.nome.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-700 text-sm">{av.nome}</span>
                      <span className="text-xs text-gray-400">{av.data_avaliacao?.split('T')[0]}</span>
                    </div>
                    <div className="text-sm mb-1">{estrelas(av.nota)}</div>
                    {av.comentario && <p className="text-sm text-gray-500">{av.comentario}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggleAtivo(av)}
                      className={`text-xs px-3 py-1 rounded font-medium transition-colors ${av.ativo ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                      {av.ativo ? 'Visível' : 'Oculto'}
                    </button>
                    <button onClick={() => editar(av)}
                      className="bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1 rounded text-xs font-medium transition-colors">
                      Editar
                    </button>
                    <button onClick={() => deletar(av.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded text-xs font-medium transition-colors">
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Avaliacoes