const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// GET /api/produtos — lista todos com paginação e filtros
router.get('/', async (req, res) => {
  try {
    const { categoria, busca, pagina = 1, limite = 20 } = req.query
    const offset = (pagina - 1) * limite
    const params = []
    let where = []

    if (categoria) {
      params.push(categoria)
      where.push(`categoria = $${params.length}`)
    }

    if (busca) {
      params.push(`%${busca}%`)
      where.push(`(nome ILIKE $${params.length} OR descricao ILIKE $${params.length})`)
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM produtos ${whereClause}`,
      params
    )
    const total = parseInt(totalResult.rows[0].count)

    params.push(limite)
    params.push(offset)

    const result = await pool.query(
      `SELECT * FROM produtos ${whereClause} ORDER BY nome ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    res.json({
      produtos: result.rows,
      total,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite)
    })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/produtos/categorias — lista todas as categorias
router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT categoria, COUNT(*) as total 
       FROM produtos 
       GROUP BY categoria 
       ORDER BY categoria ASC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/produtos/:codigo — busca produto por código
router.get('/:codigo', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM produtos WHERE codigo = $1',
      [req.params.codigo]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/produtos/:codigo/imagens — busca todas as imagens do produto
router.get('/:codigo/imagens', async (req, res) => {
  try {
    // Busca produto pelo codigo
    const produtoResult = await pool.query(
      'SELECT id, imagem FROM produtos WHERE codigo = $1',
      [req.params.codigo]
    )
    if (produtoResult.rows.length === 0) return res.json([])

    const produto = produtoResult.rows[0]

    // Busca imagens extras na tabela produto_imagens
    const imagensResult = await pool.query(
      'SELECT url FROM produto_imagens WHERE produto_id = $1 ORDER BY ordem ASC',
      [produto.id]
    )

    if (imagensResult.rows.length > 0) {
      // Retorna imagens extras + imagem principal
      const urls = imagensResult.rows.map(r => r.url)
      if (produto.imagem) {
        const nomeArquivo = produto.imagem.split('/').pop().replace(/\.[^/.]+$/, '')
        const urlPrincipal = `https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${nomeArquivo}`
        if (!urls.includes(urlPrincipal)) urls.unshift(urlPrincipal)
      }
      return res.json(urls)
    }

    // Se não tem imagens extras, retorna só a principal
    if (!produto.imagem) return res.json([])
    const nomeArquivo = produto.imagem.split('/').pop().replace(/\.[^/.]+$/, '')
    res.json([`https://res.cloudinary.com/zfkjqogg/image/upload/lmbags/${nomeArquivo}`])
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})
// GET /api/produtos/:codigo/variacoes — busca produtos com nome similar
router.get('/:codigo/variacoes', async (req, res) => {
  try {
    const produtoRes = await pool.query(
      'SELECT nome FROM produtos WHERE codigo = $1',
      [req.params.codigo]
    )
    if (produtoRes.rows.length === 0) return res.json([])

    const nomeCompleto = produtoRes.rows[0].nome

    const result = await pool.query(
      `SELECT codigo, nome, imagem FROM produtos 
       WHERE nome = $1 AND codigo != $2
       ORDER BY codigo ASC LIMIT 8`,
      [nomeCompleto, req.params.codigo]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// GET /api/avaliacoes — rota pública para o site
router.get('/avaliacoes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM avaliacoes WHERE ativo = true ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

module.exports = router