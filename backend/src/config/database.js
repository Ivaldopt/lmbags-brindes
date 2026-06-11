const { Pool } = require('pg')

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'lmbags',
})

pool.connect()
  .then(client => {
    console.log('✅ Banco de dados conectado!')
    client.release()
  })
  .catch(err => console.error('❌ Erro ao conectar no banco:', err.message))

module.exports = pool