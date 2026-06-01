import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const isConfigured = projectId && projectId !== 'placeholder'

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-01',
  useCdn: process.env.NODE_ENV === 'production',
})

/**
 * Safe fetch that returns null if Sanity isn't configured yet.
 * This allows the build to pass before a Sanity project is created.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeFetch<T = any>(query: string, params?: Record<string, string>): Promise<T | null> {
  if (!isConfigured) return null
  try {
    return await client.fetch<T>(query, params as any)
  } catch (error) {
    console.warn('[Sanity] Fetch error:', error)
    return null
  }
}
