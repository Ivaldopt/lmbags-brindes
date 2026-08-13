import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo e contato */}
        <div>
          <div className="mb-4">
            <Link to="/" className="flex items-center">
          <img src="/Logo LM BAGS E BRINDES Branco.png" alt="LM Bags e Brindes" className="h-30 w-auto object-contain" />
        </Link>
          </div>
          <div className="text-sm space-y-2 text-gray-400">
            <p>📍 Salvador, Ba</p>
            <p>📞 (71) 9912-4780</p>
            <p>✉️ vendas@lmbagsebrindes.com</p>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Navegação</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/catalogo" className="hover:text-white transition-colors">Produtos</Link></li>
            <li><Link to="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link></li>
          </ul>
        </div>

        {/* Categorias */}
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Categorias</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalogo?categoria=Canetas" className="hover:text-white transition-colors">Canetas</Link></li>
            <li><Link to="/catalogo?categoria=Squeezes e Garrafas" className="hover:text-white transition-colors">Squeezes</Link></li>
            <li><Link to="/catalogo?categoria=Malas Mochilas Bolsas" className="hover:text-white transition-colors">Malas e Mochilas</Link></li>
            <li><Link to="/catalogo?categoria=Chaveiros" className="hover:text-white transition-colors">Chaveiros</Link></li>
          </ul>
        </div>

        {/* Sobre */}
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Sobre</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Distribuidora de brindes corporativos e personalizados para Você.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © 2026 LMBags Brindes. Todos os direitos reservados.
      </div>
    </footer>
  )
}

export default Footer