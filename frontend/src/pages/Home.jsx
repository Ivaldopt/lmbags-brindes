import CategoryShortcuts from '../components/CategoryShortcuts'
import CollectionCards from '../components/CollectionCards'
import ReviewsSection from '../components/ReviewsSection'
import useVisit from '../lib/useVisit'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios, { API } from '../lib/api'
import HeroCarousel from "../components/HeroCarousel";


function CardProduto({ produto }) {
  const nomeArquivo = produto.imagem ? produto.imagem.split("/").pop() : "";
  const src = `${API}/imagens/${nomeArquivo}`;
  return (
    <Link
      to={`/catalogo/${produto.codigo}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100"
    >
      <div className="bg-white p-6 h-52 sm:h-64 flex items-center justify-center">
        <img
          loading="lazy" decoding="async" width="240" height="240" src={src}
          alt={produto.nome}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = "/imagem-indisponivel.svg";
          }}
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 font-mono">
          {String(produto.codigo).padStart(5, "0")}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-1 leading-tight line-clamp-2">
          {produto.nome}
        </p>
        <p className="text-xs text-slate-500 mt-2">{produto.categoria}</p><p className="mt-4 border-t border-slate-100 pt-3 text-sm font-semibold text-sky-800">Ver detalhes <span aria-hidden="true">→</span></p>
      </div>
    </Link>
  );
}

function CardCategoria({ cat }) {
  const fotos = {
    'Sacolas e Sacochilas': 'sacolas', 'Squeezes e Garrafas': 'garrafas',
    'Malas Mochilas Bolsas': 'mochilas', Canetas: 'canetas', Copos: 'copos',
    'Blocos e Cadernetas': 'cadernetas', Nécessaires: 'necessaires',
    'Bolsas Térmicas': 'bolsas-termicas', 'Linha Ecológica': 'sacolas',
  };
  const foto = fotos[cat.categoria];
  return (
    <Link
      to={`/catalogo?categoria=${encodeURIComponent(cat.categoria)}`}
      className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-sky-200 transition-all group"
    >
      <div className="h-32 sm:h-40 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 p-3">
        <img src={foto ? `/categorias/${foto}.webp` : "/imagem-indisponivel.svg"} alt={cat.categoria} width="200" height="200" loading="lazy" decoding="async" className="w-full h-full object-contain motion-safe:group-hover:scale-105 transition-transform" />
      </div>
      <p className="text-xs font-medium text-gray-700 leading-tight">
        {cat.categoria}
      </p>
      <p className="text-xs text-gray-400 mt-1">{cat.total} {Number(cat.total) === 1 ? 'produto' : 'produtos'}</p>
    </Link>
  );
}

function CatalogForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [baixado, setBaixado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleDownload(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      const res = await axios.post(`${API}/api/catalogo/download`, { email, nome })
      if (res.data.sucesso) {
        const url = new URL(res.data.url)
        if (url.protocol !== 'https:' || url.hostname !== 'drive.google.com') throw new Error('Link de catálogo inválido')
        setBaixado(url.href)
      }
    } catch {
      setErro('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (baixado) {
    return (
      <div className="bg-green-500 text-white rounded-xl px-8 py-4 text-center">
        <p className="text-lg font-bold">Seu catálogo está pronto!</p>
        <p className="text-sm mt-1 text-green-100">Seu catálogo está disponível. Obrigado pelo interesse!</p>
        <a href={baixado} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 underline font-bold">Abrir catálogo</a>
      </div>
    )
  }

  return (
    <form onSubmit={handleDownload} className="flex flex-col sm:flex-row flex-wrap gap-3 w-full max-w-lg">
      <input
        type="text"
        aria-label="Seu nome" maxLength={120} placeholder="Seu nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className="flex-1 min-w-0 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <input
        type="email"
        aria-label="Seu email" maxLength={254} placeholder="Seu email *"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="flex-1 min-w-0 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button type="submit" disabled={loading}
        className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap disabled:opacity-50">
        {loading ? 'Aguarde...' : '📥 Baixar grátis'}
      </button>
      {erro && <p role="alert" className="text-red-400 text-xs mt-1">{erro}</p>}
      <p className="basis-full text-xs text-slate-300 leading-relaxed">Seu nome e email serão usados para atender à solicitação de catálogo. <Link className="underline" to="/politica-de-privacidade">Leia a política de privacidade</Link>.</p>
    </form>
  )
}

function Home() {
  useVisit('home')
  const [categorias, setCategorias] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [catRes, ...groups] = await Promise.allSettled([
          axios.get(`${API}/api/produtos/categorias`),
          ...['Sacola', 'Garrafa', 'Mochila', 'Caneta'].map(busca => axios.get(`${API}/api/produtos`, { params: { busca, limite: 2 } })),
        ]);
        if (catRes.status === 'fulfilled' && Array.isArray(catRes.value.data)) {
          const priority = ['Sacolas e Sacochilas', 'Squeezes e Garrafas', 'Malas Mochilas Bolsas', 'Canetas', 'Copos', 'Blocos e Cadernetas', 'Bolsas Térmicas', 'Nécessaires', 'Linha Ecológica'];
          const rank = name => { const i = priority.indexOf(name); return i < 0 ? 99 : i };
          setCategorias([...catRes.value.data].sort((a,b) => rank(a.categoria) - rank(b.categoria)).slice(0,9));
        }
        const found = groups.flatMap(result => result.status === 'fulfilled' && Array.isArray(result.value.data.produtos) ? result.value.data.produtos : []);
        setLancamentos([...new Map(found.map(product => [product.codigo, product])).values()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return (
    <div>
      <HeroCarousel />
      <CategoryShortcuts />
      <CollectionCards />

      {/* Categorias */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
            Categorias
          </h2>
          <Link
            to="/catalogo"
            className="text-sky-500 hover:text-sky-600 text-sm"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categorias.map((cat) => (
            <CardCategoria key={cat.categoria} cat={cat} />
          ))}
        </div>
      </div>

      {/* Destaques do catálogo */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
              Destaques do catálogo
            </h2>
            <Link
              to="/catalogo"
              className="text-sky-500 hover:text-sky-600 text-sm"
            >
              Ver todos →
            </Link>
          </div>
          {loading && <p role="status">Carregando produtos…</p>}
          {!loading && lancamentos.length === 0 && <p role="status">Os produtos estão indisponíveis no momento. Tente novamente em instantes.</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lancamentos.map((p) => (
              <CardProduto key={p.codigo} produto={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Download Catálogo */}
      <div id="baixar-catalogo" className="bg-gradient-to-r from-gray-800 to-gray-700 py-12 scroll-mt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">📥 Baixe nosso catálogo</h2>
            <p className="text-gray-300">Conheça as opções para a sua próxima ação promocional.</p>
          </div>
          <CatalogForm />
        </div>
      </div>

      <ReviewsSection />
    </div>
  );
}

export default Home;
