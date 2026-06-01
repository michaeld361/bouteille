import { defineType, defineField } from 'sanity'
import { User } from 'lucide-react'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: User,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'internationalizedArrayString' }),
    defineField({
      name: 'photo', title: 'Photo', type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  orderings: [
    { title: 'By Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'By Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', role: 'role', media: 'photo' },
    prepare({ title, role, media }) {
      const roleLabel = role?.find((r: { _key: string; value: string }) => r._key === 'en')?.value || role?.[0]?.value || ''
      return { title, subtitle: roleLabel, media }
    },
  },
})
