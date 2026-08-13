import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GoogleReviews from "../components/GoogleReviews";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}`;

function CardProduto({ produto }) {
  const nomeArquivo = produto.imagem ? produto.imagem.split("/").pop() : "";
  const src = `${API}/imagens/${nomeArquivo}`;
  return (
    <Link
      to={`/catalogo/${produto.codigo}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100"
    >
      <div className="bg-gray-50 p-4 h-44 flex items-center justify-center">
        <img
          src={src}
          alt={produto.nome}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = "https://placehold.co/200x200?text=Sem+foto";
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
        <p className="text-xs text-sky-500 mt-1">{produto.categoria}</p>
      </div>
    </Link>
  );
}

function CardCategoria({ cat }) {
  const icones = {
    Canetas: "✏️",
    "Squeezes e Garrafas": "🍶",
    "Malas Mochilas Bolsas": "👜",
    Chaveiros: "🔑",
    Copos: "☕",
    "Blocos e Cadernetas": "📓",
    Nécessaires: "💼",
    "Bolsas Térmicas": "🧊",
    "Linha Ecológica": "🌿",
  };
  const icone = icones[cat.categoria] || "🎁";
  return (
    <Link
      to={`/catalogo?categoria=${encodeURIComponent(cat.categoria)}`}
      className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-sky-200 transition-all group"
    >
      <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-100 transition-colors">
        <span className="text-2xl">{icone}</span>
      </div>
      <p className="text-xs font-medium text-gray-700 leading-tight">
        {cat.categoria}
      </p>
      <p className="text-xs text-gray-400 mt-1">{cat.total} produtos</p>
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
        setBaixado(true)
        window.open(res.data.url, '_blank')
      }
    } catch (err) {
      setErro('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (baixado) {
    return (
      <div className="bg-green-500 text-white rounded-xl px-8 py-4 text-center">
        <p className="text-lg font-bold">✅ Download iniciado!</p>
        <p className="text-sm mt-1 text-green-100">Obrigado! Em breve enviaremos novidades.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleDownload} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <input
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <input
        type="email"
        placeholder="Seu email *"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button type="submit" disabled={loading}
        className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap disabled:opacity-50">
        {loading ? 'Aguarde...' : '📥 Baixar grátis'}
      </button>
      {erro && <p className="text-red-400 text-xs mt-1">{erro}</p>}
    </form>
  )
}

function Home() {
  const [categorias, setCategorias] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API}/api/produtos/categorias`),
          axios.get(`${API}/api/produtos?limite=8`),
        ]);
        setCategorias(catRes.data.slice(0, 9));
        setLancamentos(prodRes.data.produtos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Registrar visita na home
  useEffect(() => {
    if (!sessionStorage.getItem("visitou_hoje")) {
      axios.post(`${API}/api/admin/visitas`, { tipo: "home" }).catch(() => {});
      sessionStorage.setItem("visitou_hoje", "1");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-500 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <p className="text-sky-200 text-sm uppercase tracking-widest mb-3">
              Distribuidora oficial
            </p>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Brindes corporativos
              <br />
              <span className="text-yellow-300">para sua você!</span>
            </h1>
            <p className="text-sky-100 mb-6 text-lg">
              Mais de 2.300 produtos para personalização
            </p>
            <Link
              to="/catalogo"
              className="bg-white text-sky-600 font-semibold px-8 py-3 rounded-full hover:bg-sky-50 transition-colors inline-block"
            >
              Ver catálogo completo
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-sm w-full">
            {lancamentos.slice(0, 4).map((p) => (
              <Link key={p.codigo} to={`/catalogo/${p.codigo}`}>
                <div className="bg-white rounded-xl p-2 hover:scale-105 transition-transform">
                  <img
                    src={`${API}/imagens/${p.imagem ? p.imagem.split("/").pop() : ""}`}
                    alt={p.nome}
                    className="w-full h-20 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {categorias.map((cat) => (
            <CardCategoria key={cat.categoria} cat={cat} />
          ))}
        </div>
      </div>

      {/* Lançamentos */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
              Lançamentos
            </h2>
            <Link
              to="/catalogo"
              className="text-sky-500 hover:text-sky-600 text-sm"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lancamentos.map((p) => (
              <CardProduto key={p.codigo} produto={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Download Catálogo */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">📥 Baixe nosso catálogo 2026-2027</h2>
            <p className="text-gray-300">Mais de 2.300 produtos para personalização. Grátis!</p>
          </div>
          <CatalogForm />
        </div>
      </div>

      {/* Avaliações Google */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider mb-8 text-center">
          O que nossos clientes dizem
        </h2>
        <div
          className="elfsight-app-799167cb-beb7-4af2-b0ec-c24c96898107"
          data-elfsight-app-lazy>
        </div>
      </div>

    </div>
  );
}

export default Home;
