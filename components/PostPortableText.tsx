'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import React from 'react'

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

export function PostPortableText(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
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
    const cleanedValue = props.value.filter((block: any) => {
      if (!block || typeof block !== 'object' || !block._type) {
        console.warn('PostPortableText: 移除无效块', block)
        return false
      }
      
      // 特别检查externalImage类型
      if (block._type === 'externalImage') {
        if (!block.url || typeof block.url !== 'string') {
          console.warn('PostPortableText: 移除无效的externalImage块', block)
          return false
        }
      }
      
      return true
    })

    return (
      <PortableText
        value={cleanedValue}
        components={props.components ?? components}
      />
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
