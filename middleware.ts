import { authMiddleware } from '@clerk/nextjs'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  // 对需要认证的路径启用中间件
  matcher: [
    '/studio',
    '/studio/(.*)',
    '/admin',
    '/admin/(.*)',
    '/api/guestbook',
    '/api/comments',
    '/api/reactions',
    '/api/newsletter'
  ],
}

async function beforeAuthMiddleware(req: NextRequest) {
  const { geo, nextUrl } = req
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (process.env.EDGE_CONFIG) {
    const blockedIPs = await get<string[]>('blocked_ips')
    const ip = getIP(req)

    if (blockedIPs?.includes(ip)) {
      if (isApi) {
        return NextResponse.json(
          { error: 'You have been blocked.' },
          { status: 403 }
        )
      }

      nextUrl.pathname = '/blocked'
      return NextResponse.rewrite(nextUrl)
    }

    if (nextUrl.pathname === '/blocked') {
      nextUrl.pathname = '/'
      return NextResponse.redirect(nextUrl)
    }
  }

  if (geo && !isApi && env.VERCEL_ENV === 'production') {
    const country = geo.country
    const city = geo.city

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo) {
      const flag = countryInfo.flag
      await redis.set(kvKeys.currentVisitor, { country, city, flag })
    }
  }

  return NextResponse.next()
}

export default authMiddleware({
  beforeAuth: beforeAuthMiddleware,
  publicRoutes: [
    '/',
    '/api/activity',
    '/api/baidu',
    '/api/indexnow',
    '/api/indexnow-key',
    '/api/link-preview',
    '/api/songci',
    '/api/tweet',
    '/api/favicon(.*)',
    '/blog(.*)',
    '/confirm(.*)',
    '/friends',
    '/guestbook',
    '/newsletters(.*)',
    '/about',
    '/rss',
    '/feed',
    '/ama',
  ],
  afterAuth(auth, req) {
    const { userId, sessionClaims } = auth
    const url = req.nextUrl
    const pathname = url.pathname
    // 仅限制 /studio 及其子路由
    if (pathname.startsWith('/studio')) {
      // 必须已登录（邮箱白名单在页面级校验，以便通过 Clerk API 获取准确邮箱）
      if (!userId) {
        const signInUrl = new URL('/sign-in', url.origin)
        signInUrl.searchParams.set('redirect_url', url.href)
        return NextResponse.redirect(signInUrl)
      }
    }
    return NextResponse.next()
  },
})
