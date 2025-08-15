/**
 * Safe wrapper for MarkdownTextInput with error boundary
 */

import { TextArea } from '@sanity/ui'
import { StringInputProps, set, unset } from 'sanity'
import React, { Component, ErrorInfo, ReactNode } from 'react'

import { MarkdownTextInput } from './MarkdownTextInput'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class MarkdownInputErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('MarkdownTextInput error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Fallback simple text input
const FallbackTextInput = React.forwardRef<HTMLTextAreaElement, StringInputProps>(
  (props, ref) => {
    const { onChange, value = '', elementProps } = props

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const nextValue = event.currentTarget.value
        onChange(nextValue ? set(nextValue) : unset())
      },
      [onChange]
    )

    return (
      <TextArea
        {...elementProps}
        ref={ref}
        onChange={handleChange}
        value={value || ''}
        rows={15}
        placeholder="Markdown 内容 (简化模式)"
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      />
    )
  }
)

FallbackTextInput.displayName = 'FallbackTextInput'

// Main export with error boundary
export const SafeMarkdownInput = React.forwardRef<HTMLTextAreaElement, StringInputProps>(
  (props, ref) => {
    return (
      <MarkdownInputErrorBoundary
        fallback={<FallbackTextInput {...props} ref={ref} />}
      >
        <MarkdownTextInput {...props} ref={ref} />
      </MarkdownInputErrorBoundary>
    )
  }
)

SafeMarkdownInput.displayName = 'SafeMarkdownInput'
