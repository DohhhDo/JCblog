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
  
  let inCodeBlock = false
  let codeLines: string[] = []
  let codeLanguage = ''
  
  for (const line of lines) {
    // 跳过 TOC 目录语法
    if (line.startsWith('@[TOC]')) {
      // 创建一个提示块
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
    
    // 处理标题
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1
      const title = line.replace(/^#+\s*/, '')
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      blocks.push(createTextBlock(title, style))
      continue
    }
    
    // 处理图片（独立行）
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      const [, alt, src] = imageMatch
      if (src && src.startsWith('http')) {
        blocks.push(createImageBlock(src, alt))
        continue
      }
    }
    
    // 处理列表
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)/)
    if (listMatch) {
      const [, , marker, text] = listMatch
      const isOrdered = /\d+\./.test(marker)
      const { children, markDefs } = processInlineMarks(text)
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: isOrdered ? 'number' : 'bullet',
        children,
        markDefs,
      })
      continue
    }
    
    // 处理普通文本
    if (line.trim()) {
      const { children, markDefs } = processInlineMarks(line)
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children,
        markDefs,
      })
    }
  }
  
  // 处理未结束的代码块
  if (inCodeBlock && codeLines.length > 0) {
    blocks.push(createCodeBlock(codeLines.join('\n'), codeLanguage))
  }
  
  return blocks
}