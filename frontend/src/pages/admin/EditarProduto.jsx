import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`

function EditarProduto() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [imagens, setImagens] = useState([])
  const [form, setForm] = useState({
    nome: '', descricao: '', altura: '', largura: '',
    medidas: '', peso: '', imagem: '', categoria: ''
  })

  useEffect(() => {
    fetch(`${API}/api/admin/produtos?pagina=1&limite=2000`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const produto = data.produtos.find(p => p.id === parseInt(id))
        if (produto) {
          setForm({
            nome: produto.nome || '',
            descricao: produto.descricao || '',
            altura: produto.altura || '',
            largura: produto.largura || '',
            medidas: produto.medidas || '',
            peso: produto.peso || '',
            imagem: produto.imagem || '',
            categoria: produto.categoria || ''
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))

    carregarImagens()
  }, [id])

  async function carregarImagens() {
    try {
      const res = await axios.get(`${API}/api/admin/produtos/${id}/imagens`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setImagens(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('imagem', file)
      const res = await axios.post(`${API}/api/admin/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      // Adiciona imagem à tabela produto_imagens
      await axios.post(`${API}/api/admin/produtos/${id}/imagens`, { url: res.data.url }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      carregarImagens()
    } catch (err) {
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function deletarImagem(imgId) {
    if (!confirm('Deletar esta imagem?')) return
    try {
      await axios.delete(`${API}/api/admin/imagens/${imgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      carregarImagens()
    } catch (err) {
      alert('Erro ao deletar imagem')
    }
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await axios.put(`${API}/api/admin/produtos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSucesso(true)
      setTimeout(() => navigate('/admin/produtos'), 1500)
    } catch (err) {
      alert('Erro ao salvar produto')
    } finally {
      setSalvando(false)
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
    </div>
  )

  const nomeArquivo = form.imagem ? form.imagem.split('/').pop().replace(/\.[^/.]+$/, '') : ''
  const srcPrincipal = nomeArquivo ? `https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${nomeArquivo}` : ''

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <Link to="/admin/produtos" className="text-gray-400 hover:text-white">← Produtos</Link>
        <span className="text-lg font-bold">✏️ Editar Produto</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            ✅ Produto salvo! Redirecionando...
          </div>
        )}

        {/* Card de imagens */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">🖼️ Imagens do produto</h2>

          {/* Imagem principal */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Imagem principal (do CSV)</p>
            {srcPrincipal && (
              <img src={srcPrincipal} alt="principal"
                className="w-24 h-24 object-contain bg-gray-50 rounded-lg p-2 border border-gray-200"
                onError={e => { e.target.style.display = 'none' }} />
            )}
          </div>

          {/* Imagens extras */}
          {imagens.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Imagens adicionais</p>
              <div className="flex gap-3 flex-wrap">
                {imagens.map(img => (
                  <div key={img.id} className="relative group">
                    <img src={img.url} alt="extra"
                      className="w-24 h-24 object-contain bg-gray-50 rounded-lg p-2 border border-gray-200"
                      onError={e => { e.target.src = 'https://placehold.co/96x96?text=?' }} />
                    <button onClick={() => deletarImagem(img.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload nova imagem */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Adicionar imagem</p>
            <div className="flex gap-3 items-center">
              <input type="file" accept="image/*" onChange={handleUpload}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              {uploading && <span className="text-sm text-gray-400 animate-pulse">Enviando...</span>}
            </div>
          </div>
        </div>

        {/* Card de dados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">📝 Dados do produto</h2>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Categoria</label>
                <input name="categoria" value={form.categoria} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Altura</label>
                <input name="altura" value={form.altura} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Largura</label>
                <input name="largura" value={form.largura} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Medidas para gravação</label>
                <input name="medidas" value={form.medidas} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Peso</label>
                <input name="peso" value={form.peso} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={salvando}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50">
                {salvando ? 'Salvando...' : '💾 Salvar alterações'}
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

export default EditarProduto