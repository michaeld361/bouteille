import { createClient } from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-05-31',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function check() {
  const docs = await client.fetch(`*[_type == "wine"]{_id, name, producer}`)
  console.log(`Total wines: ${docs.length}`)
  const names = docs.map(d => `${d.name} (${d.producer})`)
  const dupes = names.filter((e, i, a) => a.indexOf(e) !== i)
  console.log('Duplicates:', [...new Set(dupes)])
}

check().catch(console.error)
