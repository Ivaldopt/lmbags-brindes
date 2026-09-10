function pagination(req, res, next) {
  const { pagina = '1', limite = '20', busca, categoria } = req.query
  if (!/^\d+$/.test(String(pagina)) || !/^\d+$/.test(String(limite)) ||
      !Number.isSafeInteger(Number(pagina)) || Number(pagina) < 1 || Number(pagina) > 100000 ||
      Number(limite) < 1 || Number(limite) > 100 ||
      (busca !== undefined && (typeof busca !== 'string' || busca.length > 200)) ||
      (categoria !== undefined && (typeof categoria !== 'string' || categoria.length > 120))) {
    return res.status(400).json({ erro: 'Filtros ou paginação inválidos. Limite máximo: 100.' })
  }
  next()
}
function imageSignature(buffer) {
  if (!Buffer.isBuffer(buffer)) return false
  return (buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) ||
    (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ||
    (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP')
}
module.exports = { pagination, imageSignature }
