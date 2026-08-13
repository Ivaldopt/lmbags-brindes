import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
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
  const { autenticado } = useAuth()
  const isAdmin = window.location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isAdmin && <Header />}
      <main className="flex-1">
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
        </Routes>
      </main>
      {!isAdmin && <WhatsappWidget />}
      {!isAdmin && <Footer />}
    </div>
  )
}

export default App