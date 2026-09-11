const {test}=require('node:test')
const assert=require('node:assert/strict')
const {selectReviewed}=require('../src/services/reviewedGallery')
const plan={matched:[{id:1,codigo:10,urls:['https://example/a','https://example/b']},{id:2,codigo:20,urls:['https://example/c']}]}
test('aplica somente URLs revisadas, não todos os candidatos',()=>{
 const selected=selectReviewed(plan,[{id:1,codigo:10,urls:['https://example/b']}])
 assert.equal(selected.length,1)
 assert.deepEqual(selected[0].urls,['https://example/b'])
})
test('recusa produto ou foto alterados desde a revisão',()=>{
 assert.throws(()=>selectReviewed(plan,[{id:1,codigo:20,urls:['https://example/a']}]))
 assert.throws(()=>selectReviewed(plan,[{id:1,codigo:10,urls:['https://example/c']}]))
 assert.throws(()=>selectReviewed(plan,[]))
})
