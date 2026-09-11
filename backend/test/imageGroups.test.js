const {test}=require('node:test')
const assert=require('node:assert/strict')
const {family,planGroups}=require('../src/services/imageGroups')
const asset=(name)=>({public_id:`lmbags/${name}`,secure_url:`https://res.cloudinary.com/test/image/upload/lmbags/${name}`})
test('associa cores mantendo diferenças de modelo e tamanho',()=>{
 assert.equal(family('Abridor-de-Garrafa-Aco-AZUL-26659-1756566829.jpg'),'abridor-de-garrafa-aco')
 assert.equal(family('Garrafa-750ml-ROXO'),'garrafa-750ml')
 assert.notEqual(family('Garrafa-750ml-AZUL'),family('Garrafa-500ml-AZUL'))
 assert.equal(family('Abridor-modelo-123'),null)
 const products=[{id:1,codigo:'01',nome:'Abridor',imagem:'abridor-azul.jpg'}]
 const p=planGroups(products,[asset('abridor-azul'),asset('abridor-roxo'),asset('abridor-roxo'),asset('abridor-madeira-roxo')])
 assert.equal(p.matched.length,1)
 assert.deepEqual(p.matched[0].urls,[asset('abridor-roxo').secure_url])
})
test('nomes ambíguos e grupos sem imagem principal não são vinculados',()=>{
 const p={id:1,codigo:'01',imagem:'abridor-azul.jpg'}
 assert.equal(planGroups([p,{...p,id:2,codigo:'02'}],[asset('abridor-azul'),asset('abridor-roxo')]).matched.length,0)
 assert.equal(planGroups([p],[asset('abridor-roxo')]).matched.length,0)
})
