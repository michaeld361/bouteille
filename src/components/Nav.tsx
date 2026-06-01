'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createTranslator, type Language, SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '@/lib/i18n'

interface NavProps {
  settings: { brandName?: string }
  navigation: {
    links?: Array<{ label: Array<{ _key: string; value: string }>; href: string; showInDesktop: boolean; showInMobile: boolean }>
    ctaLabel?: Array<{ _key: string; value: string }>
    ctaHref?: string
  }
  lang: Language
}

export default function Nav({ settings, navigation, lang }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = createTranslator(lang)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    document.body.style.overflow = !menuOpen ? 'hidden' : ''
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const switchLang = (newLang: string) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    return segments.join('/')
  }

  return (
    <>
      <nav className="nav">
        <Link href={`/${lang}`} className="nav__logo">
          <Image src="/logo.png" alt={settings?.brandName || 'Bouteille'} className="nav__logo-img" width={120} height={120} priority />
        </Link>

        <div className="nav__links">
          {navigation?.links?.filter((link) => link.showInDesktop).map((link, i) => (
            <Link key={i} href={`/${lang}${link.href}`} className={`nav__link ${pathname === `/${lang}${link.href}` ? 'active' : ''}`}>
              {t(link.label)}
            </Link>
          ))}
        </div>

        <div className="nav__right">
          <div className="nav__lang">
            {SUPPORTED_LANGUAGES.map((l, i) => (
              <span key={l}>
                {i > 0 && <span className="nav__lang-sep" />}
                <Link href={switchLang(l)} className={`nav__lang-btn ${l === lang ? 'active' : ''}`}>
                  {LANGUAGE_LABELS[l]}
                </Link>
              </span>
            ))}
          </div>
          {navigation?.ctaHref && (
            <Link href={`/${lang}${navigation.ctaHref}`} className="nav__cta" data-magnetic>
              {t(navigation.ctaLabel)}
            </Link>
          )}
        </div>

        <button className={`nav__hamburger ${menuOpen ? 'open' : ''}`} aria-label="Menu" onClick={toggleMenu}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav__overlay ${menuOpen ? 'open' : ''}`}>
        {navigation?.links?.filter((link) => link.showInMobile).map((link, i) => (
          <Link key={i} href={`/${lang}${link.href}`} className="nav__overlay-link" onClick={closeMenu}>
            {t(link.label)}
          </Link>
        ))}
        {navigation?.ctaHref && (
          <Link href={`/${lang}${navigation.ctaHref}`} className="nav__overlay-link" onClick={closeMenu}>
            {t(navigation.ctaLabel)}
          </Link>
        )}
        <div className="nav__overlay-lang">
          {SUPPORTED_LANGUAGES.map((l) => (
            <Link key={l} href={switchLang(l)} className={`nav__overlay-lang-btn ${l === lang ? 'active' : ''}`} onClick={closeMenu}>
              {LANGUAGE_LABELS[l]}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
