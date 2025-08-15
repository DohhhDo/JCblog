/**
 * 超稳定的 Markdown 导入器包装器
 * 解决 ChunkLoadError 和其他运行时错误
 */

import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react'
import { Box, Button, Card, Stack, Text } from '@sanity/ui'

// 动态导入主要组件以避免 chunk 错误
const LazyStableMarkdownImporter = React.lazy(() => 
  import('./StableMarkdownImporter').then(module => ({
    default: module.StableMarkdownImporter
  }))
)

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  retryCount: number
}

interface UltraStableProps {
  value?: any
  onChange: (patch: any) => void
  renderDefault: (props: any) => React.ReactElement
}

class MarkdownImporterErrorBoundary extends Component<UltraStableProps, ErrorBoundaryState> {
  private retryTimer?: NodeJS.Timeout

  constructor(props: UltraStableProps) {
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

    return this.props.children
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

// 主要的超稳定导入器组件
export function UltraStableMarkdownImporter(props: UltraStableProps) {
  return (
    <MarkdownImporterErrorBoundary {...props}>
      <Suspense fallback={<LoadingFallback />}>
        <LazyStableMarkdownImporter {...props} />
      </Suspense>
    </MarkdownImporterErrorBoundary>
  )
}
