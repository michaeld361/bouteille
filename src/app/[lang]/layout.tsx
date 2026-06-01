import { safeFetch } from "@/sanity/client"
import { SITE_SETTINGS_QUERY, NAVIGATION_QUERY } from '@/lib/queries'
import { validateLanguage, type Language } from '@/lib/i18n'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GrainCanvas from '@/components/GrainCanvas'
import AnimationProvider from '@/components/AnimationProvider'

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)

  // Fetch shared data for nav and footer
  const [settings, navigation] = await Promise.all([
    safeFetch<any>(SITE_SETTINGS_QUERY),
    safeFetch<any>(NAVIGATION_QUERY),
  ])

  return (
    <>
      <GrainCanvas />
      <Nav settings={settings} navigation={navigation} lang={lang} />
      <AnimationProvider>
        <main>{children}</main>
      </AnimationProvider>
      <Footer settings={settings} navigation={navigation} lang={lang} />
    </>
  )
}
