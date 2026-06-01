import { defineType, defineField } from 'sanity'
import { UtensilsCrossed } from 'lucide-react'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  icon: UtensilsCrossed,
  fields: [
    defineField({ name: 'title', title: 'Category Title', type: 'internationalizedArrayString', validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'items', title: 'Menu Items', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'menuItem' }] }],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  orderings: [
    { title: 'By Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      const label = title?.find((t: { _key: string; value: string }) => t._key === 'en')?.value || title?.find((t: { _key: string; value: string }) => t._key === 'fr')?.value || title?.[0]?.value || 'Untitled'
      return { title: label }
    },
  },
})
