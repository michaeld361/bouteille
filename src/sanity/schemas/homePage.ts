import { defineType, defineField } from 'sanity'
import { Home } from 'lucide-react'

/** Singleton — configure in desk structure */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'wines', title: 'Wines Section' },
    { name: 'event', title: 'Featured Event' },
  ],
  fields: [
    defineField({
      name: 'heroImage', title: 'Hero Background Image', type: 'image', group: 'hero',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    }),
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', group: 'hero', initialValue: 'Bouteille' }),
    defineField({ name: 'winesSectionLabel', title: 'Wines Section Label', type: 'internationalizedArrayString', group: 'wines' }),
    defineField({ name: 'winesSectionTitle', title: 'Wines Section Title', type: 'internationalizedArrayString', group: 'wines' }),
    defineField({ name: 'winesCtaLabel', title: 'Wines CTA Label', type: 'internationalizedArrayString', group: 'wines' }),
    defineField({
      name: 'featuredWines', title: 'Featured Wines', type: 'array', group: 'wines',
      of: [{ type: 'reference', to: [{ type: 'wine' }] }],
      validation: (Rule) => Rule.max(3).unique(),
      description: 'Select up to 3 wines to showcase on the homepage',
    }),
    defineField({
      name: 'featuredEvent', title: 'Featured Event', type: 'reference', group: 'event',
      to: [{ type: 'event' }],
      description: 'The event displayed in the full-bleed cinematic section',
    }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
