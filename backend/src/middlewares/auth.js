const jwt = require('jsonwebtoken')

const { jwtSecret: JWT_SECRET } = require('../config/security')

function autenticar(req, res, next) {
  const token = /^Bearer ([^ ]+)$/.exec(req.headers.authorization || '')?.[1]

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], issuer: 'lmbags-api', audience: 'lmbags-admin' })
    if (!decoded.id || typeof decoded.email !== 'string') return res.status(401).json({ erro: 'Token inválido' })
    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
}

module.exports = autenticar