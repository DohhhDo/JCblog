import RSS from 'rss'

import { seo } from '~/lib/seo'
import { getLatestBlogPostsWithBody } from '~/sanity/queries'

export const revalidate = 60 * 60 // 1 hour

type PortableTextSpan = { text?: string }
type PortableTextBlock = { _type?: string; children?: PortableTextSpan[] }

function isPortableTextBlock(value: unknown): value is PortableTextBlock {
  return (
    typeof value === 'object' &&
    value !== null &&
    // @ts-expect-error narrow optional
    (value._type === 'block' || typeof value._type === 'undefined')
  )
}

function blocksToPlainText(blocks: PortableTextBlock[]): string {
  try {
    if (!Array.isArray(blocks)) return ''
    return blocks
      .map((block) => {
        if (isPortableTextBlock(block) && Array.isArray(block.children)) {
          return block.children
            .map((child) => (typeof child?.text === 'string' ? child.text : ''))
            .join('')
        }
        return ''
      })
      .filter(Boolean)
      .join('\n\n')
  } catch {
    return ''
  }
}

export async function GET() {
  const feed = new RSS({
    title: `${seo.title} - Full Content`,
    description: seo.description,
    site_url: seo.url.href,
    feed_url: `${seo.url.href}feed-full.xml`,
    language: 'zh-CN',
    image_url: `${seo.url.href}opengraph-image.png`,
    generator: 'Next.js RSS',
  })

  const data = await getLatestBlogPostsWithBody({ limit: 999 })
  if (!data) {
    return new Response('Not found', { status: 404 })
  }

  data.forEach((post) => {
    const body: PortableTextBlock[] = Array.isArray(post.body)
      ? (post.body as unknown as PortableTextBlock[])
      : []
    const content = blocksToPlainText(body)
    const description = post.description || content.slice(0, 200)

    feed.item({
      title: post.title,
      guid: post._id,
      url: `${seo.url.href}blog/${post.slug}`,
      description,
      date: new Date(post.publishedAt),
      custom_elements: content
        ? [
            {
              'content:encoded': {
                _cdata: `<div>${content
                  .split('\n')
                  .map((p) => `<p>${p}</p>`) // 简单包裹为段落
                  .join('')}</div>`,
              },
            },
          ]
        : [],
      enclosure: post.mainImage?.asset?.url
        ? {
            url: post.mainImage.asset.url,
          }
        : undefined,
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}


