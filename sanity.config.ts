import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { schemaTypes } from './src/sanity/schemas'

const singletonTypes = new Set(['siteSettings', 'navigation', 'homePage'])

export default defineConfig({
  name: 'bouteille',
  title: 'Bouteille CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Navigation')
              .id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            // Content types
            S.documentTypeListItem('wine').title('Wines'),
            S.documentTypeListItem('menuCategory').title('Menu Categories'),
            S.documentTypeListItem('menuItem').title('Menu Items'),
            S.documentTypeListItem('event').title('Events'),
            S.documentTypeListItem('teamMember').title('Team'),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    internationalizedArray({
      languages: [
        { id: 'en', title: 'English' },
        { id: 'fr', title: 'French' },
        { id: 'nl', title: 'Dutch' },
      ],
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text'],
    }),
  ],

  schema: {
    types: schemaTypes,
    // Prevent singletons from being created via "New document" button
    templates: (prev) =>
      prev.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Prevent singletons from being duplicated/deleted
    actions: (prev, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return prev.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
      }
      return prev
    },
  },
})
