const tls = require('node:tls')

module.exports = function databaseTls(env) {
  if (env.NODE_ENV !== 'production') return false
  const options = { rejectUnauthorized: true }
  if (!env.DATABASE_CA) return options
  options.ca = env.DATABASE_CA.replace(/\\n/g, '\n')
  const host = new URL(env.DATABASE_URL).hostname
  // Certificado legado deste serviço, autenticado pela CA privada configurada.
  // O endereço TCP permanece na rede privada; só o nome TLS esperado é adaptado.
  if (host === 'postgres.railway.internal') {
    options.checkServerIdentity = (hostname, cert) => {
      const normal = tls.checkServerIdentity(hostname, cert)
      if (!normal || hostname !== host) return normal
      return tls.checkServerIdentity('localhost', cert)
    }
  }
  return options
}
