function selectReviewed(plan, reviewed) {
  if (!Array.isArray(reviewed) || reviewed.length === 0) throw new Error('EMPTY_REVIEW_LIST')
  const seen=new Set()
  return reviewed.map(item=>{
    const candidate=plan.matched.find(p=>p.id===item.id && String(p.codigo)===String(item.codigo))
    if (!candidate || seen.has(item.id) || !Array.isArray(item.urls) || item.urls.length===0 || item.urls.some(url=>!candidate.urls.includes(url))) throw new Error('REVIEW_DOES_NOT_MATCH_CURRENT_CATALOG')
    seen.add(item.id)
    return {...candidate,urls:[...new Set(item.urls)]}
  })
}
module.exports={selectReviewed}
