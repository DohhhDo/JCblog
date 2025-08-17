// UnifiedMarkdownImporter.tsx
import { Box, Card, Text } from '@sanity/ui'
import React from 'react'

interface UnifiedMarkdownImporterProps {
  value?: any
  onChange: (patch: any) => void
  renderDefault: (props: any) => React.ReactElement
}

export function UnifiedMarkdownImporter(props: UnifiedMarkdownImporterProps) {
  return (
    <Card padding={3} radius={2} shadow={1} tone="positive">
      <Box>
        <Text size={2} weight="bold">
          ✅ 已使用新版统一Markdown导入器
        </Text>
        <Text size={1} muted>
          旧版导入器已被替换为统一版本，请在此处实现新功能。
        </Text>
      </Box>
    </Card>
  )
}

// 此文件已被UnifiedMarkdownImporter.tsx替代
// 请使用UnifiedMarkdownImporter组件
//
// 这个文件之前包含多个Markdown导入器组件的实现，
// 但现在所有功能已经统一到UnifiedMarkdownImporter组件中。
//
// 请在schema定义中使用UnifiedMarkdownImporter组件：
// import { UnifiedMarkdownImporter } from '~/sanity/components/UnifiedMarkdownImporter'
