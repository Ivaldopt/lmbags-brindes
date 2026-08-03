const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'lmbags_secret_2026'

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' })
    }

    const admin = result.rows[0]
    const senhaCorreta = bcrypt.compareSync(senha, admin.senha)

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token, email: admin.email })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

module.exports = router