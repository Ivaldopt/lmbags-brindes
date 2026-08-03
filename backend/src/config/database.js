const { Pool } = require('pg')

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  host: isProduction ? undefined : '127.0.0.1',
  port: isProduction ? undefined : 5432,
  user: isProduction ? undefined : 'admin',
  password: isProduction ? undefined : 'admin',
  database: isProduction ? undefined : 'lmbags',
})

pool.connect()
  .then(client => {
    console.log('✅ Banco de dados conectado!')
    client.release()
  })
  .catch(err => console.error('❌ Erro ao conectar no banco:', err.message))

module.exports = pool