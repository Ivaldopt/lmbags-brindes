const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const autenticar = require('../middlewares/auth')
const cloudinary = require('cloudinary').v2
const multer = require('multer')

router.post('/visitas', async (req, res) => {
  const { tipo, referencia } = req.body
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress

  try {
    // Verifica se esse IP já visitou hoje
    const jaVisitou = await pool.query(
      `SELECT id FROM visitas 
       WHERE ip = $1 AND tipo = $2 AND referencia = $3
       AND created_at >= NOW() - INTERVAL '24 hours'`,
      [ip, tipo, referencia || null]
    )

    if (jaVisitou.rows.length > 0) {
      return res.json({ sucesso: true, duplicado: true })
    }

    await pool.query(
      'INSERT INTO visitas (tipo, referencia, ip) VALUES ($1, $2, $3)',
      [tipo, referencia || null, ip]
    )
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

cloudinary.config({
  cloud_name: 'zfkjqogg',
  api_key: '761551516374698',
  api_secret: 'jd49sTqhB_EdfJTQoS9RmHmBvGA'
})

const upload = multer({ storage: multer.memoryStorage() })

// Todas as rotas admin precisam de autenticação
router.use(autenticar)

// GET /api/admin/stats — estatísticas completas
router.get('/stats', async (req, res) => {
  try {
    const [totalProdutos, totalCategorias, visitasHoje, visitasMes, topProdutos] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM produtos'),
      pool.query('SELECT COUNT(DISTINCT categoria) FROM produtos'),
      pool.query("SELECT COUNT(*) FROM visitas WHERE created_at >= NOW() - INTERVAL '24 hours'"),
      pool.query("SELECT COUNT(*) FROM visitas WHERE created_at >= NOW() - INTERVAL '30 days'"),
      pool.query(`
        SELECT referencia, COUNT(*) as total 
        FROM visitas 
        WHERE tipo = 'produto' AND referencia IS NOT NULL
        GROUP BY referencia 
        ORDER BY total DESC 
        LIMIT 5
      `),
    ])

    res.json({
      totalProdutos: parseInt(totalProdutos.rows[0].count),
      totalCategorias: parseInt(totalCategorias.rows[0].count),
      visitasHoje: parseInt(visitasHoje.rows[0].count),
      visitasMes: parseInt(visitasMes.rows[0].count),
      topProdutos: topProdutos.rows,
    })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/admin/produtos — lista todos
router.get('/produtos', async (req, res) => {
  try {
    const { busca, pagina = 1, limite = 20 } = req.query
    const offset = (pagina - 1) * limite
    const params = []
    let where = ''

    if (busca) {
      params.push(`%${busca}%`)
      where = `WHERE nome ILIKE $1 OR categoria ILIKE $1`
    }

    const total = await pool.query(`SELECT COUNT(*) FROM produtos ${where}`, params)
    params.push(limite)
    params.push(offset)

    const result = await pool.query(
      `SELECT * FROM produtos ${where} ORDER BY nome ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    res.json({
      produtos: result.rows,
      total: parseInt(total.rows[0].count),
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total.rows[0].count / limite)
    })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// PUT /api/admin/produtos/:id — editar produto
router.put('/produtos/:id', async (req, res) => {
  const { nome, descricao, altura, largura, medidas, peso, imagem, categoria } = req.body
  try {
    await pool.query(
      `UPDATE produtos SET nome=$1, descricao=$2, altura=$3, largura=$4, medidas=$5, peso=$6, imagem=$7, categoria=$8 WHERE id=$9`,
      [nome, descricao, altura, largura, medidas, peso, imagem, categoria, req.params.id]
    )
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// POST /api/admin/produtos — criar produto
router.post('/produtos', async (req, res) => {
  const { codigo, nome, descricao, altura, largura, medidas, peso, imagem, categoria } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO produtos (codigo, nome, descricao, altura, largura, medidas, peso, imagem, categoria)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [codigo, nome, descricao, altura, largura, medidas, peso, imagem, categoria]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// DELETE /api/admin/produtos/:id — deletar produto
router.delete('/produtos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM produtos WHERE id = $1', [req.params.id])
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/admin/stats — estatísticas
router.get('/stats', async (req, res) => {
  try {
    const [totalProdutos, totalCategorias] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM produtos'),
      pool.query('SELECT COUNT(DISTINCT categoria) FROM produtos'),
    ])
    res.json({
      totalProdutos: parseInt(totalProdutos.rows[0].count),
      totalCategorias: parseInt(totalCategorias.rows[0].count),
    })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// POST /api/admin/upload — upload de imagem para Cloudinary
router.post('/upload', autenticar, upload.single('imagem'), async (req, res) => {
  try {
    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'lmbags' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(req.file.buffer)
    })
    res.json({ url: resultado.secure_url })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/admin/produtos/:id/imagens — listar imagens do produto
router.get('/produtos/:id/imagens', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM produto_imagens WHERE produto_id = $1 ORDER BY ordem ASC',
      [req.params.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// POST /api/admin/produtos/:id/imagens — adicionar imagem ao produto
router.post('/produtos/:id/imagens', async (req, res) => {
  const { url } = req.body
  try {
    const ordemResult = await pool.query(
      'SELECT COUNT(*) FROM produto_imagens WHERE produto_id = $1',
      [req.params.id]
    )
    const ordem = parseInt(ordemResult.rows[0].count)
    const result = await pool.query(
      'INSERT INTO produto_imagens (produto_id, url, ordem) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, url, ordem]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// DELETE /api/admin/imagens/:id — deletar imagem
router.delete('/imagens/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM produto_imagens WHERE id = $1', [req.params.id])
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// POST /api/visitas — registrar visita (rota pública)
router.post('/visitas', async (req, res) => {
  const { tipo, referencia } = req.body
  try {
    await pool.query(
      'INSERT INTO visitas (tipo, referencia) VALUES ($1, $2)',
      [tipo, referencia || null]
    )
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

module.exports = router
