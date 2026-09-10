const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
  throw new Error('Configure JWT_SECRET com pelo menos 32 bytes aleatórios antes de iniciar a API.')
}
module.exports = { jwtSecret }
