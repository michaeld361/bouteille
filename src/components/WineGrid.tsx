'use client'

import { useState } from 'react'
import { createTranslator, type Language } from '@/lib/i18n'

interface WineGridProps {
  wines: any[]
  lang: Language
  filterLabels: Record<string, Record<string, string>>
}

export default function WineGrid({ wines, lang, filterLabels }: WineGridProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const t = createTranslator(lang)

  const filteredWines = activeFilter === 'all'
    ? wines
    : wines?.filter((w: any) => w.type === activeFilter)

  const filters = ['all', 'red', 'white', 'rosé', 'orange', 'sparkling']

  return (
    <>
      <div className="wine-filters reveal" data-delay="2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`wine-filter ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filterLabels[filter]?.[lang] || filter}
          </button>
        ))}
      </div>

      <div className="wine-grid">
        {filteredWines?.map((wine: any) => (
          <article key={wine._id} className="wine-item">
            <div className="wine-item__type t-mono">{wine.type}</div>
            <h3 className="wine-item__name">
              {wine.name} {wine.vintage}
            </h3>
            <span className="wine-item__producer">{wine.producer}</span>
            <span className="wine-item__meta t-mono">
              {wine.region} · {wine.country}
            </span>
            {wine.tastingNote && (
              <p className="wine-item__note">{t(wine.tastingNote)}</p>
            )}
            <span className="wine-item__price">€{wine.price}</span>
          </article>
        ))}
      </div>
    </>
  )
}
