import { seo } from '~/lib/seo'

export const revalidate = 60 * 60 // 1 hour

export function GET() {
  const homepage = seo.url.href

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${homepage}</loc>\n  </url>\n</urlset>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml',
    },
  })
}


