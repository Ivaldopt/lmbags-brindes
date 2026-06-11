import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Produto from './pages/Produto'
import QuemSomos from './pages/QuemSomos'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:codigo" element={<Produto />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App