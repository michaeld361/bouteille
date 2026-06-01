'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { createTranslator, type Language } from '@/lib/i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EventFull({ event, lang }: { event: any; lang: Language }) {
  const t = createTranslator(lang)

  useEffect(() => {
    async function animate() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const img = document.querySelector('.event-full__image')
      if (img) {
        gsap.fromTo(img, { y: '-15%' }, { y: '15%', ease: 'none', scrollTrigger: { trigger: '.event-full', start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      const content = document.querySelector('.event-full__content')
      if (content) {
        gsap.from(content.querySelectorAll('.event-full__date, .event-full__sub, .event-full__desc, .btn'), {
          scrollTrigger: { trigger: content, start: 'top bottom', once: true },
          y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        })
      }
    }
    animate()
  }, [])

  if (!event) return null

  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString(lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

  return (
    <section className="event-full">
      <div className="event-full__image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/event.jpg" alt={t(event.title) || 'Event at Bouteille'} className="event-full__image" />
      </div>
      <div className="event-full__content">
        <span className="event-full__date t-mono">{dateStr}</span>
        <h2 className="event-full__title">{t(event.title)}</h2>
        <p className="event-full__sub">{t(event.subtitle)}</p>
        <p className="event-full__desc">{t(event.description)}</p>
        <Link href={event.ctaLink || `/${lang}/events`} className="btn" data-magnetic>
          {t(event.ctaLabel) || 'RSVP'}
        </Link>
      </div>
    </section>
  )
}
