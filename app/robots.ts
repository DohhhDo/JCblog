import { url } from '~/lib'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      '/google-sitemap.xml',
      '/sitemap.xml',
    ],
    host: url('/').origin,
  }
}

export const runtime = 'edge'
export const revalidate = 60


