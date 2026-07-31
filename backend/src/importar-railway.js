const { Pool } = require('pg')
const fs = require('fs')
const { parse } = require('csv-parse/sync')

const pool = new Pool({
  connectionString: 'postgresql://postgres:FGYNXUwoXXCFzWTvzgRZgEzmhgewZguk@caboose.proxy.rlwy.net:57882/railway',
  ssl: { rejectUnauthorized: false }
})

async function importar() {
  console.log('🔌 Conectando no banco do Railway...')
  const client = await pool.connect()
  console.log('✅ Conectado!')

  // Criar tabela
  await client.query(`
    CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      codigo INTEGER UNIQUE NOT NULL,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      altura VARCHAR(50),
      largura VARCHAR(50),
      medidas VARCHAR(100),
      peso VARCHAR(50),
      imagem VARCHAR(500),
      categoria VARCHAR(100)
    )
  `)
  console.log('✅ Tabela criada!')

  const conteudo = fs.readFileSync('produtos.csv', 'utf-8')
  const linhas = parse(conteudo, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  })

  console.log(`📊 ${linhas.length} produtos para importar...`)

  let importados = 0
  let erros = 0

  for (const linha of linhas) {
    const codigo = parseInt(linha.codigo)
    if (isNaN(codigo)) { erros++; continue }

    try {
      await client.query(
        `INSERT INTO produtos (codigo, nome, descricao, altura, largura, medidas, peso, imagem, categoria)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (codigo) DO NOTHING`,
        [codigo, linha.nome, linha.descricao, linha.altura, linha.largura, linha.medidas, linha.peso, linha.imagem, linha.categoria]
      )
      importados++
      if (importados % 500 === 0) console.log(`⏳ ${importados} importados...`)
    } catch (err) {
      erros++
    }
  }

  client.release()
  console.log(`\n✅ Concluído! ${importados} importados, ${erros} erros`)
  process.exit(0)
}

importar().catch(e => { console.error('Erro:', e.message); process.exit(1) })