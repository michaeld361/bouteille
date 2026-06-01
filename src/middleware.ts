import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './lib/i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip studio, api, static files, and Next.js internals
  if (
    pathname.startsWith('/studio') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  // Check if the pathname already has a valid locale
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || ''
  const preferredLang = SUPPORTED_LANGUAGES.find((lang) =>
    acceptLanguage.toLowerCase().includes(lang)
  ) || DEFAULT_LANGUAGE

  // Redirect to the localized path
  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLang}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|studio|api).*)'],
}
