import { Link } from 'react-router-dom'

function QuemSomos() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Quem Somos</h1>
          <p className="text-sky-100 text-lg">
            Distribuidora especializada em brindes corporativos e personalizados
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nossa história</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Somos uma distribuidora de brindes corporativos com foco em atender empresas
              especializadas na revenda de brindes personalizados. Oferecemos um catálogo
              completo com mais de 2.300 produtos para personalização.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Trabalhamos com os melhores fornecedores do mercado para garantir qualidade,
              variedade e preços competitivos para nossos clientes.
            </p>
          </div>
          <div className="bg-sky-50 rounded-2xl p-8 text-center">
            <div className="text-5xl font-bold text-sky-500 mb-2">2.300+</div>
            <p className="text-gray-600">produtos no catálogo</p>
            <div className="text-5xl font-bold text-sky-500 mt-6 mb-2">45+</div>
            <p className="text-gray-600">categorias disponíveis</p>
          </div>
        </div>

        {/* Diferenciais */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Nossos diferenciais</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icone: '🎯', titulo: 'Personalização', texto: 'Todos os produtos podem ser personalizados com a identidade visual da sua empresa.' },
            { icone: '🚚', titulo: 'Entrega rápida', texto: 'Trabalhamos com prazos competitivos para garantir que seus brindes cheguem no tempo certo.' },
            { icone: '💼', titulo: 'Atendimento B2B', texto: 'Atendemos somente empresas especializadas na revenda de brindes corporativos.' },
          ].map(item => (
            <div key={item.titulo} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">{item.icone}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.titulo}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>

        {/* Contato */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Entre em contato</h3>
          <p className="text-gray-300 mb-6">Fale conosco para solicitar um orçamento ou tirar dúvidas</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm mb-6">
            <span>📍 Salvador, BA</span>
            <span>📞 (71) 0000-0000</span>
            <span>✉️ contato@lmbags.com.br</span>
          </div>
          <Link to="/catalogo"
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 py-3 rounded-full transition-colors inline-block">
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuemSomos