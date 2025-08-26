import { type MetadataRoute } from 'next'

import { url } from '~/lib'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: url('/google-sitemap.xml').href,
    host: url('/').origin,
  }
}

export const runtime = 'edge'
export const revalidate = 60


