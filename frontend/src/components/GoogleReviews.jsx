import { FaGoogle, FaStar } from "react-icons/fa";

const avaliacoes = [
  {
    nome: "Cliente Google",
    nota: 5,
    comentario:
      "Excelente atendimento e produtos de ótima qualidade. Recomendo!",
    data: "Avaliação no Google",
  },
  {
    nome: "Cliente Google",
    nota: 5,
    comentario:
      "Atendimento rápido, produto de qualidade e entrega conforme combinado.",
    data: "Avaliação no Google",
  },
  {
    nome: "Cliente Google",
    nota: 5,
    comentario:
      "Muito satisfeita com o atendimento. Voltarei a comprar.",
    data: "Avaliação no Google",
  },
];

function Estrelas({ nota }) {
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar key={index} className={index < nota ? "" : "opacity-30"} />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Cabeçalho */}
        <div className="text-center mb-10">

          <div className="flex items-center justify-center gap-2 mb-3">
            <FaGoogle className="text-xl text-gray-700" />

            <span className="text-sm font-semibold text-gray-500">
              Avaliações no Google
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            O que nossos clientes dizem
          </h2>

          <div className="flex items-center justify-center gap-3 mt-4">

            <span className="text-3xl font-bold text-gray-800">
              5,0
            </span>

            <div>
              <Estrelas nota={5} />

              <p className="text-xs text-gray-500 mt-1">
                Avaliações de clientes
              </p>
            </div>

          </div>
        </div>

        {/* Avaliações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {avaliacoes.map((avaliacao, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >

              <div className="flex items-start justify-between mb-4">

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {avaliacao.nome}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {avaliacao.data}
                  </p>
                </div>

                <FaGoogle className="text-gray-400" />
              </div>

              <Estrelas nota={avaliacao.nota} />

              <p className="text-sm text-gray-600 leading-relaxed mt-4">
                "{avaliacao.comentario}"
              </p>

            </article>
          ))}

        </div>

        {/* Botão Google */}
        <div className="text-center mt-10">

          <a
            href="https://www.google.com/maps/search/?api=1&query=LM+Bags+%26+Brindes+Salvador+BA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-xl transition"
          >
            <FaGoogle />
            Ver avaliações no Google
          </a>

        </div>

      </div>
    </section>
  );
}