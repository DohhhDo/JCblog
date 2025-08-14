/**
 * Enhanced text input for Markdown content
 * Provides better UX for writing Markdown without the problematic plugin
 */

import { TextAreaInput } from '@sanity/ui'
import { StringInputProps, set, unset } from 'sanity'
import React, { useCallback } from 'react'

export function MarkdownTextInput(props: StringInputProps) {
  const { onChange, value = '', elementProps } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Add some helpful keyboard shortcuts for Markdown
      if (event.key === 'Tab') {
        event.preventDefault()
        const target = event.currentTarget
        const start = target.selectionStart
        const end = target.selectionEnd
        const newValue = value.substring(0, start) + '  ' + value.substring(end)
        
        onChange(set(newValue))
        
        // Reset cursor position
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2
        }, 0)
      }
    },
    [value, onChange]
  )

  return (
    <TextAreaInput
      {...elementProps}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={value}
      rows={15}
      placeholder="在这里输入 Markdown 内容...

支持的语法包括：
# 标题
**粗体** 和 *斜体*
- 列表项
[链接](URL)
```代码块```

按 Tab 键插入两个空格的缩进。"
      style={{
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    />
  )
}
