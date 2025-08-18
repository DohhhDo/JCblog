import { NextResponse } from 'next/server'
import { env } from '~/env.mjs'

export const dynamic = 'force-static'

export async function GET(_: Request, { params }: { params: { indexnowKey: string } }) {
  const key = env.INDEXNOW_KEY
  if (!key || params.indexnowKey !== key) {
    return new NextResponse('Not Found', { status: 404 })
  }
  return new NextResponse(key, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}


