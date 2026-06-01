/* ══════════════════════════════════════════════════════════
   i18n — Language helpers for Bouteille
   ══════════════════════════════════════════════════════════ */

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'nl'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: Language = 'en'

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'EN',
  fr: 'FR',
  nl: 'NL',
}

/**
 * Validates and returns a supported language code, falling back to default
 */
export function validateLanguage(lang: string | undefined): Language {
  if (lang && SUPPORTED_LANGUAGES.includes(lang as Language)) {
    return lang as Language
  }
  return DEFAULT_LANGUAGE
}

/**
 * Extracts a translated value from a Sanity internationalized array field.
 * Falls back: requested lang → 'en' → first available → empty string
 */
export function getLocalizedValue(
  field: Array<{ _key: string; value: string }> | undefined | null,
  lang: Language
): string {
  if (!field || !Array.isArray(field) || field.length === 0) return ''

  // Try exact match
  const exact = field.find((item) => item._key === lang)
  if (exact?.value) return exact.value

  // Fallback to English
  const en = field.find((item) => item._key === 'en')
  if (en?.value) return en.value

  // Fallback to first available
  return field[0]?.value || ''
}

/**
 * Shorthand for components — creates a t() function bound to a language
 */
export function createTranslator(lang: Language) {
  return function t(
    field: Array<{ _key: string; value: string }> | undefined | null
  ): string {
    return getLocalizedValue(field, lang)
  }
}
