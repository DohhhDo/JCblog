import { Box, Button, Flex } from '@sanity/ui'
import React from 'react'
import ReadingTime from 'reading-time'
import { type NumberInputProps, set, useFormValue } from 'sanity'

type SanityBlock = {
  _type: string
  children?: SanityBlock[]
  text?: string
}

function flattenBlocks(blocks: SanityBlock[]): string[] {
  return blocks.flatMap((block) => {
    if (block.text) {
      return [block.text]
    }

    if (block.children) {
      return flattenBlocks(block.children)
    }

    return []
  })
}

// 从markdown文本中提取纯文本内容（去除markdown语法）
function extractTextFromMarkdown(markdown: string): string {
  return markdown
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`[^`]*`/g, '')
    // 移除链接，保留文本
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除图片
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体和斜体标记
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // 移除列表标记
    .replace(/^[\s]*[-\*\+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除引用标记
    .replace(/^>\s+/gm, '')
    // 移除水平线
    .replace(/^---+$/gm, '')
    .replace(/^\*\*\*+$/gm, '')
    // 清理多余的空行和空格
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

export default function ReadingTimeInput(props: NumberInputProps) {
  const body = useFormValue(['body'])

  const generate = React.useCallback(() => {
    let textContent = ''
    
    if (typeof body === 'string') {
      // 如果body是markdown字符串，提取纯文本
      textContent = extractTextFromMarkdown(body)
    } else if (Array.isArray(body)) {
      // 如果body是块内容数组，使用原有逻辑
      textContent = flattenBlocks(body as SanityBlock[]).join('\n')
    }
    
    const rt = ReadingTime(textContent)
    props.onChange(set(rt.minutes))
  }, [body, props])

  return (
    <Flex gap={3} align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <Button mode="ghost" onClick={generate}>
        Generate
      </Button>
    </Flex>
  )
}
