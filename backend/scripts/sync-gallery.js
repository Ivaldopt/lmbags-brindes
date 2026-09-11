require('dotenv').config()
const fs=require('node:fs/promises')
const cloudinary=require('cloudinary').v2
const {planGroups}=require('../src/services/imageGroups')
const {selectReviewed}=require('../src/services/reviewedGallery')
async function main(){
  const apply=process.argv.includes('--apply')
  const reviewPath=process.argv.find(arg=>arg.startsWith('--reviewed='))?.slice('--reviewed='.length)
  if(apply && !reviewPath) { console.error('Informe --reviewed=arquivo.json com as URLs revisadas. Nenhuma associação foi gravada.'); process.exitCode=1; return }
  const reviewed=apply ? JSON.parse(await fs.readFile(reviewPath,'utf8')) : null
  const keys=['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET']
  if(keys.some(k=>!process.env[k])) throw new Error('Configure as três variáveis CLOUDINARY no ambiente antes de sincronizar.')
  cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET})
  const pool=require('../src/config/database')
  try{
    const assets=[];let cursor
    do{
      const page=await cloudinary.api.resources({resource_type:'image',type:'upload',prefix:process.env.CLOUDINARY_GALLERY_PREFIX||'lmbags/',max_results:500,...(cursor?{next_cursor:cursor}:{})})
      assets.push(...page.resources);cursor=page.next_cursor
      console.log('Imagens lidas:',assets.length)
    }while(cursor)
    const {rows:products}=await pool.query('SELECT id,codigo,nome,imagem FROM produtos')
    const plan=planGroups(products,assets)
    await fs.writeFile('galerias-relatorio.json',JSON.stringify({createdAt:new Date().toISOString(),assetCount:assets.length,...plan},null,2))
    console.log('Produtos com associações:',plan.matched.length,'Grupos ambíguos:',plan.review.length)
    if(!apply){console.log('Simulação concluída. Confira galerias-relatorio.json. Para gravar associações sem apagar fotos, use --apply --reviewed=arquivo.json após revisar cada foto.');return}
    const selected=selectReviewed(plan,reviewed)
    const client=await pool.connect();let added=0
    try{
      await client.query('BEGIN')
      await client.query("SELECT pg_advisory_xact_lock(731925)")
      for(const item of selected){
        const result=await client.query(`INSERT INTO produto_imagens (produto_id,url,ordem)
          SELECT $1, incoming.url, COALESCE((SELECT MAX(ordem)+1 FROM produto_imagens WHERE produto_id=$1),0)+incoming.position::int
          FROM unnest($2::text[]) WITH ORDINALITY AS incoming(url,position)
          WHERE NOT EXISTS (SELECT 1 FROM produto_imagens WHERE produto_id=$1 AND url=incoming.url)`,[item.id,item.urls])
        added+=result.rowCount
      }
      await client.query('COMMIT');console.log('Associações adicionadas:',added)
    }catch(error){await client.query('ROLLBACK');throw error}finally{client.release()}
  }finally{await pool.end()}
}
main().catch(error=>{console.error('Sincronização não concluída. Código:',error.code||error.http_code||'CONFIG_OR_SERVICE_ERROR');process.exitCode=1})
