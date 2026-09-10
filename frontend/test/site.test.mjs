import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

const saved = new Map()
const eventHandlers = new Map()
const storage = { getItem: key => saved.get(key) ?? null, setItem: (key,value) => saved.set(key,String(value)), removeItem: key => saved.delete(key) }
globalThis.window = { addEventListener: (name,fn) => eventHandlers.set(name,fn), removeEventListener() {}, dispatchEvent() {}, matchMedia: () => ({ matches:false, addEventListener(){}, removeEventListener(){} }) }
Object.defineProperty(globalThis,'localStorage',{ value:storage, configurable:true })
Object.defineProperty(globalThis,'sessionStorage',{ value:storage, configurable:true })
let server, App, AuthProvider
before(async () => {
  server = await createServer({ configLoader:'native', server:{middlewareMode:true}, appType:'custom' })
  App = (await server.ssrLoadModule('/src/App.jsx')).default
  AuthProvider = (await server.ssrLoadModule('/src/context/AuthContext.jsx')).AuthProvider
})
after(async () => { await server?.close() })
function page(path) { return renderToString(React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(AuthProvider,null,React.createElement(App)))) }

test('primeira visita não inclui widget ou script externo de avaliações', () => {
  const html=page('/')
  assert.match(html,/Rejeitar opcionais/)
  assert.doesNotMatch(html,/<iframe/)
  assert.doesNotMatch(html,/<script[^>]*src="https:\/\/elfsight/)
  assert.match(html,/Preferências de cookies/)
})
test('home contém cinco banners e quatro coleções clicáveis', () => {
  const html=page('/')
  assert.equal((html.match(/aria-roledescription="slide"/g)||[]).length,5)
  for(const term of ['Sacola','Garrafa','Mochila','Caneta']) assert.ok(html.includes(`/catalogo?busca=${term}`))
  assert.ok(html.includes('href="/outubro-rosa"'))
  assert.ok(html.includes('Pausar carrossel automático'))
})
test('campanha e páginas de política estão conectadas e têm títulos próprios', () => {
  for(const [path,title] of [['/outubro-rosa','Outubro Rosa'],['/termos-de-uso','Termos de uso'],['/politica-de-privacidade','Política de privacidade'],['/politica-de-cookies','Política de cookies'],['/trocas-e-devolucoes','Trocas, devoluções e cancelamentos'],['/entrega-e-pagamento','Entrega e pagamento'],['/atendimento-e-reclamacoes','Atendimento e reclamações']]) {
    const html=page(path)
    assert.ok(html.includes(title),path)
    assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,path)
  }
  assert.match(page('/constructor'),/Página não encontrada/)
})
test('consentimento começa negado, persiste escolhas e permite revogar', async () => {
  saved.clear()
  const consent = await import(`../src/lib/consent.js?test=${Date.now()}`)
  assert.equal(consent.getConsent().statistics,false)
  assert.equal(consent.getConsent().external,false)
  consent.saveConsent({statistics:false,external:true})
  assert.equal(consent.getConsent().external,true)
  assert.equal(consent.getConsent().statistics,false)
  consent.saveConsent({statistics:false,external:false})
  assert.equal(consent.getConsent().external,false)
  assert.equal(JSON.parse(saved.get('lmbags_privacidade_v1')).external,false)
  saved.set('lmbags_privacidade_v1',JSON.stringify({version:1,statistics:true,external:true,savedAt:Date.now()-181*86400000}))
  eventHandlers.get('storage')({key:'lmbags_privacidade_v1'})
  assert.equal(consent.getConsent().decided,false)
  assert.equal(consent.getConsent().external,false)
})

test('menu principal não inclui campanha e atalhos levam ao catálogo', () => {
  const html=page('/')
  const mainNav=html.match(/<nav aria-label="Navegação principal"[\s\S]*?<\/nav>/)?.[0]
  assert.ok(mainNav)
  assert.doesNotMatch(mainNav,/outubro-rosa/)
  assert.match(html,/aria-label="Acesso rápido ao catálogo"/)
  assert.match(html,/href="#baixar-catalogo"/)
  assert.match(html,/id="baixar-catalogo"/)
  assert.match(html,/outubro-cenario.webp/)
})
