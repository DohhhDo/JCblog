import { Box, Button, Card, Flex, Stack, Text, TextArea } from '@sanity/ui'
import React, { useState, useCallback } from 'react'
import { set, unset } from 'sanity'

// Markdown到blockContent的转换函数
function markdownToBlocks(markdown: string): any[] {
  const lines = markdown.split('\n')
  const blocks: any[] = []
  let currentBlock: any = null

  const createTextBlock = (text: string, style: string = 'normal'): any => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style,
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  })

  const createCodeBlock = (code: string, language?: string): any => ({
    _type: 'code',
    _key: Math.random().toString(36).substr(2, 9),
    language: language || 'text',
    code,
  })

  const createImageBlock = (src: string, alt?: string): any => ({
    _type: 'image',
    _key: Math.random().toString(36).substr(2, 9),
    asset: {
      _type: 'reference',
      _ref: 'image-' + Math.random().toString(36).substr(2, 9), // 占位符，实际需要上传图片
    },
    alt: alt || '',
  })

  let inCodeBlock = false
  let codeLines: string[] = []
  let codeLanguage = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 代码块处理
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // 结束代码块
        blocks.push(createCodeBlock(codeLines.join('\n'), codeLanguage))
        inCodeBlock = false
        codeLines = []
        codeLanguage = ''
      } else {
        // 开始代码块
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    // 标题处理
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1
      const title = line.replace(/^#+\s*/, '')
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : level === 4 ? 'h4' : 'h5'
      blocks.push(createTextBlock(title, style))
      continue
    }

    // 图片处理
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      const [, alt, src] = imageMatch
      blocks.push(createImageBlock(src, alt))
      continue
    }

    // 链接处理 - 转换为富文本中的链接标记
    if (line.includes('[') && line.includes('](')) {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let processedText = line
      const markDefs: any[] = []
      let match

      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, linkText, href] = match
        const markKey = Math.random().toString(36).substr(2, 9)
        markDefs.push({
          _type: 'link',
          _key: markKey,
          href,
        })
        processedText = processedText.replace(fullMatch, linkText)
      }

      if (markDefs.length > 0) {
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substr(2, 9),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).substr(2, 9),
              text: processedText,
              marks: markDefs.map(def => def._key),
            },
          ],
          markDefs,
        })
        continue
      }
    }

    // 列表处理
    if (line.match(/^[\s]*[-\*\+]\s+/) || line.match(/^[\s]*\d+\.\s+/)) {
      const isOrdered = line.match(/^[\s]*\d+\.\s+/)
      const text = line.replace(/^[\s]*(?:[-\*\+]|\d+\.)\s+/, '')
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'normal',
        listItem: isOrdered ? 'number' : 'bullet',
        children: [
          {
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text,
            marks: [],
          },
        ],
        markDefs: [],
      })
      continue
    }

    // 粗体和斜体处理
    if (line.includes('**') || line.includes('*') || line.includes('__') || line.includes('_')) {
      const children: any[] = []
      const markDefs: any[] = []
      let currentText = line

      // 处理粗体 **text**
      currentText = currentText.replace(/\*\*([^*]+)\*\*/g, (match, text) => {
        const markKey = Math.random().toString(36).substr(2, 9)
        markDefs.push({
          _type: 'strong',
          _key: markKey,
        })
        children.push({
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text,
          marks: [markKey],
        })
        return `__BOLD_${markKey}__`
      })

      // 处理斜体 *text*
      currentText = currentText.replace(/\*([^*]+)\*/g, (match, text) => {
        const markKey = Math.random().toString(36).substr(2, 9)
        markDefs.push({
          _type: 'em',
          _key: markKey,
        })
        children.push({
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text,
          marks: [markKey],
        })
        return `__ITALIC_${markKey}__`
      })

      // 处理剩余的纯文本
      const parts = currentText.split(/(__(?:BOLD|ITALIC)_[^_]+__)/)
      parts.forEach(part => {
        if (!part.startsWith('__BOLD_') && !part.startsWith('__ITALIC_') && part.trim()) {
          children.push({
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text: part,
            marks: [],
          })
        }
      })

      if (children.length > 0) {
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substr(2, 9),
          style: 'normal',
          children,
          markDefs,
        })
        continue
      }
    }

    // 普通文本
    if (line.trim()) {
      blocks.push(createTextBlock(line.trim()))
    }
  }

  // 处理未结束的代码块
  if (inCodeBlock && codeLines.length > 0) {
    blocks.push(createCodeBlock(codeLines.join('\n'), codeLanguage))
  }

  return blocks
}

interface MarkdownImporterProps {
  value?: any
  onChange: (patch: any) => void
  renderDefault: (props: any) => React.ReactElement
}

export function MarkdownImporter(props: MarkdownImporterProps) {
  const [markdownText, setMarkdownText] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = useCallback(async () => {
    if (!markdownText.trim()) return

    setIsImporting(true)
    try {
      const blocks = markdownToBlocks(markdownText)
      
      // 如果当前已有内容，追加到现有内容后面
      const currentValue = props.value || []
      const newValue = Array.isArray(currentValue) ? [...currentValue, ...blocks] : blocks
      
      props.onChange(set(newValue))
      setMarkdownText('')
    } catch (error) {
      console.error('Markdown导入失败:', error)
    } finally {
      setIsImporting(false)
    }
  }, [markdownText, props])

  const handleClear = useCallback(() => {
    setMarkdownText('')
  }, [])

  const handleClearAll = useCallback(() => {
    props.onChange(unset())
  }, [props])

  return (
    <Stack space={3}>
      {/* Markdown导入区域 */}
      <Card padding={3} radius={2} shadow={1} tone="primary">
        <Stack space={3}>
          <Text size={1} weight="semibold">
            📝 Markdown 导入器
          </Text>
          <Text size={1} muted>
            粘贴Markdown内容到下方文本框，支持标题、代码块、图片、链接、列表、粗体、斜体等语法
          </Text>
          
          <TextArea
            value={markdownText}
            onChange={(event) => setMarkdownText(event.currentTarget.value)}
            placeholder="在这里粘贴你的Markdown内容..."
            rows={8}
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
            }}
          />
          
          <Flex gap={2}>
            <Button
              mode="default"
              tone="primary"
              onClick={handleImport}
              disabled={!markdownText.trim() || isImporting}
              text={isImporting ? '导入中...' : '导入到编辑器'}
            />
            <Button
              mode="ghost"
              onClick={handleClear}
              disabled={!markdownText.trim()}
              text="清空"
            />
            <Button
              mode="ghost"
              tone="critical"
              onClick={handleClearAll}
              text="清空编辑器"
            />
          </Flex>
        </Stack>
      </Card>

      {/* 原有的编辑器 */}
      <Box>
        {props.renderDefault(props)}
      </Box>
    </Stack>
  )
}
