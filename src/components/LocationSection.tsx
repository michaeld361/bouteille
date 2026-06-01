import { createTranslator, type Language } from '@/lib/i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LocationSection({ settings, navigation, lang }: { settings: any; navigation: any; lang: Language }) {
  const t = createTranslator(lang)

  return (
    <section className="location">
      <div className="location__map">
        <iframe
          src={settings?.googleMapsEmbedUrl || 'https://www.google.com/maps?q=Rue+Henrotte+40,+1150+Woluwe-Saint-Pierre,+Brussels&output=embed'}
          width="100%" height="100%" allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade" title="Bouteille location"
        />
      </div>
      <div className="location__details">
        <div className="location__number" aria-hidden="true">40</div>
        <div className="location__info">
          <div className="detail-block">
            <span className="detail-block__label">{t(navigation?.findUsLabel) || 'Find us'}</span>
            <span className="detail-block__value">
              {settings?.address?.street || 'Rue Henrotte 40'}<br />
              {settings?.address?.postalCode || '1150'} {settings?.address?.city || 'Woluwe-Saint-Pierre'}<br />
              {settings?.address?.country || 'Brussels'}
            </span>
            {settings?.googleMapsUrl && (
              <a href={settings.googleMapsUrl} target="_blank" rel="noopener" className="btn" style={{ marginTop: '8px', alignSelf: 'flex-start' }} data-magnetic>
                {t(navigation?.getDirectionsLabel) || 'Get directions'}
              </a>
            )}
          </div>
          <div className="detail-block">
            <span className="detail-block__label">{t(navigation?.touchLabel) || 'Get in touch'}</span>
            <a href={`mailto:${settings?.email || 'hello@bouteillebaravin.be'}`} className="detail-block__value">
              {settings?.email || 'hello@bouteillebaravin.be'}
            </a>
          </div>
          <div className="detail-block">
            <span className="detail-block__label">{t(navigation?.hoursLabel) || 'Hours'}</span>
            <span className="detail-block__value">{t(settings?.openingHours) || 'Opening hours coming soon'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
