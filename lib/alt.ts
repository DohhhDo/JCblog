import { advancedGeneralRecognize } from '~/lib/baidu'
import { redis } from '~/lib/redis'

export type AltOptions = {
  maxLabels?: number
  minScore?: number
  maxLength?: number
  ttlDays?: number
}

type BaiduAdvancedItem = {
  keyword: string
  score: number
  root?: string
}

type BaiduAdvancedResponse = {
  log_id?: number
  result?: BaiduAdvancedItem[]
}

export function composeAltFromKeywords(
  keywords: string[],
  { maxLength = 16 }: { maxLength?: number } = {},
): string {
  if (keywords.length === 0) return '图片'
  const text = keywords.join('、')
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength)
}

// Lightweight non-crypto hash (FNV-1a variant) to create compact cache keys
function hashString(input: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index)
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0
  }
  return hash.toString(16)
}

export async function getAltForImage(
  image: string,
  {
    maxLabels = 3,
    minScore = 0.25,
    maxLength = 16,
    ttlDays = 30,
    isBase64 = false,
  }: AltOptions & { isBase64?: boolean } = {},
): Promise<{ alt: string; raw: BaiduAdvancedResponse | null }> {
  const cacheKey = `alt:baidu:${isBase64 ? 'b64' : 'url'}:${hashString(image)}`

  const cached = await redis.get<string>(cacheKey)
  if (cached) return { alt: cached, raw: null }

  try {
    const raw = (await advancedGeneralRecognize(
      isBase64 ? { imageBase64: image } : { imageUrl: image },
    )) as BaiduAdvancedResponse
    const items = (raw.result ?? [])
      .filter((it) => typeof it.keyword === 'string' && typeof it.score === 'number')
      .sort((a, b) => b.score - a.score)
      .filter((it) => it.score >= minScore)
      .slice(0, maxLabels)
    const alt = composeAltFromKeywords(items.map((i) => i.keyword), { maxLength })

    // cache for ttlDays
    const ttlSeconds = Math.max(3600, ttlDays * 24 * 3600)
    await redis.set(cacheKey, alt, { ex: ttlSeconds })
    return { alt, raw }
  } catch {
    const alt = '图片'
    return { alt, raw: null }
  }
}


