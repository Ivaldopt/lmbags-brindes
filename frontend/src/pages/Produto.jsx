import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}`;

function Produto() {
  const { codigo } = useParams();
  const [produto, setProduto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [imgAtiva, setImgAtiva] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImgAtiva(0);
    setProduto(null);
    setImagens([]);

    axios
      .get(`${API}/api/produtos/${codigo}`)
      .then((r) => {
        setProduto(r.data);
        return Promise.all([
          axios.get(
            `${API}/api/produtos?categoria=${encodeURIComponent(r.data.categoria)}&limite=8`,
          ),
          axios.get(`${API}/api/produtos/${codigo}/imagens`),
        ]);
      })
      .then(([relRes, imgRes]) => {
        setRelacionados(
          relRes.data.produtos
            .filter((p) => p.codigo !== parseInt(codigo))
            .slice(0, 4),
        );
        if (imgRes.data.length > 0) setImagens(imgRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [codigo]);

  // Registrar visita ao produto por dia
  useEffect(() => {
    if (codigo) {
      const chave = `visitou_produto_${codigo}`;
      if (!sessionStorage.getItem(chave)) {
        axios
          .post(`${API}/api/admin/visitas`, {
            tipo: "produto",
            referencia: codigo,
          })
          .catch(() => {});
        sessionStorage.setItem(chave, "1");
      }
    }
  }, [codigo]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );

  if (!produto)
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-4">😕</p>
        <p>Produto não encontrado</p>
        <Link to="/catalogo" className="text-sky-500 mt-4 inline-block">
          ← Voltar ao catálogo
        </Link>
      </div>
    );

  const srcPrincipal =
    imagens.length > 0
      ? imagens[imgAtiva]
      : `${API}/imagens/${produto.imagem ? produto.imagem.split("/").pop() : ""}`;

  // ================================
  // CONFIGURAÇÃO DO WHATSAPP
  // ================================

  const TELEFONE_WHATSAPP = "557199124780"; // troque pelo seu número

  const mensagemWhatsApp = `
  Olá!

  Gostaria de solicitar um orçamento para o seguinte produto:

  📦 Produto: ${produto.nome}
  🔢 Código: ${String(produto.codigo).padStart(5, "0")}
  📂 Categoria: ${produto.categoria}

  🔗 Link do produto:
  ${window.location.href}

  Aguardo seu retorno.
  `;

  const whatsappUrl = `https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(
    mensagemWhatsApp,
  )}`;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-sky-500">
            HOME
          </Link>
          <span>›</span>
          <Link to="/catalogo" className="hover:text-sky-500">
            PRODUTOS
          </Link>
          <span>›</span>
          <Link
            to={`/catalogo?categoria=${encodeURIComponent(produto.categoria)}`}
            className="hover:text-sky-500 uppercase"
          >
            {produto.categoria}
          </Link>
          <span>›</span>
          <span className="text-gray-600 uppercase">{produto.nome}</span>
        </nav>

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Coluna esquerda — imagens */}
          <div className="lg:w-[480px] flex-shrink-0">
            <div className="flex items-center justify-center h-[480px] mb-4">
              <img
                src={srcPrincipal}
                alt={produto.nome}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.src = "https://placehold.co/480x480?text=Sem+foto";
                }}
              />
            </div>
            {imagens.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {imagens.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgAtiva(i)}
                    className={`w-16 h-16 border-2 rounded overflow-hidden transition-all ${imgAtiva === i ? "border-sky-500" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <img
                      src={img}
                      alt={i}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/64x64";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coluna direita — detalhes */}
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">
              {String(produto.codigo).padStart(5, "0")}
            </p>
            <h1 className="text-2xl font-normal text-gray-800 mb-6 border-b border-gray-200 pb-4">
              {produto.nome}
            </h1>

            {produto.descricao && (
              <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                {produto.descricao}
              </p>
            )}

            <div className="space-y-2 mb-6 text-sm">
              {produto.altura && (
                <p>
                  <span className="font-semibold text-gray-700">Altura : </span>
                  <span className="text-gray-500 italic">{produto.altura}</span>
                </p>
              )}
              {produto.largura && (
                <p>
                  <span className="font-semibold text-gray-700">
                    Largura :{" "}
                  </span>
                  <span className="text-gray-500 italic">
                    {produto.largura}
                  </span>
                </p>
              )}
              {produto.medidas && (
                <p>
                  <span className="font-semibold text-gray-700">
                    Medidas aproximadas para gravação{" "}
                  </span>
                  <span className="text-gray-500 italic">
                    {produto.medidas}
                  </span>
                </p>
              )}
              {produto.peso && (
                <p>
                  <span className="font-semibold text-gray-700">
                    Peso aproximado{" "}
                  </span>
                  <span className="text-gray-500 italic">{produto.peso}</span>
                </p>
              )}
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Veja mais brindes
              </p>
              <Link
                to={`/catalogo?categoria=${encodeURIComponent(produto.categoria)}`}
                className="text-sky-500 hover:text-sky-600 text-sm"
              >
                {produto.categoria}
              </Link>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-current"
              >
                <path d="M19.11 17.33c-.29-.14-1.7-.84-1.96-.93-.26-.09-.45-.14-.64.14-.19.29-.74.93-.91 1.12-.17.19-.34.22-.63.08-.29-.14-1.21-.45-2.31-1.44-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.44 0 1.44 1.04 2.83 1.18 3.03.14.19 2.05 3.13 5.06 4.39.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.7-.69 1.94-1.35.24-.67.24-1.24.17-1.35-.07-.12-.26-.19-.55-.33z" />
                <path d="M16.01 3C8.83 3 3 8.82 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.7-1.72A12.96 12.96 0 0016.01 29C23.18 29 29 23.18 29 16S23.18 3 16.01 3zm0 23.66c-2.03 0-4.02-.55-5.75-1.6l-.41-.24-3.98 1.02 1.06-3.88-.27-.4A10.6 10.6 0 015.34 16c0-5.88 4.79-10.67 10.67-10.67S26.68 10.12 26.68 16 21.89 26.66 16.01 26.66z" />
              </svg>
              Solicitar cotação via WhatsApp
            </a>
          </div>
        </div>

        {/* Produtos relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-base font-semibold text-gray-600 uppercase tracking-widest mb-8">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relacionados.map((p) => {
                const nomeArquivo = p.imagem
                  ? p.imagem
                      .split("/")
                      .pop()
                      .replace(/\.[^/.]+$/, "")
                  : "";
                const src = nomeArquivo
                  ? `https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${nomeArquivo}`
                  : "https://placehold.co/200x200?text=?";
                return (
                  <Link
                    key={p.codigo}
                    to={`/catalogo/${p.codigo}`}
                    className="group text-center"
                  >
                    <div className="h-40 flex items-center justify-center mb-3">
                      <img
                        src={src}
                        alt={p.nome}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/200x200?text=?";
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      {String(p.codigo).padStart(5, "0")}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {p.nome}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Produto;
