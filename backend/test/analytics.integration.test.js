const { test } = require('node:test')
const assert = require('node:assert/strict')
const analytics = require('../src/services/analytics')
test('vários produtos do mesmo navegador contam um visitante e acessos não duplicam', { skip: process.env.ANALYTICS_DATABASE_TEST !== '1' }, async () => {
 require('dotenv').config()
 const pool = require('../src/config/database')
 const client = await pool.connect()
 try {
  await client.query('BEGIN')
  await client.query(`CREATE TEMP TABLE visitas_navegador (
    visitante UUID NOT NULL, tipo VARCHAR(10) NOT NULL, referencia VARCHAR(80) NOT NULL DEFAULT '',
    dia DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia')::date),
    PRIMARY KEY (visitante, tipo, referencia, dia)) ON COMMIT DROP`)
  const service=analytics(client)
  const a='a0000000-0000-4000-8000-000000000001', b='b0000000-0000-4000-8000-000000000002'
  await service.record(a,'home','')
  await service.record(a,'produto','1')
  await service.record(a,'produto','2')
  await service.record(a,'produto','2')
  let result=await service.stats()
  assert.equal(result.visitasHoje,1)
  assert.equal(result.visitasMes,1)
  assert.equal(result.topProdutos.length,2)
  assert.ok(result.topProdutos.every(p=>Number(p.total)===1))
  await service.record(b,'produto','2')
  result=await service.stats()
  assert.equal(result.visitasHoje,2)
  assert.equal(result.visitasMes,2)
  assert.equal(Number(result.topProdutos[0].total),2)
 } finally { await client.query('ROLLBACK'); client.release(); await pool.end() }
})
