const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

const { jwtSecret: JWT_SECRET } = require('../config/security')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body

  if (typeof email !== 'string' || email.length > 254 || typeof senha !== 'string' || !senha || Buffer.byteLength(senha) > 72) return res.status(400).json({ erro: 'Credenciais inválidas' })

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' })
    }

    const admin = result.rows[0]
    const senhaCorreta = await bcrypt.compare(senha, admin.senha)

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '2h', algorithm: 'HS256', issuer: 'lmbags-api', audience: 'lmbags-admin' }
    )

    res.json({ token, email: admin.email })
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' })
  }
})

module.exports = router