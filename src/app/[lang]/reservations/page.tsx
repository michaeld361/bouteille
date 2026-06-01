import { safeFetch } from "@/sanity/client"
import { SITE_SETTINGS_QUERY, NAVIGATION_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: lang === 'fr' ? 'Réserver' : lang === 'nl' ? 'Reserveren' : 'Reserve a Table',
    description: 'Reserve a table at Bouteille, a neighbourhood wine bar in Stockel, Brussels. Walk-ins always welcome.',
  }
}

export default async function ReservationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [settings, navigation] = await Promise.all([
    safeFetch<any>(SITE_SETTINGS_QUERY),
    safeFetch<any>(NAVIGATION_QUERY),
  ])

  const labels = {
    name: { en: 'Name', fr: 'Nom', nl: 'Naam' },
    email: { en: 'Email', fr: 'Email', nl: 'E-mail' },
    date: { en: 'Date', fr: 'Date', nl: 'Datum' },
    time: { en: 'Time', fr: 'Heure', nl: 'Tijd' },
    guests: { en: 'Guests', fr: 'Convives', nl: 'Gasten' },
    notes: { en: 'Special requests', fr: 'Demandes spéciales', nl: 'Bijzondere wensen' },
    book: { en: 'Book Table', fr: 'Réserver', nl: 'Reserveren' },
    walkIns: { en: 'Walk-ins always welcome. No formality needed — just come as you are.', fr: 'Sans réservation, toujours les bienvenus.', nl: 'Walk-ins altijd welkom.' },
  }

  const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title reveal" data-delay="0">
            {lang === 'fr' ? 'Réserver' : lang === 'nl' ? 'Reserveren' : 'Reserve a Table'}
          </h1>
          <p className="page-header__sub reveal" data-delay="1">
            {lang === 'fr'
              ? 'Les sans-réservation sont toujours les bienvenus.'
              : lang === 'nl'
                ? 'Walk-ins zijn altijd welkom.'
                : "Walk-ins are always welcome. But if you'd like to be sure, let us know you're coming."}
          </p>
        </div>
      </header>

      <section className="section section--parchment">
        <div className="container">
          <div className="reservation-grid">
            <form className="reservation-form reveal" data-delay="2">
              <div className="form-row">
                <label className="form-field">
                  <span className="form-field__label">{labels.name[lang]}</span>
                  <input type="text" name="name" required className="form-field__input" />
                </label>
                <label className="form-field">
                  <span className="form-field__label">{labels.email[lang]}</span>
                  <input type="email" name="email" required className="form-field__input" />
                </label>
              </div>
              <div className="form-row">
                <label className="form-field">
                  <span className="form-field__label">{labels.date[lang]}</span>
                  <input type="date" name="date" required className="form-field__input" />
                </label>
                <label className="form-field">
                  <span className="form-field__label">{labels.time[lang]}</span>
                  <select name="time" required className="form-field__input">
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="form-field">
                <span className="form-field__label">{labels.guests[lang]}</span>
                <select name="guests" required className="form-field__input">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span className="form-field__label">{labels.notes[lang]}</span>
                <textarea name="notes" rows={3} className="form-field__input" />
              </label>
              <button type="submit" className="btn" data-magnetic>{labels.book[lang]}</button>
            </form>

            <aside className="reservation-sidebar reveal" data-delay="3">
              <p className="reservation-sidebar__walkins">{labels.walkIns[lang]}</p>
              <div className="detail-block">
                <span className="detail-block__label">{t(navigation?.findUsLabel) || 'Find us'}</span>
                <span className="detail-block__value">
                  {settings?.address?.street || 'Rue Henrotte 40'}<br />
                  {settings?.address?.postalCode || '1150'} {settings?.address?.city || 'Woluwe-Saint-Pierre'}
                </span>
              </div>
              <div className="detail-block">
                <span className="detail-block__label">{t(navigation?.touchLabel) || 'Get in touch'}</span>
                <a href={`mailto:${settings?.email || 'hello@bouteillebaravin.be'}`} className="detail-block__value">
                  {settings?.email || 'hello@bouteillebaravin.be'}
                </a>
              </div>
              <div className="detail-block">
                <span className="detail-block__label">{t(navigation?.hoursLabel) || 'Hours'}</span>
                <span className="detail-block__value">
                  {t(settings?.openingHours) || (lang === 'fr' ? "Horaires d'ouverture à venir" : 'Opening hours coming soon')}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
