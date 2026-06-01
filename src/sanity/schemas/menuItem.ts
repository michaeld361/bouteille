import { defineType, defineField } from 'sanity'
import { Utensils } from 'lucide-react'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  icon: Utensils,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'internationalizedArrayString', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'internationalizedArrayString' }),
    defineField({ name: 'price', title: 'Price (€)', type: 'number', validation: (Rule) => Rule.required().positive() }),
    defineField({ name: 'featured', title: 'Featured / Highlighted', type: 'boolean', initialValue: false, description: 'Display with special boxed treatment' }),
  ],
  orderings: [
    { title: 'By Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'By Price', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', price: 'price' },
    prepare({ title, price }) {
      const label = title?.find((t: { _key: string; value: string }) => t._key === 'fr')?.value || title?.find((t: { _key: string; value: string }) => t._key === 'en')?.value || title?.[0]?.value || 'Untitled'
      return { title: label, subtitle: `€${price || ''}` }
    },
  },
})
