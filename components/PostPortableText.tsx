"use client"

import React from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'

import { AltTextProvider } from '~/components/AltTextContext'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import {
  PortableTextBlocksBlockquote,
  PortableTextBlocksH1,
  PortableTextBlocksH2,
  PortableTextBlocksH3,
  PortableTextBlocksH4,
  PortableTextBlocksListItem,
  PortableTextBlocksNormal,
} from '~/components/portable-text/PortableTextBlocks'
import { PortableTextCodeBlock } from '~/components/portable-text/PortableTextCodeBlock'
import { PortableTextExternalImage } from '~/components/portable-text/PortableTextExternalImage'
import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { PortableTextTweet } from '~/components/portable-text/PortableTextTweet'

const components: PortableTextComponents = {
  block: {
    normal: PortableTextBlocksNormal,
    h1: PortableTextBlocksH1,
    h2: PortableTextBlocksH2,
    h3: PortableTextBlocksH3,
    h4: PortableTextBlocksH4,
    blockquote: PortableTextBlocksBlockquote,
  },
  listItem: PortableTextBlocksListItem,
  types: {
    image: PortableTextImage,
    externalImage: PortableTextExternalImage,
    tweet: PortableTextTweet,
    codeBlock: PortableTextCodeBlock,
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <PeekabooLink href={value.href} rel={rel}>
          {children}
        </PeekabooLink>
      )
    },
  },
}

type PortableBlockChild = { text?: string }
type PortableBlock = {
  _type?: string
  style?: string
  children?: PortableBlockChild[]
}

export function PostPortableText(props: {
  value: unknown
  components?: PortableTextComponents
}) {
  // 添加错误边界处理
  try {
    // 确保value是有效的数组
    if (!props.value || !Array.isArray(props.value)) {
      console.warn('PostPortableText: 无效的value，使用空数组', props.value)
      return null
    }

    // 过滤和清理数据，移除无效的块
    const cleanedValue = (props.value as unknown[]).filter((block: unknown) => {
      if (!block || typeof block !== 'object' || !('_type' in (block as Record<string, unknown>))) {
        console.warn('PostPortableText: 移除无效块', block)
        return false
      }
      
      // 特别检查externalImage类型
      const b = block as Record<string, unknown>
      if (b._type === 'externalImage') {
        if (!('url' in b) || typeof b.url !== 'string') {
          console.warn('PostPortableText: 移除无效的externalImage块', block)
          return false
        }
      }
      
      return true
    })

    // 依据正文内容计算关键词（简单词频法），供图片 alt 回退使用
    const textContent: string = (cleanedValue as PortableBlock[])
      .filter((b) => b?._type === 'block' && b.style === 'normal' && Array.isArray(b.children))
      .map((b) =>
        (b.children || [])
          .map((c) => (typeof c?.text === 'string' ? c.text : ''))
          .join(' ')
      )
      .join(' ')
      .toLowerCase()

    const stopwords = new Set([
      '的','了','和','是','在','就','也','都','而','及','与','或','一个','我们','你','我','他','她','它','这','那','被','对','于','上','下','中','与','并','请','通过','以及',
      'the','a','an','and','or','to','of','in','on','for','with','by','is','are','was','were','be','been','this','that','it','we','you','they','as','at','from','into','your','our'
    ])

    const tokens: string[] = textContent
      .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter((w) => w.length >= 2 && !stopwords.has(w))

    const freq = new Map<string, number>()
    for (const w of tokens) freq.set(w, (freq.get(w) ?? 0) + 1)
    const keywords = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([w]) => w)

    return (
      <AltTextProvider value={{ keywords }}>
        <PortableText
          value={cleanedValue}
          components={props.components ?? components}
        />
      </AltTextProvider>
    )
  } catch (error) {
    console.error('PostPortableText渲染错误:', error)
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">
          内容渲染出错，请检查数据格式
        </p>
      </div>
    )
  }
}
