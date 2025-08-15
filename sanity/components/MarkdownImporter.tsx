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

  // 支持的编程语言列表
  const supportedLanguages = [
    'javascript', 'typescript', 'jsx', 'tsx', 'json',
    'python', 'java', 'c', 'cpp', 'csharp', 'c#',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'html', 'css', 'scss', 'sass', 'less',
    'xml', 'yaml', 'yml', 'toml', 'ini',
    'sql', 'mysql', 'postgresql', 'sqlite',
    'bash', 'shell', 'sh', 'zsh', 'fish', 'powershell',
    'dockerfile', 'docker', 'makefile', 'cmake',
    'markdown', 'md', 'text', 'txt', 'plain',
    'vim', 'lua', 'perl', 'r', 'matlab', 'octave',
    'haskell', 'scala', 'clojure', 'elixir', 'erlang',
    'dart', 'groovy', 'batch', 'nginx', 'apache'
  ]

  const normalizeLanguage = (lang?: string): string => {
    if (!lang) return 'text'
    
    const normalized = lang.toLowerCase().trim()
    
    // 处理常见的语言别名
    const languageAliases: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'cs': 'csharp',
      'c++': 'cpp',
      'sh': 'bash',
      'yml': 'yaml',
      'md': 'markdown',
      'txt': 'text'
    }
    
    const aliasedLang = languageAliases[normalized] || normalized
    
    // 如果是支持的语言，返回该语言；否则返回 'text'
    return supportedLanguages.includes(aliasedLang) ? aliasedLang : 'text'
  }

  const createCodeBlock = (code: string, language?: string): any => ({
    _type: 'codeBlock', // 使用blockContent schema中定义的正确类型名
    _key: Math.random().toString(36).substr(2, 9),
    language: normalizeLanguage(language),
    code,
  })

  // 创建外链图片组件
  const createImageBlock = (src: string, alt?: string): any => {
    console.log('创建图片块:', { src, alt }) // 调试用
    return {
      _type: 'externalImage',
      _key: Math.random().toString(36).substr(2, 9),
      url: src,
      alt: alt || '',
      label: alt || '', // 使用alt作为标注
    }
  }

  let inCodeBlock = false
  let codeLines: string[] = []
  let codeLanguage = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    console.log('处理行:', line) // 调试用

    try {
      // 代码块处理
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // 结束代码块 - 即使语言不支持也不报错
          const normalizedLang = normalizeLanguage(codeLanguage)
          blocks.push(createCodeBlock(codeLines.join('\n'), normalizedLang))
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
    } catch (error) {
      // 如果处理代码块出错，作为普通文本处理
      console.warn('代码块处理出错，作为普通文本处理:', error)
      if (line.trim()) {
        blocks.push(createTextBlock(line.trim()))
      }
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

    // 图片处理 - 必须在链接处理之前，支持独立行和行内图片
    if (line.includes('![')) {
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (imageMatch) {
        const [fullMatch, alt, src] = imageMatch
        console.log('检测到图片:', { alt, src, fullMatch }) // 调试用
        
        // 验证URL格式
        if (!src || typeof src !== 'string' || src.trim() === '') {
          console.warn('无效的图片URL，跳过:', src)
          blocks.push(createTextBlock(line.trim()))
          continue
        }
        
        // 清理和验证URL
        const cleanedSrc = src.trim()
        if (!cleanedSrc.match(/^https?:\/\//)) {
          console.warn('不支持的图片URL格式，跳过:', cleanedSrc)
          blocks.push(createTextBlock(line.trim()))
          continue
        }
        
        // 如果整行只有图片，直接创建图片块
        if (line.trim() === fullMatch) {
          blocks.push(createImageBlock(cleanedSrc, alt))
          continue
        } else {
          // 如果行内有其他内容，将图片替换为占位符，后续作为文本处理
          const textWithPlaceholder = line.replace(fullMatch, `[图片: ${alt || '图片'}]`)
          blocks.push(createTextBlock(textWithPlaceholder))
          // 然后添加图片块
          blocks.push(createImageBlock(cleanedSrc, alt))
          continue
        }
      }
    }

    // 链接处理 - 转换为富文本中的链接标记
    if (line.includes('[') && line.includes('](')) {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let processedText = line
      const markDefs: any[] = []
      const children: any[] = []
      let lastIndex = 0
      let match

      // 重置regex lastIndex
      linkRegex.lastIndex = 0
      
      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, linkText, href] = match
        const markKey = Math.random().toString(36).substr(2, 9)
        
        // 添加链接前的文本
        if (match.index > lastIndex) {
          const beforeText = line.substring(lastIndex, match.index)
          if (beforeText) {
            children.push({
              _type: 'span',
              _key: Math.random().toString(36).substr(2, 9),
              text: beforeText,
              marks: [],
            })
          }
        }
        
        // 添加链接标记定义
        markDefs.push({
          _type: 'link',
          _key: markKey,
          href,
        })
        
        // 添加链接文本
        children.push({
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: linkText,
          marks: [markKey],
        })
        
        lastIndex = match.index + fullMatch.length
      }
      
      // 添加剩余文本
      if (lastIndex < line.length) {
        const remainingText = line.substring(lastIndex)
        if (remainingText) {
          children.push({
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text: remainingText,
            marks: [],
          })
        }
      }

      if (markDefs.length > 0) {
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

  // 处理未结束的代码块 - 不报错，直接处理
  if (inCodeBlock && codeLines.length > 0) {
    const normalizedLang = normalizeLanguage(codeLanguage)
    blocks.push(createCodeBlock(codeLines.join('\n'), normalizedLang))
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
      
      // 处理当前值，兼容从code类型迁移的数据
      let currentValue = props.value || []
      
      // 如果当前值是code对象，先转换为blockContent
      if (currentValue && typeof currentValue === 'object' && currentValue._type === 'code' && currentValue.code) {
        const codeBlocks = markdownToBlocks(currentValue.code)
        currentValue = codeBlocks
      }
      
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

  const handleMigrateCodeData = useCallback(() => {
    const currentValue = props.value
    
    // 如果当前值是code对象，转换为blockContent
    if (currentValue && typeof currentValue === 'object' && currentValue._type === 'code' && currentValue.code) {
      const blocks = markdownToBlocks(currentValue.code)
      props.onChange(set(blocks))
    }
  }, [props])

  // 检查是否需要迁移
  const needsMigration = props.value && 
    typeof props.value === 'object' && 
    props.value._type === 'code'

  return (
    <Stack space={3}>
      {/* 数据迁移提示 */}
      {needsMigration && (
        <Card padding={3} radius={2} shadow={1} tone="caution">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              🔄 检测到旧格式数据
            </Text>
            <Text size={1} muted>
              发现code格式的内容，需要转换为新的富文本格式。点击下方按钮自动迁移。
            </Text>
            <Button
              mode="default"
              tone="caution"
              onClick={handleMigrateCodeData}
              text="迁移现有数据"
            />
          </Stack>
        </Card>
      )}

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
