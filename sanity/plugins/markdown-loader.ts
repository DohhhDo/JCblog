/**
 * Safe markdown plugin loader with fallback
 * Handles version compatibility issues gracefully
 */

import type { PluginOptions } from 'sanity'

interface MarkdownPluginOptions {
  // Add any specific options if needed
}

export function createMarkdownPlugin(options: MarkdownPluginOptions = {}): PluginOptions | null {
  try {
    // First try to load the plugin normally
    const { markdownSchema } = require('sanity-plugin-markdown')
    
    if (typeof markdownSchema !== 'function') {
      console.warn('markdownSchema is not a function, plugin may be incompatible')
      return null
    }
    
    const plugin = markdownSchema(options)
    console.log('✅ Markdown plugin loaded successfully')
    return plugin
    
  } catch (error: any) {
    console.warn('⚠️ Markdown plugin failed to load:', error.message)
    
    // Check if it's a version compatibility issue
    if (error.message.includes('Cannot resolve module') || 
        error.message.includes('Module not found')) {
      console.log('📝 Module resolution error - plugin may not be installed correctly')
    } else if (error.message.includes('incompatible') || 
               error.message.includes('version')) {
      console.log('📝 Version compatibility issue detected')
    }
    
    return null
  }
}

// Alternative: Create a simple markdown field type if plugin fails
export function createFallbackMarkdownField() {
  return {
    name: 'markdown-fallback',
    title: 'Markdown Fallback',
    type: 'document',
    fields: [
      {
        name: 'content',
        title: 'Content',
        type: 'text',
        description: 'Markdown content (fallback mode - plugin not available)',
        rows: 10,
      }
    ]
  }
}

export const markdownPluginInfo = {
  name: 'sanity-plugin-markdown',
  expectedVersion: '^4.1.2 || ^5.0.0',
  sanityCompatibility: '^3.0.0',
}
