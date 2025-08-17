import { authMiddleware } from '@clerk/nextjs'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  // 仅对 /studio 相关路径及基础页面启用，以减少不必要开销
  matcher: [
    '/studio',
    '/studio/(.*)',
    '/',
    '/(api|blog|confirm|projects|friends|guestbook|newsletters|about|rss|feed|ama)(.*)'
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
    // Studio 不公开
    '/api(.*)',
    '/blog(.*)',
    '/confirm(.*)',
    '/projects',
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
      // 必须已登录
      if (!userId) {
        const signInUrl = new URL('/sign-in', url.origin)
        signInUrl.searchParams.set('redirect_url', url.href)
        return NextResponse.redirect(signInUrl)
      }
      // 可选：基于邮箱白名单限制管理员
      const adminList = [
        // 默认内置管理员（可被环境变量补充/覆盖）
        'dvorakzhou@gmail.com',
        ...(process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ].map((s) => s.toLowerCase())
      const emailRaw =
        (sessionClaims as any)?.email ||
        (sessionClaims as any)?.email_address ||
        (sessionClaims as any)?.primary_email ||
        (sessionClaims as any)?.primaryEmail ||
        (sessionClaims as any)?.user?.email_address
      const email = emailRaw ? String(emailRaw).toLowerCase() : undefined
      // 邮箱缺失或不在白名单内，一律禁止
      if (adminList.length > 0 && (!email || !adminList.includes(email))) {
        // 用 403 阻止访问，避免暴露 Studio
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    return NextResponse.next()
  },
})
