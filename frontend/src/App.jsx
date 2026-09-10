import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import LegalPage from './pages/LegalPage'
import OutubroRosa from './pages/OutubroRosa'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/auth'
import Seo from './components/Seo'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Produto from './pages/Produto'
import QuemSomos from './pages/QuemSomos'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Produtos from './pages/admin/Produtos'
import EditarProduto from './pages/admin/EditarProduto'
import NovoProduto from './pages/admin/NovoProduto'
import WhatsappWidget from './components/WhatsappWidget'
import Avaliacoes from './pages/admin/Avaliacoes'

function RotaProtegida({ children }) {
  const { autenticado } = useAuth()
  return autenticado ? children : <Navigate to="/admin/login" />
}

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      <Seo />
      <a href="#conteudo" className="sr-only focus:not-sr-only">Pular para o conteúdo</a>
      {!isAdmin && <Header />}
      <main id="conteudo" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:codigo" element={<Produto />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/admin/produtos" element={<RotaProtegida><Produtos /></RotaProtegida>} />
          <Route path="/admin/produtos/novo" element={<RotaProtegida><NovoProduto /></RotaProtegida>} />
          <Route path="/admin/produtos/editar/:id" element={<RotaProtegida><EditarProduto /></RotaProtegida>} />
          <Route path="/admin/avaliacoes" element={<RotaProtegida><Avaliacoes /></RotaProtegida>} />
          <Route path="/outubro-rosa" element={<OutubroRosa />} />
          <Route path="/:page" element={<LegalPage />} />
          <Route path="*" element={<div className="p-12 text-center"><h1>Página não encontrada</h1><a href="/catalogo">Visitar o catálogo</a></div>} />
        </Routes>
      </main>
      {!isAdmin && <WhatsappWidget />}
      {!isAdmin && <Footer />}
      {!isAdmin && <CookieConsent />}
    </div>
  )
}

export default App
