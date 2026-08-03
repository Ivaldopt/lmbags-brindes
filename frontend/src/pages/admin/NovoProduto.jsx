import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`

function NovoProduto() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({
    codigo: '', nome: '', descricao: '', altura: '',
    largura: '', medidas: '', peso: '', imagem: '', categoria: ''
  })
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('imagem', file)
      const res = await axios.post(`${API}/api/admin/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setForm(prev => ({ ...prev, imagem: res.data.url }))
    } catch (err) {
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await axios.post(`${API}/api/admin/produtos`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/admin/produtos')
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao criar produto')
    } finally {
      setSalvando(false)
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const nomeArquivo = form.imagem ? form.imagem.split('/').pop().replace(/\.[^/.]+$/, '') : ''
  const srcPreview = nomeArquivo ? `https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${nomeArquivo}` : ''

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <Link to="/admin/produtos" className="text-gray-400 hover:text-white">← Produtos</Link>
        <span className="text-lg font-bold">➕ Novo Produto</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

          {srcPreview && (
            <div className="mb-6">
              <img src={srcPreview} alt="preview"
                className="w-32 h-32 object-contain bg-gray-50 rounded-lg p-2"
                onError={e => { e.target.style.display = 'none' }} />
            </div>
          )}

          <form onSubmit={handleSalvar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Código *</label>
                <input name="codigo" value={form.codigo} onChange={handleChange} required
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: 99999" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Categoria *</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: Canetas" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                placeholder="Nome do produto" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                placeholder="Descrição detalhada do produto" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Altura</label>
                <input name="altura" value={form.altura} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: 10 cm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Largura</label>
                <input name="largura" value={form.largura} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: 5 cm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Medidas para gravação</label>
                <input name="medidas" value={form.medidas} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: (CxL): 3 cm x 2 cm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Peso</label>
                <input name="peso" value={form.peso} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="Ex: (g): 50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Imagem</label>
              <div className="flex gap-3 items-center">
                <input type="file" accept="image/*" onChange={handleUpload}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
                {uploading && <span className="text-sm text-gray-400">Enviando...</span>}
              </div>
              {form.imagem && (
                <p className="text-xs text-green-600 mt-1">✅ Imagem enviada!</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={salvando}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50">
                {salvando ? 'Criando...' : '➕ Criar produto'}
              </button>
              <Link to="/admin/produtos"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NovoProduto