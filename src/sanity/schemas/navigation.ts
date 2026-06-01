import { defineType, defineField } from 'sanity'
import { Menu } from 'lucide-react'

/** Singleton — configure in desk structure */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: Menu,
  fields: [
    defineField({
      name: 'links', title: 'Navigation Links', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'internationalizedArrayString' }),
          defineField({ name: 'href', title: 'URL Path', type: 'string', description: 'e.g. /wines' }),
          defineField({ name: 'showInDesktop', title: 'Show in Desktop Nav', type: 'boolean', initialValue: true }),
          defineField({ name: 'showInMobile', title: 'Show in Mobile Nav', type: 'boolean', initialValue: true }),
        ],
        preview: {
          select: { title: 'href' },
          prepare({ title }) { return { title: title || 'Link' } },
        },
      }],
    }),
    defineField({ name: 'ctaLabel', title: 'CTA Button Label', type: 'internationalizedArrayString' }),
    defineField({ name: 'ctaHref', title: 'CTA Button Link', type: 'string' }),
    defineField({ name: 'followLabel', title: '"Follow" Label', type: 'internationalizedArrayString' }),
    defineField({ name: 'findUsLabel', title: '"Find Us" Label', type: 'internationalizedArrayString' }),
    defineField({ name: 'touchLabel', title: '"Get in Touch" Label', type: 'internationalizedArrayString' }),
    defineField({ name: 'hoursLabel', title: '"Hours" Label', type: 'internationalizedArrayString' }),
    defineField({ name: 'getDirectionsLabel', title: '"Get Directions" Label', type: 'internationalizedArrayString' }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
