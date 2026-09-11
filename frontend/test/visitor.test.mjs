import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getVisitorId, clearVisitorId } from '../src/lib/visitor.js'
const storage=new Map()
Object.defineProperty(globalThis,'localStorage',{value:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},configurable:true})
test('mesmo navegador mantém identidade entre páginas e revogação cria nova identidade',()=>{
 const first=getVisitorId()
 assert.equal(getVisitorId(),first)
 clearVisitorId()
 assert.equal(storage.size,0)
 assert.notEqual(getVisitorId(),first)
})
test('identidade expirada é renovada',()=>{
 const first=getVisitorId()
 storage.set('lm_visitante_v1',JSON.stringify({id:first,expires:Date.now()-1}))
 clearVisitorId()
 storage.set('lm_visitante_v1',JSON.stringify({id:first,expires:Date.now()-1}))
 assert.notEqual(getVisitorId(),first)
})
