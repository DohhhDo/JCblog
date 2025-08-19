import { env } from '~/env.mjs'

export const seo = {
  title: 'JCblog | 间窗的博客',
  description: 'Welcome to JC blog.',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? env.NEXT_PUBLIC_SITE_URL
      : 'http://localhost:3000'
  ),
} as const
