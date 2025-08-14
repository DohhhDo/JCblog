import Studio from './Studio'

// Studio needs to be dynamically rendered, not statically generated
export const dynamic = 'force-dynamic'

// Set the right `viewport`, `robots` and `referer` meta tags
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
