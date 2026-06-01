/* ══════════════════════════════════════════════════════════
   GROQ Queries — All Sanity data fetching
   ══════════════════════════════════════════════════════════ */

// ── Site Settings ──
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  brandName,
  tagline,
  essence,
  address,
  email,
  phone,
  instagramHandle,
  instagramUrl,
  googleMapsUrl,
  googleMapsEmbedUrl,
  openingHours,
  marqueeItems,
  copyright,
  allergenNotice,
  seo
}`

// ── Navigation ──
export const NAVIGATION_QUERY = `*[_type == "navigation"][0] {
  links[] {
    label,
    href,
    showInDesktop,
    showInMobile
  },
  ctaLabel,
  ctaHref,
  followLabel,
  findUsLabel,
  touchLabel,
  hoursLabel,
  getDirectionsLabel
}`

// ── Home Page ──
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  heroImage {
    ...,
    alt
  },
  heroTitle,
  winesSectionLabel,
  winesSectionTitle,
  winesCtaLabel,
  featuredWines[]-> {
    _id,
    name,
    vintage,
    producer,
    region,
    country,
    type,
    price,
    tastingNote,
    image
  },
  featuredEvent-> {
    _id,
    title,
    subtitle,
    date,
    time,
    description,
    image,
    eventType,
    ctaLabel,
    ctaLink
  }
}`

// ── All Wines ──
export const ALL_WINES_QUERY = `*[_type == "wine"] | order(type asc, name asc) {
  _id,
  name,
  vintage,
  producer,
  region,
  country,
  type,
  price,
  tastingNote,
  image
}`

// ── Menu Categories with Items ──
export const MENU_QUERY = `*[_type == "menuCategory"] | order(order asc) {
  _id,
  title,
  order,
  "items": items[]-> {
    _id,
    name,
    description,
    price,
    featured
  }
}`

// ── Events by Type ──
export const ALL_EVENTS_QUERY = `*[_type == "event"] | order(date asc) {
  _id,
  title,
  subtitle,
  date,
  time,
  description,
  image,
  eventType,
  recurringDay,
  tag,
  ctaLabel,
  ctaLink
}`

export const FEATURED_EVENTS_QUERY = `*[_type == "event" && eventType == "featured"] | order(date asc) {
  _id, title, subtitle, date, time, description, image, ctaLabel, ctaLink
}`

export const RECURRING_EVENTS_QUERY = `*[_type == "event" && eventType == "recurring"] | order(recurringDay asc) {
  _id, title, subtitle, description, recurringDay, tag, ctaLabel, ctaLink
}`

export const UPCOMING_EVENTS_QUERY = `*[_type == "event" && eventType == "upcoming"] | order(date asc) {
  _id, title, subtitle, date, time, description, tag, ctaLabel, ctaLink
}`

// ── Team Members ──
export const TEAM_MEMBERS_QUERY = `*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  role,
  photo,
  order
}`

// ── Page by Slug ──
export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  title,
  subtitle,
  seo,
  content[] {
    _type,
    _key,
    // proseBlock
    text,
    // pullquoteBlock
    quote,
    attribution,
    // imageBlock
    image { ..., alt },
    caption,
    // teamGridBlock
    "members": members[]-> {
      _id, name, role, photo, order
    }
  }
}`
