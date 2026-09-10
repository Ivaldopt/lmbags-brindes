import { Link } from 'react-router-dom'

const collections = [
  { name: 'Ecobags e sacolas', image: '/banners/ecobags.webp', search: 'Sacola', text: 'Sua marca em movimento' },
  { name: 'Garrafas e squeezes', image: '/banners/garrafas.webp', search: 'Garrafa', text: 'Para todos os momentos' },
  { name: 'Mochilas e bolsas', image: '/banners/mochilas.webp', search: 'Mochila', text: 'Ideias que vão mais longe' },
  { name: 'Canetas', image: '/banners/canetas.webp', search: 'Caneta', text: 'Presença em cada detalhe' },
]
export default function CollectionCards() {
  return <section className="max-w-7xl mx-auto px-5 py-12" aria-labelledby="collections-title"><p className="text-xs tracking-widest uppercase text-sky-700 font-semibold mb-2">Encontre o próximo presente</p><h2 id="collections-title" className="text-3xl font-semibold tracking-tight text-slate-800 mb-7">Uma ideia para cada ocasião.</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{collections.map(item => <Link key={item.search} to={`/catalogo?busca=${encodeURIComponent(item.search)}`} className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"><div className="h-44 md:h-52 overflow-hidden bg-[#eeeee9]"><img src={item.image} alt={item.name} loading="lazy" width="500" height="350" className={`w-full h-full ${item.search === 'Sacola' ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`} /></div><div className="p-4"><p className="text-xs text-slate-500 mb-2">{item.text}</p><h3 className="text-base md:text-lg text-slate-800 font-semibold">{item.name} <span aria-hidden="true">↗</span></h3></div></Link>)}</div></section>
}
