import { safeFetch } from "@/sanity/client"
import { SITE_SETTINGS_QUERY, NAVIGATION_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return { title: 'Contact', description: 'Get in touch with Bouteille, a neighbourhood wine bar in Stockel, Brussels.' }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [settings, navigation] = await Promise.all([
    safeFetch<any>(SITE_SETTINGS_QUERY),
    safeFetch<any>(NAVIGATION_QUERY),
  ])

  const formLabels = {
    name: { en: 'Name', fr: 'Nom', nl: 'Naam' },
    email: { en: 'Email', fr: 'Email', nl: 'E-mail' },
    message: { en: 'Message', fr: 'Message', nl: 'Bericht' },
    send: { en: 'Send', fr: 'Envoyer', nl: 'Verzenden' },
  }

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title reveal" data-delay="0">Contact</h1>
          <p className="page-header__sub reveal" data-delay="1">
            {lang === 'fr' ? 'Nous serions ravis de vous entendre.' : lang === 'nl' ? 'We horen graag van u.' : "We'd love to hear from you."}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-grid__map reveal" data-delay="2">
              <iframe
                src={settings?.googleMapsEmbedUrl || "https://www.google.com/maps?q=Rue+Henrotte+40,+1150+Woluwe-Saint-Pierre,+Brussels&output=embed"}
                width="100%" height="400"
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bouteille location"
              />
            </div>

            <div className="contact-grid__details reveal" data-delay="3">
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
              <div className="detail-block">
                <span className="detail-block__label">{t(navigation?.followLabel) || 'Follow along'}</span>
                <a href={settings?.instagramUrl || 'https://www.instagram.com/bouteille.bar'} target="_blank" rel="noopener" className="detail-block__value">
                  {settings?.instagramHandle || '@bouteille.bar'}
                </a>
              </div>
            </div>

            <form className="contact-form reveal" data-delay="4">
              <label className="form-field">
                <span className="form-field__label">{formLabels.name[lang]}</span>
                <input type="text" name="name" required className="form-field__input" />
              </label>
              <label className="form-field">
                <span className="form-field__label">{formLabels.email[lang]}</span>
                <input type="email" name="email" required className="form-field__input" />
              </label>
              <label className="form-field">
                <span className="form-field__label">{formLabels.message[lang]}</span>
                <textarea name="message" rows={5} required className="form-field__input" />
              </label>
              <button type="submit" className="btn" data-magnetic>{formLabels.send[lang]}</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
