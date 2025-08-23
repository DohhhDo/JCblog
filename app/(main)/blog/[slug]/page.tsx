/* eslint-disable simple-import-sort/imports */
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { url } from '~/lib'

import { redis } from '~/lib/redis'
import { getBlogPost, getAllLatestBlogPostSlugs } from '~/sanity/queries'

// 预生成所有博客页面的静态参数，确保热门页面在构建时预生成
export async function generateStaticParams() {
  try {
    const slugs = await getAllLatestBlogPostSlugs()
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

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

  // 并行处理所有数据获取操作以减少总体耗时
  const [views, reactions, relatedViews] = await Promise.allSettled([
    // 获取页面浏览量
    env.VERCEL_ENV === 'production' 
      ? redis.incr(kvKeys.postViews(post._id)) 
      : Promise.resolve(30578),
    
    // 获取反应数据 
    env.VERCEL_ENV === 'production'
      ? fetch(url(`/api/reactions?id=${post._id}`), { 
          cache: 'force-cache' // 使用缓存减少API调用
        }).then(res => res.json()).then((data: unknown) => Array.isArray(data) ? data as number[] : [])
      : Promise.resolve(Array.from({ length: 4 }, () => Math.floor(Math.random() * 50000))),
    
    // 获取相关文章浏览量
    (typeof post.related !== 'undefined' && post.related.length > 0)
      ? env.VERCEL_ENV === 'development'
        ? Promise.resolve(post.related.map(() => Math.floor(Math.random() * 1000)))
        : redis.mget<number[]>(...post.related.map(({ _id }) => kvKeys.postViews(_id)))
      : Promise.resolve([])
  ])

  // 提取结果，失败时使用默认值
  const finalViews = views.status === 'fulfilled' ? views.value : 0
  const finalReactions = reactions.status === 'fulfilled' ? reactions.value : []
  const finalRelatedViews = relatedViews.status === 'fulfilled' ? relatedViews.value : []

  // 直接使用原始的 body 内容，不再进行 alt 文本处理以节省计算资源
  const enrichedBody = post.body

  return (
    <BlogPostPage
      post={{ ...post, body: enrichedBody }}
      views={finalViews}
      relatedViews={finalRelatedViews}
      reactions={finalReactions.length > 0 ? finalReactions : undefined}
    />
  )
}

export const revalidate = 3600 // 缓存1小时，减少服务端渲染频率以节省计算资源
