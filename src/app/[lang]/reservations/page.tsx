import { safeFetch } from "@/sanity/client"
import { SITE_SETTINGS_QUERY, NAVIGATION_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'
import BookingForm from '@/components/BookingForm'

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
            <div className="reveal" data-delay="2">
              <BookingForm lang={lang} />
            </div>

            <aside className="reservation-sidebar reveal" data-delay="3">
              <p className="reservation-sidebar__walkins">
                {lang === 'fr'
                  ? 'Sans réservation, toujours les bienvenus. Pas de formalités — venez comme vous êtes.'
                  : lang === 'nl'
                    ? 'Walk-ins altijd welkom. Geen formaliteiten — kom zoals je bent.'
                    : 'Walk-ins always welcome. No formality needed — just come as you are.'}
              </p>
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
