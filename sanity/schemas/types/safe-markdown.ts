/**
 * Safe markdown field type with fallback
 * Uses markdown plugin if available, otherwise falls back to text
 */

import { defineField } from 'sanity'

export function createMarkdownField(options: {
  name: string
  title: string
  description?: string
  validation?: any
  rows?: number
}) {
  // Check if markdown plugin is available
  let hasMarkdownPlugin = false
  try {
    require('sanity-plugin-markdown')
    hasMarkdownPlugin = true
  } catch (error) {
    console.warn(`Markdown plugin not available for field "${options.name}", using text fallback`)
  }

  return defineField({
    name: options.name,
    title: options.title,
    type: hasMarkdownPlugin ? 'markdown' : 'text',
    description: hasMarkdownPlugin 
      ? options.description 
      : `${options.description} (Note: Using text fallback - markdown plugin not available)`,
    validation: options.validation,
    ...(hasMarkdownPlugin ? {} : { rows: options.rows || 10 }),
  })
}
