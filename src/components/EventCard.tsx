import { createTranslator, type Language } from '@/lib/i18n'

interface EventCardProps {
  event: any
  lang: Language
}

export default function EventCard({ event, lang }: EventCardProps) {
  const t = createTranslator(lang)

  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString(
        lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB',
        { weekday: 'long', day: 'numeric', month: 'long' }
      )
    : ''

  return (
    <article className="event-card">
      {event.tag && (
        <span className="event-card__tag t-mono">{t(event.tag)}</span>
      )}
      <h3 className="event-card__title">{t(event.title)}</h3>
      {dateStr && <span className="event-card__date t-mono">{dateStr}</span>}
      {event.description && (
        <p className="event-card__desc">{t(event.description)}</p>
      )}
      {event.ctaLink && (
        <a href={event.ctaLink} className="btn btn--sm" data-magnetic>
          {t(event.ctaLabel) || 'RSVP'}
        </a>
      )}
    </article>
  )
}
