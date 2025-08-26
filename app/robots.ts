import { type MetadataRoute } from 'next'

import { url } from '~/lib'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: '/google-sitemap.xml',
    host: url('/').origin,
  }
}

export const runtime = 'edge'
export const revalidate = 60


