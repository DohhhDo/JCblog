/**
 * Safe wrapper for MarkdownImporter with enhanced error handling
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, Stack, Text, Button, Box } from '@sanity/ui'

import { MarkdownImporter } from './MarkdownImporter'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

class MarkdownImporterErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MarkdownImporter error caught:', error, errorInfo)
    this.setState({ errorInfo })
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card padding={3} radius={2} shadow={1} tone="critical">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              ⚠️ Markdown 导入器出现错误
            </Text>
            <Text size={1} muted>
              {this.state.error?.message || '未知错误'}
            </Text>
            <Button
              mode="default"
              tone="default"
              onClick={this.handleRetry}
              text="重试"
            />
            <details style={{ marginTop: '8px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#666' }}>
                错误详情
              </summary>
              <pre style={{ fontSize: '10px', marginTop: '4px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
                {this.state.error?.stack}
              </pre>
            </details>
          </Stack>
        </Card>
      )
    }

    return this.props.children
  }
}

// Simple fallback component
const FallbackMarkdownImporter = (props: any) => {
  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="caution">
        <Stack space={3}>
          <Text size={1} weight="semibold">
            📝 简化 Markdown 输入
          </Text>
          <Text size={1} muted>
            Markdown 导入器暂时不可用，请使用下方的标准编辑器。
          </Text>
        </Stack>
      </Card>
      <Box>
        {props.renderDefault(props)}
      </Box>
    </Stack>
  )
}

// Main wrapper component
export function MarkdownImporterWrapper(props: any) {
  return (
    <MarkdownImporterErrorBoundary
      fallback={<FallbackMarkdownImporter {...props} />}
      onError={(error, errorInfo) => {
        // 可以在这里添加错误报告逻辑
        console.error('MarkdownImporter wrapper error:', { error, errorInfo })
      }}
    >
      <MarkdownImporter {...props} />
    </MarkdownImporterErrorBoundary>
  )
}
