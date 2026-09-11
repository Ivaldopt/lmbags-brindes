const colors = /-(?:azul(?:-marinho|-claro|-escuro)?|verde(?:-claro|-escuro)?|vermelho|vermelha|roxo|roxa|rosa|pink|preto|preta|branco|branca|cinza|prata|dourado|dourada|amarelo|amarela|laranja|bege|marrom|lilas|transparente|natural)$/
function stem(value) {
  return String(value || '').split('?')[0].split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
function family(value) {
  const name = stem(value)
  // Remove somente o sufixo conhecido de ID + timestamp. Medidas/modelos ficam intactos.
  const clean = name.replace(/-\d+-\d{10,13}$/, '')
  if (!colors.test(clean)) return null
  return clean.replace(colors, '')
}
function planGroups(products, assets) {
  const groups = new Map(), owners = new Map()
  for (const asset of assets) {
    const key = family(asset.public_id)
    if (key && asset.secure_url?.startsWith('https://res.cloudinary.com/')) {
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(asset)
    }
  }
  for (const product of products) {
    const key=family(product.imagem)
    if (key) { if (!owners.has(key)) owners.set(key, []); owners.get(key).push(product) }
  }
  const matched=[], review=[]
  for (const [key, list] of owners) {
    const images=groups.get(key)||[]
    if (list.length !== 1) { review.push({family:key,reason:'Mais de um produto tem a mesma família',products:list.map(p=>p.codigo)}); continue }
    const product=list[0]
    if (!images.some(a=>stem(a.public_id)===stem(product.imagem))) { review.push({family:key,reason:'Imagem principal não encontrada no grupo',products:[product.codigo]}); continue }
    const urls=[...new Set(images.filter(a=>stem(a.public_id)!==stem(product.imagem)).map(a=>a.secure_url))]
    if (urls.length) matched.push({id:product.id,codigo:product.codigo,name:product.nome,family:key,urls})
  }
  return {matched,review,unmatchedProducts:products.filter(p=>!family(p.imagem)).map(p=>({codigo:p.codigo,name:p.nome}))}
}
module.exports={family,planGroups}
