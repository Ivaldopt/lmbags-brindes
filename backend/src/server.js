const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

require('./config/database')

// Servir imagens locais — extrai o nome do arquivo da URL original
app.get('/imagens/:filename', (req, res) => {
  const filename = req.params.filename
  const filepath = path.join('D:\\Programaçao\\Criaçao de site\\img\\produtos\\3', filename)
  res.sendFile(filepath, err => {
    if (err) res.status(404).json({ erro: 'Imagem não encontrada' })
  })
})

// Rotas da API
app.use('/api/produtos', require('./routes/produtos'))

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})