const { Pool } = require('pg')
const fs = require('fs')
const { parse } = require('csv-parse/sync')

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'lmbags',
})

const CSV_PATH = process.argv[2]
console.log('📂 Lendo arquivo:', CSV_PATH)

async function importar() {
  console.log('📂 Lendo CSV...')

  const conteudo = fs.readFileSync(CSV_PATH, 'utf-8')

  const linhas = parse(conteudo, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
    bom: true,
  })

  console.log(`📊 Total de produtos encontrados: ${linhas.length}`)

  const client = await pool.connect()

  // Limpa tabela antes de reimportar
  await client.query('TRUNCATE TABLE produtos RESTART IDENTITY')
  console.log('🗑️  Tabela limpa, iniciando importação...')

  let importados = 0
  let erros = 0

  for (const linha of linhas) {
    const codigo = parseInt(linha.codigo)

    if (isNaN(codigo)) {
      erros++
      continue
    }

    try {
      await client.query(
        `INSERT INTO produtos (codigo, nome, descricao, altura, largura, medidas, peso, imagem, categoria)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (codigo) DO NOTHING`,
        [
          codigo,
          linha.nome || null,
          linha.descricao || null,
          linha.altura || null,
          linha.largura || null,
          linha.medidas || null,
          linha.peso || null,
          linha.imagem || null,
          linha.categoria || null,
        ]
      )
      importados++

      if (importados % 500 === 0) {
        console.log(`⏳ ${importados} produtos importados...`)
      }
    } catch (err) {
      erros++
      if (erros <= 3) console.log(`❌ Erro:`, err.message, '| Linha:', linha)
    }
  }

  client.release()
  console.log(`\n✅ Importação concluída!`)
  console.log(`   ✔ ${importados} produtos importados`)
  console.log(`   ✖ ${erros} erros`)
  process.exit(0)
}

importar().catch(e => {
  console.error('Erro fatal:', e.message)
  process.exit(1)
})