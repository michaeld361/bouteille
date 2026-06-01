import { createTranslator, type Language } from '@/lib/i18n'

interface MenuSectionProps {
  category: any
  lang: Language
  delay: number
}

export default function MenuSection({ category, lang, delay }: MenuSectionProps) {
  const t = createTranslator(lang)

  return (
    <div className="menu-section reveal" data-delay={delay}>
      <h2 className="menu-section__title">{t(category.title)}</h2>

      {category.items?.map((item: any) => {
        if (item.featured) {
          return (
            <div key={item._id} className="menu-featured" style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ border: '1px solid rgba(26,26,24,0.15)', padding: '24px 32px', display: 'inline-block' }}>
                <span className="menu-item__name">{t(item.name)}</span>
                {item.description && (
                  <div className="menu-item__desc" style={{ marginTop: '4px' }}>{t(item.description)}</div>
                )}
                <span className="menu-item__price" style={{ display: 'block', marginTop: '8px' }}>€{item.price}</span>
              </div>
            </div>
          )
        }

        return (
          <div key={item._id} className="menu-item">
            <div>
              <div className="menu-item__name">{t(item.name)}</div>
              {item.description && <div className="menu-item__desc">{t(item.description)}</div>}
            </div>
            <span className="menu-item__price">€{item.price}</span>
          </div>
        )
      })}
    </div>
  )
}
