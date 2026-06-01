import { defineType, defineField } from 'sanity'
import { Wine } from 'lucide-react'

export const wine = defineType({
  name: 'wine',
  title: 'Wine',
  type: 'document',
  icon: Wine,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'vintage', title: 'Vintage', type: 'string' }),
    defineField({ name: 'producer', title: 'Producer', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'region', title: 'Region', type: 'string' }),
    defineField({
      name: 'country', title: 'Country', type: 'string',
      options: {
        list: [
          { title: '🇫🇷 France', value: 'FR' },
          { title: '🇦🇹 Austria', value: 'AT' },
          { title: '🇪🇸 Spain', value: 'ES' },
          { title: '🇮🇹 Italy', value: 'IT' },
          { title: '🇱🇧 Lebanon', value: 'LB' },
          { title: '🇩🇪 Germany', value: 'DE' },
          { title: '🇵🇹 Portugal', value: 'PT' },
          { title: '🇬🇷 Greece', value: 'GR' },
          { title: '🇧🇪 Belgium', value: 'BE' },
        ],
      },
    }),
    defineField({
      name: 'type', title: 'Type', type: 'string', validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Red', value: 'red' },
          { title: 'White', value: 'white' },
          { title: 'Rosé', value: 'rosé' },
          { title: 'Orange', value: 'orange' },
          { title: 'Sparkling', value: 'sparkling' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'price', title: 'Price (€)', type: 'number', validation: (Rule) => Rule.required().positive() }),
    defineField({ name: 'tastingNote', title: 'Tasting Note', type: 'internationalizedArrayText', description: 'Translatable tasting description' }),
    defineField({
      name: 'image', title: 'Image', type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'For homepage showcase ordering' }),
  ],
  orderings: [
    { title: 'By Type', name: 'typeAsc', by: [{ field: 'type', direction: 'asc' }] },
    { title: 'By Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'By Price (Low)', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
    { title: 'By Price (High)', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'producer', price: 'price', media: 'image' },
    prepare({ title, subtitle, price, media }) {
      return { title, subtitle: `${subtitle || ''} · €${price || ''}`, media }
    },
  },
})
