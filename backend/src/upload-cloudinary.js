const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

cloudinary.config({
  cloud_name: 'zfkjqogg',
  api_key: '761551516374698',
  api_secret: 'jd49sTqhB_EdfJTQoS9RmHmBvGA'
})

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'lmbags',
})

const PASTA_IMAGENS = process.argv[2]

async function uploadImagens() {
  console.log('📂 Lendo pasta:', PASTA_IMAGENS)
  const arquivos = fs.readdirSync(PASTA_IMAGENS).filter(f => f.match(/\.(jpg|jpeg|png)$/i))
  console.log(`📊 Total de imagens: ${arquivos.length}`)

  let enviados = 0
  let erros = 0
  let pulados = 0

  for (const arquivo of arquivos) {
    const filepath = path.join(PASTA_IMAGENS, arquivo)
    const publicId = path.parse(arquivo).name

    try {
      // Verifica se já existe no Cloudinary
      try {
        await cloudinary.api.resource(`lmbags/${publicId}`)
        pulados++
        if (pulados % 100 === 0) console.log(`⏭️  ${pulados} já existiam...`)
        continue
      } catch (e) {
        // Não existe, faz upload
      }

      await cloudinary.uploader.upload(filepath, {
        folder: 'lmbags',
        public_id: publicId,
        overwrite: false,
      })

      enviados++
      if (enviados % 50 === 0) {
        console.log(`⬆️  ${enviados} enviados, ${erros} erros, ${pulados} pulados...`)
      }
    } catch (err) {
      erros++
      if (erros <= 3) console.log(`❌ Erro em ${arquivo}:`, err.message)
    }
  }

  console.log(`\n✅ Upload concluído!`)
  console.log(`   ⬆️  ${enviados} enviados`)
  console.log(`   ⏭️  ${pulados} já existiam`)
  console.log(`   ❌ ${erros} erros`)
  process.exit(0)
}

uploadImagens().catch(e => {
  console.error('Erro fatal:', e.message)
  process.exit(1)
})