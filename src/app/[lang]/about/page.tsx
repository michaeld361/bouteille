import { safeFetch } from "@/sanity/client"
import { PAGE_BY_SLUG_QUERY, TEAM_MEMBERS_QUERY } from '@/lib/queries'
import { validateLanguage, createTranslator, type Language } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: lang === 'fr' ? 'Notre Histoire' : lang === 'nl' ? 'Ons Verhaal' : 'Our Story',
    description: 'The story behind Bouteille — five friends, one conviction, and a neighbourhood wine bar with soul in Stockel, Brussels.',
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang: Language = validateLanguage(langParam)
  const t = createTranslator(lang)

  const [pageData, members] = await Promise.all([
    safeFetch<any>(PAGE_BY_SLUG_QUERY, { slug: 'about' }),
    safeFetch<any>(TEAM_MEMBERS_QUERY),
  ])

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title reveal" data-delay="0">
            {pageData ? t(pageData.title) : (lang === 'fr' ? 'Notre Histoire' : lang === 'nl' ? 'Ons Verhaal' : 'Our Story')}
          </h1>
          <p className="page-header__sub reveal" data-delay="1">
            {pageData ? t(pageData.subtitle) : (lang === 'fr' ? 'Cinq amis, une conviction.' : lang === 'nl' ? 'Vijf vrienden, één overtuiging.' : 'Five friends, one conviction: that a neighbourhood deserves a wine bar with soul.')}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container container--narrow">
          {pageData?.content?.map((block: any, i: number) => {
            if (block._type === 'proseBlock') {
              return (
                <div key={block._key} className="editorial__text reveal" data-delay={i + 2}>
                  <p>{t(block.text)}</p>
                </div>
              )
            }
            if (block._type === 'pullquoteBlock') {
              return (
                <blockquote key={block._key} className="editorial__quote reveal" data-delay={i + 2}>
                  <p>&ldquo;{t(block.quote)}&rdquo;</p>
                  {block.attribution && <cite>— {block.attribution}</cite>}
                </blockquote>
              )
            }
            if (block._type === 'teamGridBlock') {
              const teamMembers = block.members || members
              return (
                <div key={block._key} className="team reveal" data-delay={i + 2}>
                  <h2 className="section__label">
                    {lang === 'fr' ? "L'Équipe" : lang === 'nl' ? 'Het Team' : 'The Team'}
                  </h2>
                  <div className="team__grid">
                    {teamMembers?.map((member: any) => (
                      <div key={member._id} className="team-member">
                        <div className="team-member__photo" />
                        <h3 className="team-member__name">{member.name}</h3>
                        <span className="team-member__role">{t(member.role)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          })}

          {/* Fallback if no CMS data */}
          {!pageData && members?.length > 0 && (
            <div className="team reveal" data-delay="2">
              <h2 className="section__label">
                {lang === 'fr' ? "L'Équipe" : lang === 'nl' ? 'Het Team' : 'The Team'}
              </h2>
              <div className="team__grid">
                {members.map((member: any) => (
                  <div key={member._id} className="team-member">
                    <div className="team-member__photo" />
                    <h3 className="team-member__name">{member.name}</h3>
                    <span className="team-member__role">{t(member.role)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
