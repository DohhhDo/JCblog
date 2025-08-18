import { NextResponse } from 'next/server'
import { env } from '~/env.mjs'
import { submitIndexNow } from '~/lib/indexnow'

export const runtime = 'nodejs'

type SanityWebhook = {
  _type?: string
  slug?: { current?: string }
  doc?: { _type?: string; slug?: { current?: string } }
}

function buildUrlsFromWebhook(body: SanityWebhook) {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const urls = new Set<string>()

  const slug = body?.slug?.current || body?.doc?.slug?.current
  if (slug) urls.add(`${base}/blog/${slug}`)

  urls.add(`${base}/`)
  urls.add(`${base}/feed.xml`)
  return Array.from(urls)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SanityWebhook
    const urls = buildUrlsFromWebhook(body)
    if (urls.length === 0) return NextResponse.json({ ok: true, submitted: 0 })
    const result = await submitIndexNow(urls)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'unknown' }, { status: 500 })
  }
}


