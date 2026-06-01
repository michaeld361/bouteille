import { safeFetch } from "@/sanity/client"
import { FEATURED_EVENTS_QUERY, RECURRING_EVENTS_QUERY, UPCOMING_EVENTS_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'
import EventCard from '@/components/EventCard'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: lang === 'fr' ? 'Soirées & Événements' : lang === 'nl' ? 'Avonden & Evenementen' : 'Evenings & Events',
    description: 'Tastings, winemaker dinners, and the odd Monday where you bring the bottle. See what\'s on at Bouteille wine bar.',
  }
}

export default async function EventsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [featured, recurring, upcoming] = await Promise.all([
    safeFetch<any>(FEATURED_EVENTS_QUERY),
    safeFetch<any>(RECURRING_EVENTS_QUERY),
    safeFetch<any>(UPCOMING_EVENTS_QUERY),
  ])

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title reveal" data-delay="0">
            {lang === 'fr' ? 'Soirées & Événements' : lang === 'nl' ? 'Avonden & Evenementen' : 'Evenings & Events'}
          </h1>
          <p className="page-header__sub reveal" data-delay="1">
            {lang === 'fr'
              ? 'Dégustations, dîners de vignerons.'
              : lang === 'nl'
                ? 'Proeverijen, wijnmakersdiners.'
                : 'Tastings, winemaker dinners, and the odd Monday where you bring the bottle.'}
          </p>
        </div>
      </header>

      {/* Featured Events */}
      {featured?.length > 0 && (
        <section className="section">
          <div className="container">
            {featured.map((event: any) => (
              <div key={event._id} className="event-feature reveal" data-delay="2">
                {event.image && (
                  <div className="event-feature__image-wrap">
                    <img src="/images/event.jpg" alt={t(event.title)} className="event-feature__image" />
                  </div>
                )}
                <div className="event-feature__content">
                  <span className="t-mono" style={{ opacity: 0.5 }}>
                    {event.date ? new Date(event.date).toLocaleDateString(lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
                  </span>
                  <h2 className="event-feature__title">{t(event.title)}</h2>
                  {event.subtitle && <p className="event-feature__sub">{t(event.subtitle)}</p>}
                  <p>{t(event.description)}</p>
                  <a href={event.ctaLink || '#'} className="btn" data-magnetic>
                    {t(event.ctaLabel) || 'RSVP'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recurring Events */}
      {recurring?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section__label reveal" data-delay="3">
              {lang === 'fr' ? 'Chaque Semaine' : lang === 'nl' ? 'Elke Week' : 'Every Week'}
            </h2>
            <div className="events-grid">
              {recurring.map((event: any) => (
                <EventCard key={event._id} event={event} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcoming?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section__label reveal" data-delay="4">
              {lang === 'fr' ? 'À Venir' : lang === 'nl' ? 'Binnenkort' : 'Coming Up'}
            </h2>
            <div className="events-grid">
              {upcoming.map((event: any) => (
                <EventCard key={event._id} event={event} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
