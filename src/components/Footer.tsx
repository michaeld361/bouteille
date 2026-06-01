import Link from 'next/link'
import Image from 'next/image'
import { createTranslator, type Language } from '@/lib/i18n'

interface FooterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any
  lang: Language
}

export default function Footer({ settings, navigation, lang }: FooterProps) {
  const t = createTranslator(lang)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Image src="/logo.png" alt={settings?.brandName || 'Bouteille'} className="footer__logo-img" width={96} height={96} />
            <p className="footer__tagline">{t(settings?.tagline)}</p>
          </div>

          <div>
            <h4 className="footer__col-title">{navigation?.links?.[0] ? t(navigation.links[0].label) : 'Wines'}</h4>
            {navigation?.links?.slice(0, 2).map((link: { label: Array<{ _key: string; value: string }>; href: string }, i: number) => (
              <Link key={i} href={`/${lang}${link.href}`} className="footer__link">{t(link.label)}</Link>
            ))}
          </div>

          <div>
            <h4 className="footer__col-title">{navigation?.links?.[2] ? t(navigation.links[2].label) : 'Events'}</h4>
            {navigation?.links?.slice(2, 4).map((link: { label: Array<{ _key: string; value: string }>; href: string }, i: number) => (
              <Link key={i} href={`/${lang}${link.href}`} className="footer__link">{t(link.label)}</Link>
            ))}
            {navigation?.ctaHref && (
              <Link href={`/${lang}${navigation.ctaHref}`} className="footer__link">{t(navigation.ctaLabel)}</Link>
            )}
          </div>

          <div>
            <h4 className="footer__col-title">{t(navigation?.findUsLabel)}</h4>
            {settings?.address && (
              <>
                <span className="footer__link">{settings.address.street}</span>
                <span className="footer__link">{settings.address.postalCode} {settings.address.city}</span>
              </>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="footer__link">{settings.email}</a>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">{settings?.copyright || '© 2026 Bouteille'}</span>
          <div className="footer__social">
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener">Instagram</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
