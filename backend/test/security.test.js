const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
process.env.JWT_SECRET = 'local-test-only-secret-'.repeat(3)
const databasePath = require.resolve('../src/config/database')
let queryCount = 0
require.cache[databasePath] = { id: databasePath, filename: databasePath, loaded: true, exports: { query: async () => { queryCount++; return { rows: [] } } } }
const app = require('../src/server')
let server, base
before(async () => { server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); base = `http://127.0.0.1:${server.address().port}` })
after(() => new Promise(resolve => server.close(resolve)))
test('admin exige autenticação e recusa tokens da configuração antiga', async () => {
  assert.equal((await fetch(`${base}/api/admin/stats`)).status, 401)
  const token = jwt.sign({ id: 1, email: 'test@example.invalid' }, process.env.JWT_SECRET)
  assert.equal((await fetch(`${base}/api/admin/stats`, { headers: { authorization: `Bearer ${token}` } })).status, 401)
})
test('paginação abusiva é rejeitada antes de consultar o banco', async () => {
  const before = queryCount
  for (const query of ['limite=1000000', 'pagina=-1', 'busca[x]=a', 'pagina=1.5']) assert.equal((await fetch(`${base}/api/produtos?${query}`)).status, 400)
  assert.equal(queryCount, before)
})
test('JSON inválido e cadastro de lead inválido não expõem detalhes internos', async () => {
  for (const body of ['{', JSON.stringify({ email: { invalid: true } })]) {
    const res = await fetch(`${base}/api/catalogo/download`, { method: 'POST', headers: { 'content-type': 'application/json' }, body })
    assert.equal(res.status, 400)
    assert.ok((await res.json()).erro)
  }
})
test('respostas possuem cabeçalhos de proteção e CORS restrito', async () => {
  const res = await fetch(`${base}/health`, { headers: { origin: 'https://untrusted.example' } })
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(res.headers.get('x-powered-by'), null)
  assert.equal(res.headers.get('access-control-allow-origin'), null)
})
test('upload rejeita conteúdo falso mesmo com MIME de imagem', async () => {
  const token = jwt.sign({ id: 1, email: 'test@example.invalid' }, process.env.JWT_SECRET, { issuer: 'lmbags-api', audience: 'lmbags-admin' })
  const form = new FormData()
  form.append('imagem', new Blob(['not an image'], { type: 'image/png' }), 'fake.png')
  const res = await fetch(`${base}/api/admin/upload`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: form })
  assert.equal(res.status, 400)
})
test('login limita tentativas repetidas', async () => {
  let response
  for (let i = 0; i < 11; i++) response = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'test@example.invalid', senha: 'incorrect' }) })
  assert.equal(response.status, 429)
})

test('imagens públicas permitem incorporação entre domínios sem liberar a API', async () => {
  const image = await fetch(`${base}/imagens/produto.jpg`, { redirect: 'manual' })
  assert.equal(image.status, 302)
  assert.equal(image.headers.get('cross-origin-resource-policy'), 'cross-origin')
  assert.equal(image.headers.get('x-content-type-options'), 'nosniff')
  const api = await fetch(`${base}/health`)
  assert.equal(api.headers.get('cross-origin-resource-policy'), 'same-origin')
})

test('upload informa configuração ausente sem expor credenciais', async () => {
  const keys=['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET']
  const saved=keys.map(key=>process.env[key])
  keys.forEach(key=>delete process.env[key])
  try {
    const token=jwt.sign({id:1,email:'test@example.invalid'},process.env.JWT_SECRET,{issuer:'lmbags-api',audience:'lmbags-admin'})
    const form=new FormData()
    form.append('imagem',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6kZAAAAAASUVORK5CYII=','base64')],{type:'image/png'}),'teste.png')
    const response=await fetch(`${base}/api/admin/upload`,{method:'POST',headers:{authorization:`Bearer ${token}`},body:form})
    assert.equal(response.status,503)
    assert.match((await response.json()).erro,/Upload não configurado/)
  } finally { keys.forEach((key,i)=>{ if(saved[i]===undefined)delete process.env[key];else process.env[key]=saved[i] }) }
})
