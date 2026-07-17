'use client'

import { createTranslator, type Language } from '@/lib/i18n'

interface MarqueeProps {
  items?: Array<{ text: Array<{ _key: string; value: string }> }>
  lang: Language
}

export default function Marquee({ items, lang }: MarqueeProps) {
  const t = createTranslator(lang)
  const displayItems = items && items.length > 0
    ? items.map((item) => t(item.text))
    : ['European wines', 'Seasonal food', 'The art of sharing', 'Stockel, Brussels']
  const allItems = [...displayItems, ...displayItems]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {allItems.map((text, i) => (
          <span key={i}>
            <span className="marquee__item">{text}</span>
            <span className="marquee__dot">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
