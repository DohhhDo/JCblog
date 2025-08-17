/**
 * 统一的 Markdown 导入器
 * 支持富文本内容导入，具有错误处理和降级机制
 */

import { Box, Button, Card, Flex, Stack, Text, TextArea } from '@sanity/ui'
import React, { useState, useCallback, Component, ErrorInfo, ReactNode, Suspense } from 'react'
import { set, unset } from 'sanity'

import { parseMarkdownToBlocks } from '../lib/markdownParser'

// 错误边界状态接口
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  retryCount: number
}

// 组件属性接口
interface UnifiedMarkdownImporterProps {
  value?: any
  onChange: (patch: any) => void
  renderDefault: (props: any) => React.ReactElement
  children?: ReactNode
}

// 错误边界类
class MarkdownImporterErrorBoundary extends Component<UnifiedMarkdownImporterProps, ErrorBoundaryState> {
  private retryTimer?: NodeJS.Timeout

  constructor(props: UnifiedMarkdownImporterProps) {
    super(props)
    this.state = { 
      hasError: false, 
      retryCount: 0 
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('MarkdownImporter Error Boundary caught:', error)
    return { 
      hasError: true, 
      error,
      retryCount: 0
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MarkdownImporter detailed error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    })

    // 如果是 ChunkLoadError，尝试自动重试
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      this.handleChunkError()
    }
  }

  handleChunkError = () => {
    console.log('Handling ChunkLoadError, attempting recovery...')
    
    // 清除可能的缓存问题
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('static') || name.includes('chunks')) {
            caches.delete(name).catch(console.warn)
          }
        })
      }).catch(console.warn)
    }

    // 延迟重试，给系统时间恢复
    this.retryTimer = setTimeout(() => {
      this.handleRetry()
    }, 2000)
  }

  handleRetry = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1
    }))
  }

  handleForceReload = () => {
    // 强制刷新页面
    window.location.reload()
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
    }
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message.includes('Loading chunk')

      return (
        <Card padding={3} radius={2} shadow={1} tone="critical">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              {isChunkError ? '🔄 组件加载失败' : '⚠️ Markdown 导入器错误'}
            </Text>
            <Text size={1} muted>
              {isChunkError 
                ? '检测到网络或缓存问题，正在尝试恢复...' 
                : `错误信息: ${this.state.error?.message || '未知错误'}`
              }
            </Text>
            <Text size={0} muted>
              重试次数: {this.state.retryCount}/3
            </Text>
            <Stack space={2}>
              <Button
                mode="default"
                tone="primary"
                onClick={this.handleRetry}
                text={isChunkError ? '重新加载组件' : '重试'}
                disabled={this.state.retryCount >= 3}
              />
              {this.state.retryCount >= 3 && (
                <Button
                  mode="ghost"
                  tone="caution"
                  onClick={this.handleForceReload}
                  text="刷新页面"
                />
              )}
            </Stack>
            
            {/* 提供备用的基础编辑器 */}
            <Card padding={2} radius={1} tone="default">
              <Text size={0} weight="semibold" style={{ marginBottom: '8px' }}>
                备用编辑器
              </Text>
              <Box>
                {this.props.renderDefault(this.props)}
              </Box>
            </Card>
          </Stack>
        </Card>
      )
    }

    // 正确传递children
    return this.props.children as ReactNode
  }
}

// 加载中的占位符
function LoadingFallback() {
  return (
    <Card padding={3} radius={2} shadow={1} tone="default">
      <Stack space={3}>
        <Text size={1} weight="semibold">
          📝 加载 Markdown 导入器...
        </Text>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          background: '#e0e0e0', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '30%',
            height: '100%',
            background: '#3b82f6',
            borderRadius: '2px',
            animation: 'loading 2s ease-in-out infinite'
          }} />
        </div>
      </Stack>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </Card>
  )
}

// 主要的统一导入器组件
export function UnifiedMarkdownImporter(props: UnifiedMarkdownImporterProps) {
  const [markdownText, setMarkdownText] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = useCallback(async () => {
    if (!markdownText.trim()) return

    setIsImporting(true)
    setError(null)
    
    try {
      const blocks = parseMarkdownToBlocks(markdownText)
      const currentValue = props.value || []
      const newValue = Array.isArray(currentValue) ? [...currentValue, ...blocks] : blocks
      
      props.onChange(set(newValue))
      setMarkdownText('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '导入失败'
      setError(errorMessage)
      console.error('Markdown 导入错误:', err)
    } finally {
      setIsImporting(false)
    }
  }, [markdownText, props])

  const handleClear = useCallback(() => {
    setMarkdownText('')
    setError(null)
  }, [])

  const handleClearAll = useCallback(() => {
    props.onChange(unset())
  }, [props])

  // 主要组件UI
  const MainComponent = () => (
    <Stack space={3}>
      {/* Markdown 导入区域 */}
      <Card padding={3} radius={2} shadow={1} tone="primary">
        <Stack space={3}>
          <Text size={1} weight="semibold">
            📝 Markdown 导入器
          </Text>
          <Text size={1} muted>
            支持：标题、代码块、图片、链接、列表、**粗体**、*斜体*、~~删除线~~、`行内代码`、@[TOC]目录
          </Text>
          
          {error && (
            <Card padding={2} radius={1} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}
          
          <TextArea
            value={markdownText}
            onChange={(event) => setMarkdownText(event.currentTarget.value)}
            placeholder="在这里粘贴 Markdown 内容...

示例：
@[TOC](目录)
# 标题
**粗体文本** 和 *斜体文本* 和 ~~删除线~~
`行内代码` 和 终端命令
- 列表项
[链接文本](https://example.com)
![图片描述](https://example.com/image.jpg)

```javascript
console.log('代码块');
```"
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
              text={isImporting ? '导入中...' : '导入'}
            />
            <Button
              mode="ghost"
              onClick={handleClear}
              disabled={!markdownText.trim()}
              text="清空输入"
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

      {/* 原生富文本编辑器 */}
      <Box>
        {props.renderDefault(props)}
      </Box>
    </Stack>
  )

  return (
    <MarkdownImporterErrorBoundary {...props}>
      <Suspense fallback={<LoadingFallback />}>
        <MainComponent />
      </Suspense>
    </MarkdownImporterErrorBoundary>
  )
}