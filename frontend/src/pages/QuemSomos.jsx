import { Link } from 'react-router-dom'

const diferenciais = [
  {
    icone: '🎨',
    titulo: 'Personalização',
    texto:
      'Personalizamos produtos com logotipos, nomes, frases, artes e identidades visuais para empresas, eventos e projetos pessoais.',
  },
  {
    icone: '📦',
    titulo: 'Variedade',
    texto:
      'São mais de 2.300 opções em diferentes categorias para atender desde pequenas encomendas até demandas corporativas.',
  },
  {
    icone: '🤝',
    titulo: 'Atendimento personalizado',
    texto:
      'Ajudamos você a escolher o produto mais adequado considerando objetivo, quantidade, orçamento e prazo.',
  },
  {
    icone: '💼',
    titulo: 'Empresas e profissionais',
    texto:
      'Soluções para ações promocionais, eventos, equipes, clientes, campanhas, congressos e datas comemorativas.',
  },
  {
    icone: '🎁',
    titulo: 'Clientes particulares',
    texto:
      'Produtos personalizados para aniversários, festas, casamentos, formaturas, presentes e momentos especiais.',
  },
  {
    icone: '🚚',
    titulo: 'Compromisso com o prazo',
    texto:
      'Organizamos cada pedido de acordo com produção, personalização e entrega para oferecer maior previsibilidade ao cliente.',
  },
]

const publicos = [
  {
    titulo: 'Para empresas',
    descricao:
      'Brindes personalizados para fortalecer sua marca, valorizar clientes, equipes e tornar ações promocionais mais memoráveis.',
    itens: [
      'Eventos e congressos',
      'Campanhas promocionais',
      'Brindes para clientes',
      'Kits para colaboradores',
      'Datas comemorativas',
      'Ações de marketing',
    ],
  },
  {
    titulo: 'Para você',
    descricao:
      'Personalização para transformar presentes, comemorações e momentos importantes em algo único.',
    itens: [
      'Aniversários',
      'Casamentos',
      'Formaturas',
      'Eventos particulares',
      'Presentes personalizados',
      'Datas especiais',
    ],
  },
]

function QuemSomos() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-800 via-sky-700 to-sky-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              LM Bags & Brindes
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Personalização para empresas e para momentos especiais
            </h1>

            <p className="text-lg md:text-xl text-sky-100 leading-relaxed max-w-2xl mb-8">
              Brindes e produtos personalizados para empresas, profissionais,
              eventos e clientes particulares, com centenas de opções para
              transformar cada ideia em algo único.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogo"
                className="bg-white text-sky-700 hover:bg-sky-50 font-semibold px-7 py-3.5 rounded-full transition-colors text-center"
              >
                Explorar catálogo
              </Link>

              <a
                href="https://wa.me/557199124780"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/40 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-center"
              >
                Solicitar orçamento
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">
              Quem somos
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Soluções personalizadas para diferentes necessidades
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              A LM Bags & Brindes atua com brindes e produtos personalizados
              para pessoas jurídicas e físicas, atendendo desde empresas que
              procuram fortalecer suas marcas até clientes que desejam
              personalizar momentos e ocasiões especiais.
            </p>

            <p className="text-gray-600 leading-relaxed mb-5">
              Nosso catálogo reúne mais de 2.300 produtos em diversas
              categorias, permitindo encontrar soluções para ações
              promocionais, eventos corporativos, presentes, comemorações,
              campanhas, equipes e muito mais.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Trabalhamos com uma rede de fornecedores selecionados e buscamos
              combinar variedade, qualidade, personalização e condições
              competitivas em cada projeto.
            </p>
          </div>

          {/* Números */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sky-50 rounded-2xl p-7">
              <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                2.300+
              </div>
              <p className="text-gray-600">produtos disponíveis</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-7">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                45+
              </div>
              <p className="text-gray-600">categorias de produtos</p>
            </div>

            <div className="col-span-2 bg-gray-900 text-white rounded-2xl p-7">
              <div className="text-2xl font-bold mb-2">
                Pessoa Física + Pessoa Jurídica
              </div>

              <p className="text-gray-300">
                Atendimento para empresas, profissionais, organizações,
                eventos e clientes particulares.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Públicos */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">
              Para quem atendemos
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Sua necessidade, nossa personalização
            </h2>

            <p className="text-gray-600 mt-4">
              Do projeto corporativo ao presente especial, buscamos a solução
              mais adequada para cada tipo de cliente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {publicos.map((publico, index) => (
              <article
                key={publico.titulo}
                className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold mb-6">
                  {index === 0 ? 'PJ' : 'PF'}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {publico.titulo}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {publico.descricao}
                </p>

                <ul className="grid sm:grid-cols-2 gap-3">
                  {publico.itens.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="text-sky-500 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">
            Por que escolher a LM?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Mais do que produtos personalizados
          </h2>

          <p className="text-gray-600 mt-4">
            Nosso objetivo é ajudar você a encontrar uma solução coerente com
            sua necessidade, identidade, orçamento e ocasião.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diferenciais.map((item) => (
            <article
              key={item.titulo}
              className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-5">{item.icone}</div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {item.titulo}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.texto}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Como funciona
            </h2>

            <p className="text-gray-600 mt-3">
              Um processo simples para transformar sua ideia em um produto
              personalizado.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ['01', 'Escolha', 'Explore nosso catálogo e encontre o produto ideal.'],
              ['02', 'Personalize', 'Envie sua logo, arte, nome ou ideia de personalização.'],
              ['03', 'Orçamento', 'Definimos quantidade, personalização, prazo e condições.'],
              ['04', 'Produção', 'Após a aprovação, seu pedido segue para produção.'],
            ].map(([numero, titulo, texto]) => (
              <div key={numero} className="text-center">
                <div className="w-14 h-14 mx-auto bg-sky-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {numero}
                </div>

                <h3 className="font-bold text-gray-900 mb-2">{titulo}</h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-14 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tem uma ideia? Nós ajudamos a transformá-la em realidade.
            </h2>

            <p className="text-gray-300 text-lg mb-8">
              Escolha seus produtos no catálogo ou fale com nossa equipe para
              encontrar a melhor solução para sua necessidade.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link
                to="/catalogo"
                className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
              >
                Ver catálogo completo
              </Link>

              <a
                href="https://wa.me/557199124780"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-600 hover:border-gray-400 hover:bg-white/5 font-semibold px-8 py-3.5 rounded-full transition-all"
              >
                Falar pelo WhatsApp
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-sm text-gray-400">
              <span>📍 Salvador, BA</span>
              <span>📞 (71) 9912-4780</span>
              <span>✉️ vendas@lmbagsebrindes.com.br</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default QuemSomos
