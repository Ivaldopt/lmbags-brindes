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

module.exports = router