import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { saveConsent, useConsent } from '../lib/consent'
import './Privacy.css'

export default function CookieConsent() {
  const consent = useConsent()
  const [opened, setOpened] = useState(false)
  const [details, setDetails] = useState(false)
  const [statistics, setStatistics] = useState(consent.statistics)
  const [external, setExternal] = useState(consent.external)
  useEffect(() => {
    function open() {
      setStatistics(consent.statistics); setExternal(consent.external); setDetails(true); setOpened(true)
    }
    window.addEventListener('lmbags-cookie-settings', open)
    return () => window.removeEventListener('lmbags-cookie-settings', open)
  }, [consent])
  function save(choices) { saveConsent(choices); setOpened(false); setDetails(false) }
  if (consent.decided && !opened) return null
  return (
    <section className="cookie-panel" role="region" aria-label="Preferências de privacidade">
      <div className="cookie-copy"><h2>Sua privacidade, suas escolhas.</h2>
        <p>Usamos armazenamento necessário para lembrar suas preferências e proteger o acesso administrativo. Você escolhe se permite estatísticas de visita e avaliações de terceiros. <Link to="/politica-de-cookies">Saiba mais</Link>.</p>
      </div>
      {details && <fieldset className="cookie-options"><legend>O que você deseja permitir?</legend>
        <label><input type="checkbox" checked disabled /> Necessários <small>Sempre ativos: preferências e autenticação.</small></label>
        <label><input type="checkbox" checked={statistics} onChange={e => setStatistics(e.target.checked)} /> Estatísticas <small>Contagem de visitas e interesse em produtos.</small></label>
        <label><input type="checkbox" checked={external} onChange={e => setExternal(e.target.checked)} /> Conteúdo externo <small>Avaliações do Google exibidas pelo Elfsight.</small></label>
      </fieldset>}
      <div className="cookie-actions">
        <button type="button" onClick={() => save({ statistics: false, external: false })}>Rejeitar opcionais</button>
        <button type="button" onClick={() => save({ statistics: true, external: true })}>Aceitar opcionais</button>
        {details ? <button type="button" onClick={() => save({ statistics, external })}>Salvar escolhas</button> : <button type="button" onClick={() => setDetails(true)}>Configurar</button>}
      </div>
    </section>
  )
}
