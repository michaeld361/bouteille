import { defineType, defineField } from 'sanity'
import { CalendarDays } from 'lucide-react'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarDays,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'internationalizedArrayString', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'internationalizedArrayString' }),
    defineField({
      name: 'eventType', title: 'Event Type', type: 'string', validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Featured', value: 'featured' },
          { title: 'Recurring', value: 'recurring' },
          { title: 'Upcoming', value: 'upcoming' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'time', title: 'Time', type: 'string', description: 'e.g. 19:00' }),
    defineField({
      name: 'recurringDay', title: 'Recurring Day', type: 'string',
      options: {
        list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      hidden: ({ parent }) => parent?.eventType !== 'recurring',
    }),
    defineField({ name: 'description', title: 'Description', type: 'internationalizedArrayText' }),
    defineField({
      name: 'image', title: 'Image', type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    }),
    defineField({ name: 'tag', title: 'Tag', type: 'internationalizedArrayString', description: 'e.g. "Every Monday", "Coming Up"' }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'internationalizedArrayString' }),
    defineField({ name: 'ctaLink', title: 'CTA Link', type: 'url' }),
  ],
  orderings: [
    { title: 'By Date', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
    { title: 'By Type', name: 'typeAsc', by: [{ field: 'eventType', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', eventType: 'eventType', date: 'date', media: 'image' },
    prepare({ title, eventType, date, media }) {
      const label = title?.find((t: { _key: string; value: string }) => t._key === 'en')?.value || title?.[0]?.value || 'Untitled'
      return { title: label, subtitle: `${eventType || ''} · ${date || ''}`, media }
    },
  },
})
