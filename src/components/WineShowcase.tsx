import Link from 'next/link'
import { createTranslator, type Language } from '@/lib/i18n'

interface WineShowcaseProps {
  label: string
  title: string
  ctaLabel: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wines: any[]
  lang: Language
}

export default function WineShowcase({ label, title, ctaLabel, wines, lang }: WineShowcaseProps) {
  return (
    <section className="wines-section">
      <div className="wines-section__header">
        <span className="wines-section__label">{label}</span>
        <h2 className="wines-section__title">{title}</h2>
      </div>
      <div className="wines-section__list">
        {wines?.map((wine, i) => (
          <article key={wine._id || i} className="wine-showcase">
            <span className="wine-showcase__number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className="wine-showcase__content">
              <h3 className="wine-showcase__name">{wine.name} {wine.vintage}</h3>
              <span className="wine-showcase__producer">{wine.producer}</span>
              <span className="wine-showcase__meta t-mono">{wine.region} · {wine.country} · €{wine.price}</span>
            </div>
            <div className="wine-showcase__line" />
          </article>
        ))}
      </div>
      <Link href={`/${lang}/wines`} className="wines-section__cta" data-magnetic>{ctaLabel}</Link>
    </section>
  )
}
