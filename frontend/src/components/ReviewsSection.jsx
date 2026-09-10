import { openCookieSettings, useConsent } from '../lib/consent'

const reviewsDocument = "<!doctype html>\n<html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Avaliações LM Bags &amp; Brindes</title><style>body{margin:8px;font-family:Arial,sans-serif}</style></head><body><div class=\"elfsight-app-799167cb-beb7-4af2-b0ec-c24c96898107\" data-elfsight-app-lazy></div><script src=\"https://elfsightcdn.com/platform.js\" async></script></body></html>\n"

export default function ReviewsSection() {
  const { external } = useConsent()
  return <section className="max-w-7xl mx-auto px-6 py-12" aria-labelledby="reviews-title">
    <h2 id="reviews-title" className="text-2xl font-semibold text-center text-slate-800 mb-6">Quem escolhe a LM conta sua experiência</h2>
    {external ? <iframe title="Avaliações de clientes no Google" srcDoc={reviewsDocument} loading="lazy"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer"
      className="w-full h-[440px] border-0" /> : <div className="text-center rounded-2xl bg-white border border-slate-200 p-8">
      <p className="text-slate-600 mb-4">As avaliações externas ficam desativadas até você permitir esse conteúdo.</p>
      <button type="button" onClick={openCookieSettings} className="underline text-sky-800 font-semibold">Configurar privacidade</button>
    </div>}
    <p className="text-center mt-5"><a href="https://www.google.com/maps/search/?api=1&query=LM+Bags+%26+Brindes+Salvador+BA" target="_blank" rel="noopener noreferrer" className="text-sky-800 underline">Ver avaliações diretamente no Google</a></p>
  </section>
}
