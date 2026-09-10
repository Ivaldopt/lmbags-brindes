require('dotenv').config()
require('./config/security')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const express = require('express')
const cors = require('cors')


const app = express()
const PORT = process.env.PORT || 3001

app.disable('x-powered-by')
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS || 0))
app.use(helmet())
const origins = (process.env.ALLOWED_ORIGINS || 'https://lmbagsebrindes.com.br,https://www.lmbagsebrindes.com.br,http://localhost:5173').split(',').map(s => s.trim())
app.use(cors({ origin(origin, callback) { callback(null, !origin || origins.includes(origin)) } }))
app.use(express.json({ limit: '32kb' }))
const limiter = (limit, windowMs) => rateLimit({ limit, windowMs, standardHeaders: 'draft-8', legacyHeaders: false, message: { erro: 'Muitas solicitações. Tente novamente mais tarde.' } })
app.use('/api', limiter(300, 60000))
app.use('/api/auth/login', limiter(10, 15 * 60000))
app.use('/api/catalogo/download', limiter(10, 15 * 60000))
app.use('/api/admin/visitas', limiter(30, 60000))

require('./config/database')

// Servir imagens locais — extrai o nome do arquivo da URL original
app.get('/imagens/:filename', (req, res) => {
  const filename = req.params.filename
  if (!/^[a-zA-Z0-9_-]+(?:\.(?:jpg|jpeg|png|webp))?$/i.test(filename)) return res.status(400).json({ erro: 'Imagem inválida' })
  const publicId = filename.replace(/\.(jpg|jpeg|png)$/i, '')
  const url = `https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${publicId}`
  res.redirect(url)
})
// Rotas da API
app.use('/api/produtos', require('./routes/produtos'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando!' })
})

// Rota pública de avaliações
app.get('/api/avaliacoes', async (req, res) => {
  const pool = require('./config/database')
  try {
    const result = await pool.query(
      'SELECT * FROM avaliacoes WHERE ativo = true ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// Rota pública — capturar email e liberar download do catálogo
app.post('/api/catalogo/download', async (req, res) => {
  const { email, nome } = req.body
  const pool = require('./config/database')

  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (nome != null && (typeof nome !== 'string' || nome.length > 120))) return res.status(400).json({ erro: 'Nome ou email inválido' })

  try {
    await pool.query(
      'INSERT INTO leads (email, nome) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [email, nome || null]
    )
    res.json({
      sucesso: true,
      url: 'https://drive.google.com/file/d/1vvA5Z98M3HDL2NqUbAJHd6GzWfU2-hWE/view?usp=sharing'
    })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)
  const status = err.code === 'LIMIT_FILE_SIZE' || err.type === 'entity.too.large' ? 413 : err instanceof SyntaxError || err.name === 'MulterError' || err.status === 400 ? 400 : 500
  res.status(status).json({ erro: status === 413 ? 'Arquivo ou solicitação muito grande.' : status === 400 ? 'Solicitação inválida.' : 'Erro interno.' })
})

if (require.main === module) app.listen(PORT, () => console.log('API iniciada'))
module.exports = app
