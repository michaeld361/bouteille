import { safeFetch } from "@/sanity/client"
import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY, NAVIGATION_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Essence from '@/components/Essence'
import WineShowcase from '@/components/WineShowcase'
import EventFull from '@/components/EventFull'
import LocationSection from '@/components/LocationSection'
import SocialCTA from '@/components/SocialCTA'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [homePage, settings, navigation] = await Promise.all([
    safeFetch<any>(HOME_PAGE_QUERY),
    safeFetch<any>(SITE_SETTINGS_QUERY),
    safeFetch<any>(NAVIGATION_QUERY),
  ])

  return (
    <>
      <Hero
        heroImage={homePage?.heroImage}
        heroTitle={homePage?.heroTitle || 'Bouteille'}
        tagline={t(settings?.tagline)}
        lang={lang}
      />

      <Marquee items={settings?.marqueeItems} lang={lang} />

      <Essence text={t(settings?.essence) || 'European wines. Seasonal food. The art of sharing.'} />

      {homePage?.featuredWines && homePage.featuredWines.length > 0 && (
        <WineShowcase
          label={t(homePage.winesSectionLabel) || 'The Wines'}
          title={t(homePage.winesSectionTitle) || 'Selection'}
          ctaLabel={t(homePage.winesCtaLabel) || 'Discover the selection'}
          wines={homePage.featuredWines}
          lang={lang}
        />
      )}

      {homePage?.featuredEvent && (
        <EventFull event={homePage.featuredEvent} lang={lang} />
      )}

      <LocationSection settings={settings} navigation={navigation} lang={lang} />

      <SocialCTA settings={settings} navigation={navigation} lang={lang} />
    </>
  )
}
