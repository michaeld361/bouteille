import { safeFetch } from "@/sanity/client"
import { ALL_WINES_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'
import WineGrid from '@/components/WineGrid'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: lang === 'fr' ? 'Les Vins' : lang === 'nl' ? 'De Wijnen' : 'The Wines',
    description: 'A curated, ever-evolving wine selection at Bouteille. Conventional, natural, biodynamic — from across Europe.',
  }
}

export default async function WinesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [wines, settings] = await Promise.all([
    safeFetch<any>(ALL_WINES_QUERY),
    safeFetch<any>(SITE_SETTINGS_QUERY),
  ])

  // i18n labels for filters
  const filterLabels: Record<string, Record<string, string>> = {
    all: { en: 'All', fr: 'Tous', nl: 'Alle' },
    red: { en: 'Red', fr: 'Rouge', nl: 'Rood' },
    white: { en: 'White', fr: 'Blanc', nl: 'Wit' },
    rosé: { en: 'Rosé', fr: 'Rosé', nl: 'Rosé' },
    orange: { en: 'Orange', fr: 'Orange', nl: 'Oranje' },
    sparkling: { en: 'Sparkling', fr: 'Pétillant', nl: 'Bruisend' },
  }

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title reveal" data-delay="0">
            {lang === 'fr' ? 'Les Vins' : lang === 'nl' ? 'De Wijnen' : 'The Wines'}
          </h1>
          <p className="page-header__sub reveal" data-delay="1">
            {lang === 'fr'
              ? 'Une sélection évolutive et soignée.'
              : lang === 'nl'
                ? 'Een verzorgde, steeds evoluerende selectie.'
                : 'A curated, ever-evolving selection. Conventional, natural, biodynamic — from across Europe. Every bottle chosen with care, priced with honesty.'}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <WineGrid wines={wines} lang={lang} filterLabels={filterLabels} />
        </div>
      </section>
    </>
  )
}
