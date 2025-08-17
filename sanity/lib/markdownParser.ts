/**
 * 统一的 Markdown 解析器
 * 将 Markdown 文本转换为 Sanity blockContent 结构
 */

// 支持的代码语言列表（与 Sanity 代码块组件兼容）
const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'jsx', 'tsx', 'json',
  'python', 'java', 'c', 'cpp', 'csharp', 'c#',
  'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'html', 'css', 'scss', 'sass',
  'xml', 'yaml', 'sql', 'bash', 'shell',
  'markdown', 'text'
]

// 语言别名映射
const LANGUAGE_ALIASES: { [key: string]: string } = {
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

/**
 * 生成唯一 key
 */
function generateKey(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * 规范化代码语言
 */
function normalizeLanguage(lang?: string): string {
  if (!lang) return 'text'
  
  const normalized = lang.toLowerCase().trim()
  const aliased = LANGUAGE_ALIASES[normalized] || normalized
  
  return SUPPORTED_LANGUAGES.includes(aliased) ? aliased : 'text'
}

/**
 * 创建标准文本块
 */
function createTextBlock(text: string, style: string = 'normal'): any {
  return {
    _type: 'block',
    _key: generateKey(),
    style,
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }
}

/**
 * 创建代码块（使用标准 codeBlock 类型）
 */
function createCodeBlock(code: string, language?: string): any {
  return {
    _type: 'codeBlock',
    _key: generateKey(),
    language: normalizeLanguage(language),
    code: code.trim(),
  }
}

/**
 * 创建外链图片块（使用网站标准的 externalImage 类型）
 */
function createImageBlock(url: string, alt?: string): any {
  // 验证URL格式
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    console.warn('Invalid image URL:', url)
    return createTextBlock(`🖼️ 无效图片链接: ${url}`, 'normal')
  }

  return {
    _type: 'externalImage',
    _key: generateKey(),
    url: url.trim(),
    alt: alt || '',
    label: alt || '',
  }
}

/**
 * 处理富文本标记（粗体、斜体、删除线等）
 */
function processInlineMarks(text: string): { children: any[], markDefs: any[] } {
  const children: any[] = []
  const markDefs: any[] = []
  
  // 处理链接 [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let linkMatch
  let lastLinkIndex = 0
  
  while ((linkMatch = linkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, href] = linkMatch
    const markKey = generateKey()
    
    // 添加链接前的文本
    if (linkMatch.index > lastLinkIndex) {
      const beforeText = text.substring(lastLinkIndex, linkMatch.index)
      if (beforeText) {
        const processedSpans = processTextMarks(beforeText)
        children.push(...processedSpans)
      }
    }
    
    // 添加链接标记定义
    markDefs.push({
      _type: 'link',
      _key: markKey,
      href,
    })
    
    // 处理链接文本中的格式
    const linkSpans = processTextMarks(linkText)
    linkSpans.forEach(span => {
      children.push({
        ...span,
        marks: [...span.marks, markKey],
      })
    })
    
    lastLinkIndex = linkMatch.index + fullMatch.length
  }
  
  // 添加剩余文本
  if (lastLinkIndex < text.length) {
    const remainingText = text.substring(lastLinkIndex)
    if (remainingText) {
      const processedSpans = processTextMarks(remainingText)
      children.push(...processedSpans)
    }
  }
  
  // 如果没有链接，处理整个文本的标记
  if (children.length === 0) {
    const processedSpans = processTextMarks(text)
    children.push(...processedSpans)
  }
  
  return { children, markDefs }
}

/**
 * 处理文本标记（粗体、斜体、删除线、行内代码）
 */
function processTextMarks(text: string): any[] {
  const spans: any[] = []
  
  // 处理复合标记：删除线、粗体、斜体、行内代码
  // 按优先级顺序：删除线 > 粗体 > 斜体 > 行内代码
  const parts = text.split(/(~~[^~]+~~|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  
  parts.forEach(part => {
    if (!part) return
    
    if (part.startsWith('~~') && part.endsWith('~~')) {
      // 删除线
      const innerText = part.slice(2, -2)
      // 递归处理删除线内的其他标记
      const innerSpans = processNestedMarks(innerText)
      innerSpans.forEach(span => {
        spans.push({
          ...span,
          marks: [...span.marks, 'strike-through'],
        })
      })
    } else if (part.startsWith('**') && part.endsWith('**')) {
      // 粗体
      const innerText = part.slice(2, -2)
      const innerSpans = processNestedMarks(innerText)
      innerSpans.forEach(span => {
        spans.push({
          ...span,
          marks: [...span.marks, 'strong'],
        })
      })
    } else if (part.startsWith('*') && part.endsWith('*')) {
      // 斜体
      const innerText = part.slice(1, -1)
      const innerSpans = processNestedMarks(innerText)
      innerSpans.forEach(span => {
        spans.push({
          ...span,
          marks: [...span.marks, 'em'],
        })
      })
    } else if (part.startsWith('`') && part.endsWith('`')) {
      // 行内代码
      spans.push({
        _type: 'span',
        _key: generateKey(),
        text: part.slice(1, -1),
        marks: ['code'],
      })
    } else {
      // 普通文本
      spans.push({
        _type: 'span',
        _key: generateKey(),
        text: part,
        marks: [],
      })
    }
  })
  
  return spans
}

/**
 * 处理嵌套标记（用于删除线、粗体内的其他格式）
 */
function processNestedMarks(text: string): any[] {
  // 简化处理嵌套，避免无限递归
  const parts = text.split(/(\*[^*]+\*|`[^`]+`)/g)
  const spans: any[] = []
  
  parts.forEach(part => {
    if (!part) return
    
    if (part.startsWith('*') && part.endsWith('*')) {
      // 斜体
      spans.push({
        _type: 'span',
        _key: generateKey(),
        text: part.slice(1, -1),
        marks: ['em'],
      })
    } else if (part.startsWith('`') && part.endsWith('`')) {
      // 行内代码
      spans.push({
        _type: 'span',
        _key: generateKey(),
        text: part.slice(1, -1),
        marks: ['code'],
      })
    } else {
      // 普通文本
      spans.push({
        _type: 'span',
        _key: generateKey(),
        text: part,
        marks: [],
      })
    }
  })
  
  return spans
}

/**
 * 主要的 Markdown 轣换函数
 */
export function parseMarkdownToBlocks(markdown: string): any[] {
  const lines = markdown.split('\n')
  const blocks: any[] = []

  // 段落缓冲，合并连续行作为一个段落
  let paragraphBuffer: string[] = []

  let inCodeBlock = false
  let codeLines: string[] = []
  let codeLanguage = ''

  // 列表状态（用于将连续列表项分组时保持一致风格）
  let inList = false

  // 辅助：刷新段落缓冲
  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return
    const text = paragraphBuffer.join(' ').trim()
    if (text) {
      const { children, markDefs } = processInlineMarks(text)
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children,
        markDefs,
      })
    }
    paragraphBuffer = []
  }

  // 辅助：处理行内图片（可多张），并将前后文本按段落/行生成 block
  const emitLineWithInlineImages = (rawLine: string) => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    let lastIndex = 0
    let m: RegExpExecArray | null
    let emittedAnything = false

    while ((m = imageRegex.exec(rawLine)) !== null) {
      const [fullMatch, alt, src] = m
      const before = rawLine.slice(lastIndex, m.index)
      if (before.trim()) {
        paragraphBuffer.push(before.trim())
        flushParagraph()
        emittedAnything = true
      }

      if (src && src.startsWith('http')) {
        blocks.push(createImageBlock(src, alt))
        emittedAnything = true
      } else {
        // 无效图片，按原文本落入段落
        paragraphBuffer.push(fullMatch)
      }
      lastIndex = m.index + fullMatch.length
    }

    const after = rawLine.slice(lastIndex)
    if (after.trim()) {
      paragraphBuffer.push(after.trim())
      flushParagraph()
      emittedAnything = true
    }

    return emittedAnything
  }

  for (const lineRaw of lines) {
    const line = lineRaw.replace(/\t/g, '    ')
    // 跳过 TOC 目录语法
    if (line.startsWith('@[TOC]')) {
      flushParagraph()
      blocks.push(createTextBlock('📋 目录 (TOC)', 'h4'))
      continue
    }
    
    // 处理代码块
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // 结束代码块
        if (codeLines.length > 0) {
          blocks.push(createCodeBlock(codeLines.join('\n'), codeLanguage))
        }
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
    
    // 空行：刷新段落/列表
    if (line.trim().length === 0) {
      flushParagraph()
      inList = false
      continue
    }

    // 处理标题（映射 h5/h6 为 h4）
    if (line.startsWith('#')) {
      flushParagraph()
      inList = false
      const level = line.match(/^#+/)?.[0].length || 1
      const title = line.replace(/^#+\s*/, '')
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      blocks.push(createTextBlock(title, style))
      continue
    }

    // 处理引用块
    if (/^>\s?/.test(line)) {
      flushParagraph()
      inList = false
      const text = line.replace(/^>\s?/, '')
      const { children, markDefs } = processInlineMarks(text)
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'blockquote',
        children,
        markDefs,
      })
      continue
    }
    
    // 处理图片（独立行）
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      flushParagraph()
      inList = false
      const [, alt, src] = imageMatch
      if (src && src.startsWith('http')) {
        blocks.push(createImageBlock(src, alt))
        continue
      }
    }
    
    // 处理列表
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)/)
    if (listMatch) {
      flushParagraph()
      inList = true
      const [, indent, marker, text] = listMatch
      const isOrdered = /\d+\./.test(marker)
      const level = Math.max(1, Math.floor((indent || '').length / 2) + 1)
      const { children, markDefs } = processInlineMarks(text)

      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: isOrdered ? 'number' : 'bullet',
        level,
        children,
        markDefs,
      })
      continue
    }
    
    // 行内图片：非整行图片，拆分处理
    if (/!\[[^\]]*\]\([^\)]+\)/.test(line)) {
      emitLineWithInlineImages(line)
      inList = false
      continue
    }

    // 其他普通文本先加入段落缓冲，延后统一 flush（便于合并多行）
    paragraphBuffer.push(line.trim())
  }
  
  // 处理未结束的代码块
  if (inCodeBlock && codeLines.length > 0) {
    blocks.push(createCodeBlock(codeLines.join('\n'), codeLanguage))
  }
  // 刷新尾部段落
  flushParagraph()
  
  return blocks
}