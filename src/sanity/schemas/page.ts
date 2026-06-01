import { defineType, defineField, defineArrayMember } from 'sanity'
import { FileText } from 'lucide-react'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: FileText,
  fields: [
    defineField({ name: 'internalTitle', title: 'Internal Title', type: 'string', description: 'For studio reference only', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'internalTitle' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'title', title: 'Page Title', type: 'internationalizedArrayString', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'internationalizedArrayString' }),
    defineField({
      name: 'seo', title: 'SEO', type: 'object',
      fields: [
        defineField({ name: 'title', title: 'SEO Title', type: 'string' }),
        defineField({ name: 'description', title: 'SEO Description', type: 'text', rows: 3 }),
        defineField({ name: 'ogImage', title: 'OG Image', type: 'image' }),
      ],
    }),
    defineField({
      name: 'content', title: 'Content Blocks', type: 'array',
      of: [
        defineArrayMember({
          type: 'object', name: 'proseBlock', title: 'Prose',
          fields: [
            defineField({ name: 'text', title: 'Text', type: 'internationalizedArrayText' }),
          ],
          preview: {
            select: { text: 'text' },
            prepare({ text }) {
              const val = text?.find((t: { _key: string; value: string }) => t._key === 'en')?.value || text?.[0]?.value || ''
              return { title: 'Prose', subtitle: val.substring(0, 80) + '...' }
            },
          },
        }),
        defineArrayMember({
          type: 'object', name: 'pullquoteBlock', title: 'Pullquote',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'internationalizedArrayText' }),
            defineField({ name: 'attribution', title: 'Attribution', type: 'string' }),
          ],
          preview: {
            select: { attribution: 'attribution' },
            prepare({ attribution }) { return { title: 'Pullquote', subtitle: attribution || '' } },
          },
        }),
        defineArrayMember({
          type: 'object', name: 'imageBlock', title: 'Image',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }),
            defineField({ name: 'caption', title: 'Caption', type: 'internationalizedArrayString' }),
          ],
          preview: {
            select: { media: 'image' },
            prepare({ media }) { return { title: 'Image', media } },
          },
        }),
        defineArrayMember({
          type: 'object', name: 'teamGridBlock', title: 'Team Grid',
          fields: [
            defineField({
              name: 'members', title: 'Team Members', type: 'array',
              of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
              validation: (Rule) => Rule.unique(),
            }),
          ],
          preview: { prepare: () => ({ title: 'Team Grid' }) },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'internalTitle', slug: 'slug.current' },
    prepare({ title, slug }) { return { title, subtitle: `/${slug || ''}` } },
  },
})
