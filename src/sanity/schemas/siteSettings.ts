import { defineType, defineField } from 'sanity'
import { Settings } from 'lucide-react'

/** Singleton — configure in desk structure */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact & Social' },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'brandName', title: 'Brand Name', type: 'string', group: 'brand', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'internationalizedArrayString', group: 'brand' }),
    defineField({ name: 'essence', title: 'Essence Statement', type: 'internationalizedArrayString', group: 'brand', description: 'The main scroll-reveal statement on the homepage' }),
    defineField({
      name: 'address', title: 'Address', type: 'object', group: 'contact',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Postal Code', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'country', title: 'Country', type: 'string' }),
      ],
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (Rule) => Rule.email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({ name: 'instagramHandle', title: 'Instagram Handle', type: 'string', group: 'contact', description: 'e.g. @bouteille.bar' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url', group: 'contact' }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps Directions URL', type: 'url', group: 'contact' }),
    defineField({ name: 'googleMapsEmbedUrl', title: 'Google Maps Embed URL', type: 'url', group: 'contact', description: 'URL for the embedded map iframe' }),
    defineField({ name: 'openingHours', title: 'Opening Hours', type: 'internationalizedArrayString', group: 'contact' }),
    defineField({ 
      name: 'marqueeItems', 
      title: 'Marquee Ticker Items', 
      type: 'array', 
      group: 'content', 
      of: [
        { 
          type: 'object',
          name: 'marqueeItem',
          fields: [{ name: 'text', type: 'internationalizedArrayString' }] 
        }
      ], 
      description: 'Phrases that scroll across the ticker' 
    }),
    defineField({ name: 'copyright', title: 'Copyright Text', type: 'string', group: 'content' }),
    defineField({ name: 'allergenNotice', title: 'Allergen Notice', type: 'internationalizedArrayText', group: 'content' }),
    defineField({
      name: 'seo', title: 'Default SEO', type: 'object', group: 'seo',
      fields: [
        defineField({ name: 'title', title: 'Default Title', type: 'string' }),
        defineField({ name: 'description', title: 'Default Description', type: 'text', rows: 3 }),
        defineField({ name: 'ogImage', title: 'Default OG Image', type: 'image' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
