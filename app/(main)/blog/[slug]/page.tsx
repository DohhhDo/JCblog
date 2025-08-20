import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { redis } from '~/lib/redis'
import { getAltForImage } from '~/lib/alt'
import { getBlogPost } from '~/sanity/queries'

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  const { title, description, mainImage } = post

  // 更自然的 meta description 生成：
  // 1) 优先使用作者填写的 description；
  // 2) 若过短，则拼接正文首段；
  // 3) 若过长，则按中/英标点就近收口，不做生硬截断；
  // 4) 最终保证在 25-160 字之间。
  type PortableTextChild = { text?: string }
  type PortableTextBlock = {
    _type?: string
    style?: string
    children?: PortableTextChild[]
  }
  function isPortableTextBlock(value: unknown): value is PortableTextBlock {
    if (typeof value !== 'object' || value === null) return false
    const v = value as Record<string, unknown>
    return '_type' in v && 'children' in v
  }
  function extractFirstParagraphFromBody(body: unknown): string {
    if (!Array.isArray(body)) return ''
    for (const raw of body as unknown[]) {
      if (!isPortableTextBlock(raw)) continue
      const block = raw

      
      if (block._type === 'block' && block.style === 'normal' && Array.isArray(block.children)) {
        const text = block.children
          .map((c: PortableTextChild) => (typeof c.text === 'string' ? c.text : ''))
          .join('')
          .replace(/\s+/g, ' ')
          .trim()
        if (text) return text
      }
    }
    return ''
  }

  function smartCloseToSentence(input: string, max = 160): string {
    if (input.length <= max) return input
    const truncated = input.slice(0, max)
    const punctuations = ['。', '！', '？', '……', '；', '.', '!', '?', ';']
    let best = -1
    for (const p of punctuations) {
      const i = truncated.lastIndexOf(p)
      if (i > best) best = i
    }
    if (best >= 25) return truncated.slice(0, best + 1)
    // 若没有句末标点，退到最近空白（针对英文）
    const ws = truncated.lastIndexOf(' ')
    if (ws >= 25) return truncated.slice(0, ws)
    return truncated
  }

  const bodyFirstPara = extractFirstParagraphFromBody(post.body)
  let candidate = (description ?? '').trim()
  if (candidate.length < 25) {
    const merged = [candidate, bodyFirstPara].filter(Boolean).join(' ')
    candidate = merged || title
  }
  const metaDescription = smartCloseToSentence(candidate, 160)

  return {
    title,
    description: metaDescription,
    openGraph: {
      title,
      description: metaDescription,
      images: [
        {
          url: mainImage.asset.url,
        },
      ],
      type: 'article',
    },
    twitter: {
      images: [
        {
          url: mainImage.asset.url,
        },
      ],
      title,
      description: metaDescription,
      card: 'summary_large_image',
      site: '@DvorakZhou',
      creator: '@DvorakZhou',
    },
  } satisfies Metadata
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  let views: number
  if (env.VERCEL_ENV === 'production') {
    views = await redis.incr(kvKeys.postViews(post._id))
  } else {
    views = 30578
  }

  let reactions: number[] = []
  try {
    if (env.VERCEL_ENV === 'production') {
      const res = await fetch(url(`/api/reactions?id=${post._id}`), {
        next: {
          tags: [`reactions:${post._id}`],
        },
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        reactions = data
      }
    } else {
      reactions = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 50000)
      )
    }
  } catch (error) {
    console.error(error)
  }

  let relatedViews: number[] = []
  if (typeof post.related !== 'undefined' && post.related.length > 0) {
    if (env.VERCEL_ENV === 'development') {
      relatedViews = post.related.map(() => Math.floor(Math.random() * 1000))
    } else {
      const postIdKeys = post.related.map(({ _id }) => kvKeys.postViews(_id))
      relatedViews = await redis.mget<number[]>(...postIdKeys)
    }
  }

  // 在服务端为缺失 alt 的图片补全简要描述（<=16 字）
  async function enrichBodyWithAlt(body: unknown): Promise<unknown> {
    if (!Array.isArray(body)) return body
    const tasks = (body as unknown[]).map(async (block) => {
      if (block && typeof block === 'object') {
        const b = block as Record<string, unknown>
        const type = b['_type']
        // 适配自定义的 image / externalImage 两种块
        if ((type === 'image' || type === 'externalImage') && !b['alt']) {
          const urlStr = typeof b['url'] === 'string' ? (b['url'] as string) : ''
          if (urlStr) {
            try {
              const { alt } = await getAltForImage(urlStr, { maxLength: 16 })
              return { ...b, alt }
            } catch {
              return block
            }
          }
        }
      }
      return block
    })
    return Promise.all(tasks)
  }

  const enrichedBody = await enrichBodyWithAlt(post.body)

  return (
    <BlogPostPage
      post={{ ...post, body: enrichedBody }}
      views={views}
      relatedViews={relatedViews}
      reactions={reactions.length > 0 ? reactions : undefined}
    />
  )
}

export const revalidate = 60
