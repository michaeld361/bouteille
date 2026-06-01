import { createTranslator, type Language } from '@/lib/i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SocialCTA({ settings, navigation, lang }: { settings: any; navigation: any; lang: Language }) {
  const t = createTranslator(lang)

  return (
    <section className="social-cta">
      <a href={settings?.instagramUrl || 'https://www.instagram.com/bouteille.bar'} target="_blank" rel="noopener" className="social-cta__link">
        <span className="social-cta__label">{t(navigation?.followLabel) || 'Follow along'}</span>
        <span className="social-cta__handle">{settings?.instagramHandle || '@bouteille.bar'}</span>
      </a>
    </section>
  )
}
