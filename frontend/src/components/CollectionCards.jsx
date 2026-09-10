import { Link } from 'react-router-dom'
import './CollectionCards.css'

const collections = [
  { name: 'Garrafas e squeezes', image: 'garrafas', search: 'Garrafa', shape: 'tall', text: 'Uma pausa com a sua marca' },
  { name: 'Canetas', image: 'canetas', search: 'Caneta', shape: 'pen', text: 'Ideias que deixam sua marca' },
  { name: 'Ecobags e sacolas', image: 'sacolas', search: 'Sacola', shape: 'eco', text: 'Para acompanhar todos os dias' },
  { name: 'Mochilas e bolsas', image: 'mochilas', search: 'Mochila', shape: 'wide', text: 'Leve sua marca mais longe' },
  { name: 'Bolsas térmicas', image: 'bolsas-termicas', search: 'Bolsa Térmica', shape: 'bottom', text: 'Boas ideias para levar' },
  { name: 'Cadernetas', image: 'cadernetas', search: 'Caderneta', shape: 'bottom notebook', text: 'O começo de uma nova ideia' },
  { name: 'Copos térmicos', image: 'copos', search: 'Copo', shape: 'bottom cup', text: 'Presentes para o dia a dia' },
]
export default function CollectionCards() {
  return <section className="collection-section" aria-labelledby="collections-title">
    <div className="collection-heading"><div><p>Encontre o próximo presente</p><h2 id="collections-title">Uma ideia para cada ocasião.</h2></div><Link to="/catalogo">Explorar catálogo →</Link></div>
    <div className="collection-mosaic">{collections.map(item => <Link key={item.search} to={`/catalogo?busca=${encodeURIComponent(item.search)}`} className={`collection-tile ${item.shape}`}>
      <div className="collection-caption"><p>{item.text}</p><h3>{item.name}</h3><span className="collection-button">Confira <span aria-hidden="true">→</span></span></div>
      <img src={`/categorias/${item.image}.webp`} alt={item.name} loading="lazy" decoding="async" width="600" height="700" />
    </Link>)}</div>
  </section>
}
