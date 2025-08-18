import { NextResponse } from 'next/server'

import { env } from '~/env.mjs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export function GET(
  _: Request,
  context: { params?: { indexnowKey?: string } }
) {
  const key = (env.INDEXNOW_KEY || '').trim()
  const requested = (context?.params?.indexnowKey || '').trim()
  if (!key || !requested || requested !== key) {
    return new NextResponse('Not Found', { status: 404 })
  }
  return new NextResponse(key, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}


