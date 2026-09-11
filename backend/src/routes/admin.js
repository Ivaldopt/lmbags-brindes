const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const analytics = require('../services/analytics')(pool)
const autenticar = require('../middlewares/auth')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { pagination, imageSignature } = require('../middlewares/validation')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 }, fileFilter: (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(null, true)
  const error = new Error('Formato de imagem inválido'); error.status = 400; cb(error)
} })

// ✅ ROTA PÚBLICA — registrar visita (sem autenticação)
router.post('/visitas', async (req, res) => {
  const { tipo, referencia, visitante } = req.body
  if (!['home', 'produto'].includes(tipo) || (referencia != null && (typeof referencia !== 'string' || referencia.length > 80))) return res.status(400).json({ erro: 'Visita inválida' })
  // Clientes anteriores não devem contaminar a nova contagem com IPs de proxy.
  if (visitante == null) return res.json({ sucesso: true, ignorado: true })
  if (typeof visitante !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitante)) return res.status(400).json({ erro: 'Visitante inválido' })
  try {
    await analytics.record(visitante, tipo, referencia || '')
    res.json({ sucesso: true })
  } catch {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// ✅ Todas as rotas abaixo precisam de autenticação
router.use(autenticar)

router.param('id', (req, res, next, id) => {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return res.status(400).json({ erro: 'Identificador inválido' })
  next()
})

router.get('/produtos/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ erro: 'Produto não encontrado' })
    res.json(result.rows[0])
  } catch {
    res.status(500).json({ erro: 'Não foi possível carregar o produto.' })
  }
})

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalProdutos, totalCategorias, visits] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM produtos'),
      pool.query('SELECT COUNT(DISTINCT categoria) FROM produtos'),
      analytics.stats(),
    ])
    res.json({
      totalProdutos: parseInt(totalProdutos.rows[0].count),
      totalCategorias: parseInt(totalCategorias.rows[0].count),
      ...visits,
    })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// GET /api/admin/produtos
router.get('/produtos', pagination, async (req, res) => {
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
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// PUT /api/admin/produtos/:id
router.put('/produtos/:id', async (req, res) => {
  const { nome, descricao, altura, largura, medidas, peso, imagem, categoria } = req.body
  try {
    await pool.query(
      `UPDATE produtos SET nome=$1, descricao=$2, altura=$3, largura=$4, medidas=$5, peso=$6, imagem=$7, categoria=$8 WHERE id=$9`,
      [nome, descricao, altura, largura, medidas, peso, imagem, categoria, req.params.id]
    )
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// POST /api/admin/produtos
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
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// DELETE /api/admin/produtos/:id
router.delete('/produtos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM produtos WHERE id = $1', [req.params.id])
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// POST /api/admin/upload
router.post('/upload', upload.single('imagem'), async (req, res) => {
  if (!req.file || !imageSignature(req.file.buffer)) return res.status(400).json({ erro: 'Envie uma imagem JPEG, PNG ou WebP válida.' })
  const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(key => !process.env[key]?.trim())
  if (missing.length) {
    console.error('Upload indisponível: variáveis ausentes:', missing.join(', '))
    return res.status(503).json({ erro: 'Upload não configurado no servidor. Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no serviço backend do Railway.' })
  }
  try {
    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'lmbags', resource_type: 'image', timeout: 50000 },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(req.file.buffer)
    })
    res.json({ url: resultado.secure_url })
  } catch (err) {
    const status = Number(err.http_code) || 0
    console.error('Falha no serviço de upload. HTTP:', status)
    res.status(502).json({ erro: [401, 403].includes(status)
      ? 'O serviço de imagens recusou as credenciais. Confira as chaves do Cloudinary no Railway.'
      : 'O serviço de imagens não concluiu o envio. Tente novamente; se persistir, confira os logs do Railway.' })
  }
})

// GET /api/admin/produtos/:id/imagens
router.get('/produtos/:id/imagens', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM produto_imagens WHERE produto_id = $1 ORDER BY ordem ASC',
      [req.params.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// POST /api/admin/produtos/:id/imagens
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
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// DELETE /api/admin/imagens/:id
router.delete('/imagens/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM produto_imagens WHERE id = $1', [req.params.id])
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// GET /api/admin/avaliacoes — listar todas
router.get('/avaliacoes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM avaliacoes ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// POST /api/admin/avaliacoes — criar avaliação
router.post('/avaliacoes', async (req, res) => {
  const { nome, nota, comentario, foto_url, data_avaliacao } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO avaliacoes (nome, nota, comentario, foto_url, data_avaliacao)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, nota, comentario, foto_url || null, data_avaliacao || null]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// PUT /api/admin/avaliacoes/:id — editar avaliação
router.put('/avaliacoes/:id', async (req, res) => {
  const { nome, nota, comentario, foto_url, data_avaliacao, ativo } = req.body
  try {
    await pool.query(
      `UPDATE avaliacoes SET nome=$1, nota=$2, comentario=$3, foto_url=$4, data_avaliacao=$5, ativo=$6 WHERE id=$7`,
      [nome, nota, comentario, foto_url, data_avaliacao, ativo, req.params.id]
    )
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

// DELETE /api/admin/avaliacoes/:id — deletar avaliação
router.delete('/avaliacoes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM avaliacoes WHERE id = $1', [req.params.id])
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

module.exports = router
