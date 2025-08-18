import { env } from '~/env.mjs'

function getHost() {
  const base = env.NEXT_PUBLIC_SITE_URL
  const url = new URL(base)
  return url.hostname
}

export async function submitIndexNow(urlList: string[]) {
  if (!Array.isArray(urlList) || urlList.length === 0) {
    return { ok: true, submitted: 0 }
  }

  const key = env.INDEXNOW_KEY
  const site = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const payload = {
    host: getHost(),
    key,
    keyLocation: `${site}/${key}.txt`,
    urlList,
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`IndexNow submit failed: ${res.status} ${text}`)
  }
  return { ok: true, submitted: urlList.length }
}


