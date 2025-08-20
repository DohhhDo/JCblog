import { env } from '~/env.mjs'
import { redis } from '~/lib/redis'

type AccessTokenResponse = {
  access_token: string
  expires_in: number
  scope?: string
}

const ACCESS_TOKEN_CACHE_KEY = 'baidu:aip:access_token'

export async function getBaiduAccessToken(): Promise<string> {
  // Try cache first
  const cached = await redis.get<string>(ACCESS_TOKEN_CACHE_KEY)
  if (cached) return cached

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env.BAIDU_AIP_CLIENT_ID,
    client_secret: env.BAIDU_AIP_CLIENT_SECRET,
  })

  const res = await fetch(`https://aip.baidubce.com/oauth/2.0/token?${params.toString()}`, {
    method: 'GET',
    // Avoid Next.js caching for server fetch
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch Baidu access_token: ${res.status} ${res.statusText} ${text}`)
  }

  const data = (await res.json()) as AccessTokenResponse
  const token = data.access_token

  if (!token) {
    throw new Error('Baidu access_token not present in response')
  }

  // Cache with safety margin: expire slightly earlier than Baidu's expiration
  const ttlSeconds = Math.max(60, Math.floor((data.expires_in ?? 0) * 0.9))
  await redis.set(ACCESS_TOKEN_CACHE_KEY, token, {
    ex: ttlSeconds,
  })

  return token
}

// Placeholder for advanced general object/scene recognition call
export async function advancedGeneralRecognize(params: {
  imageBase64?: string
  imageUrl?: string
  /** language_type, baike_num, etc. left for future extension */
}): Promise<unknown> {
  const accessToken = await getBaiduAccessToken()

  const endpoint = `https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=${encodeURIComponent(
    accessToken,
  )}`

  const body = new URLSearchParams()
  if (params.imageBase64) body.set('image', params.imageBase64)
  if (params.imageUrl) body.set('url', params.imageUrl)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Baidu advanced_general failed: ${res.status} ${res.statusText} ${text}`)
  }

  return res.json()
}


