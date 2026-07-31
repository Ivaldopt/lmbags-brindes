import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo e contato */}
        <div>
          <div className="mb-4">
            <Link to="/" className="flex items-center">
              <img
                src="/Logo LM BAGS E BRINDES Branco.png"
                alt="LM Bags e Brindes"
                className="h-30 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="text-sm space-y-2 text-gray-400">
            <p>📍 Salvador, Ba</p>
            <p>📞 (71) 9912-4780</p>
            <p>✉️ contato@lmbags.com.br</p>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
            Navegação
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo"
                className="hover:text-white transition-colors"
              >
                Produtos
              </Link>
            </li>
            <li>
              <Link
                to="/quem-somos"
                className="hover:text-white transition-colors"
              >
                Quem Somos
              </Link>
            </li>
          </ul>
        </div>

        {/* Categorias */}
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
            Categorias
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/catalogo?categoria=Canetas"
                className="hover:text-white transition-colors"
              >
                Canetas
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo?categoria=Squeezes e Garrafas"
                className="hover:text-white transition-colors"
              >
                Squeezes
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo?categoria=Malas Mochilas Bolsas"
                className="hover:text-white transition-colors"
              >
                Malas e Mochilas
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo?categoria=Chaveiros"
                className="hover:text-white transition-colors"
              >
                Chaveiros
              </Link>
            </li>
          </ul>
        </div>

        {/* Sobre */}
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
            Sobre
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Distribuidora de brindes corporativos e personalizados para empresas
            especializadas na revenda.
          </p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M15.9414 0H6.05859C5.24219 0 4.46159 0.164713 3.7168 0.494141C2.98633 0.809244 2.34538 1.24251 1.79395 1.79395C1.24251 2.34538 0.809245 2.98633 0.494141 3.7168C0.164714 4.46159 0 5.24219 0 6.05859V15.9414C0 16.7578 0.164714 17.5384 0.494141 18.2832C0.809245 19.0137 1.24251 19.6546 1.79395 20.2061C2.34538 20.7575 2.98633 21.1908 3.7168 21.5059C4.46159 21.8353 5.24219 22 6.05859 22H15.9414C16.7578 22 17.5384 21.8353 18.2832 21.5059C19.0137 21.1908 19.6546 20.7575 20.2061 20.2061C20.7575 19.6546 21.1908 19.0137 21.5059 18.2832C21.8353 17.5384 22 16.7578 22 15.9414V6.05859C22 5.24219 21.8353 4.46159 21.5059 3.7168C21.1908 2.98633 20.7575 2.34538 20.2061 1.79395C19.6546 1.24251 19.0137 0.809244 18.2832 0.494141C17.5384 0.164713 16.7578 0 15.9414 0ZM20.0234 15.9414C20.0234 17.0586 19.6224 18.0182 18.8203 18.8203C18.0182 19.6224 17.0586 20.0234 15.9414 20.0234H6.05859C4.94141 20.0234 3.98177 19.6224 3.17969 18.8203C2.3776 18.0182 1.97656 17.0586 1.97656 15.9414V6.05859C1.97656 4.94141 2.3776 3.98177 3.17969 3.17969C3.98177 2.3776 4.94141 1.97656 6.05859 1.97656H15.9414C17.0586 1.97656 18.0182 2.3776 18.8203 3.17969C19.6224 3.98177 20.0234 4.94141 20.0234 6.05859V15.9414ZM10.9355 5.39258C10.1764 5.39258 9.45312 5.54297 8.76562 5.84375C8.07812 6.13021 7.47656 6.53125 6.96094 7.04688C6.44531 7.5625 6.03711 8.16406 5.73633 8.85156C5.42122 9.53906 5.26367 10.2767 5.26367 11.0645C5.26367 11.8522 5.41406 12.5898 5.71484 13.2773C6.0013 13.9648 6.40234 14.5664 6.91797 15.082C7.43359 15.5977 8.03516 15.9987 8.72266 16.2852C9.41016 16.5859 10.1478 16.7363 10.9355 16.7363C11.7233 16.7363 12.4609 16.5859 13.1484 16.2852C13.8359 15.9987 14.4375 15.5977 14.9531 15.082C15.4688 14.5664 15.8698 13.9648 16.1562 13.2773C16.457 12.5898 16.6074 11.8522 16.6074 11.0645C16.6074 10.2767 16.457 9.53906 16.1562 8.85156C15.8698 8.16406 15.4688 7.5625 14.9531 7.04688C14.4375 6.53125 13.8359 6.13021 13.1484 5.84375C12.4609 5.54297 11.7233 5.39258 10.9355 5.39258ZM10.9355 14.7598C9.87565 14.7598 8.99479 14.391 8.29297 13.6533C7.59115 12.9157 7.24023 12.0527 7.24023 11.0645C7.24023 10.0046 7.60905 9.1237 8.34668 8.42188C9.08431 7.72005 9.94727 7.36914 10.9355 7.36914C11.9954 7.36914 12.8763 7.73796 13.5781 8.47559C14.2799 9.21322 14.6309 10.0762 14.6309 11.0645C14.6882 12.0527 14.3516 12.9157 13.6211 13.6533C12.8906 14.391 11.9954 14.7598 10.9355 14.7598ZM16.8652 3.69531C16.6647 3.69531 16.4714 3.72754 16.2852 3.79199C16.099 3.85645 15.9414 3.95312 15.8125 4.08203C15.6836 4.21094 15.5833 4.36849 15.5117 4.55469C15.4401 4.74088 15.4043 4.93424 15.4043 5.13477C15.4043 5.33529 15.4401 5.52865 15.5117 5.71484C15.5833 5.90104 15.6836 6.05859 15.8125 6.1875C15.9414 6.31641 16.099 6.41667 16.2852 6.48828C16.4714 6.5599 16.6647 6.5957 16.8652 6.5957C17.0658 6.5957 17.2591 6.5599 17.4453 6.48828C17.6315 6.41667 17.7891 6.31641 17.918 6.1875C18.0469 6.05859 18.1436 5.90104 18.208 5.71484C18.2725 5.52865 18.3047 5.33529 18.3047 5.13477C18.3047 4.93424 18.2725 4.74088 18.208 4.55469C18.1436 4.36849 18.0469 4.21094 17.918 4.08203C17.7891 3.95312 17.6315 3.85645 17.4453 3.79199C17.2591 3.72754 17.0658 3.69531 16.8652 3.69531Z"
              fill="#4D148C"
            ></path>
          </svg>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © 2026 LMBags Brindes. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;
