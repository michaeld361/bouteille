import { safeFetch } from "@/sanity/client"
import { MENU_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'
import MenuSection from '@/components/MenuSection'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: lang === 'fr' ? 'La Carte' : lang === 'nl' ? 'Het Menu' : 'The Menu',
    description: 'Seasonal, simple, made to share. The food menu at Bouteille wine bar in Stockel, Brussels.',
  }
}

export default async function MenuPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [categories, settings] = await Promise.all([
    safeFetch<any>(MENU_QUERY),
    safeFetch<any>(SITE_SETTINGS_QUERY),
  ])

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title reveal" data-delay="0">
            {lang === 'fr' ? 'La Carte' : lang === 'nl' ? 'Het Menu' : 'The Menu'}
          </h1>
          <p className="page-header__sub reveal" data-delay="1">
            {lang === 'fr'
              ? 'De saison, simple, à partager.'
              : lang === 'nl'
                ? 'Seizoensgebonden, eenvoudig, om te delen.'
                : 'Seasonal, simple, made to share. A menu built around what\'s good right now.'}
          </p>
        </div>
      </header>

      <section className="section section--parchment">
        <div className="container container--narrow">
          {categories?.map((category: any, i: number) => (
            <MenuSection key={category._id} category={category} lang={lang} delay={i + 2} />
          ))}

          {/* Allergen Notice */}
          <div className="reveal" data-delay={categories?.length + 2 || 7} style={{ textAlign: 'center', padding: '48px 0 0', opacity: 0.5 }}>
            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '12px', color: 'var(--cork)', lineHeight: 1.8 }}>
              {t(settings?.allergenNotice) || 'Désirez-vous des renseignements sur la présence des allergènes dans nos produits ? Nous attirons votre attention sur le fait que la composition des produits peut varier.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
