/**
 * Safe markdown plugin loader
 * Provides graceful fallback if the plugin fails to load
 */

import type { PluginOptions } from 'sanity'

export function safeMarkdownPlugin(): PluginOptions | null {
  try {
    // Dynamic import to avoid build-time errors
    const markdownPlugin = require('sanity-plugin-markdown')
    
    if (!markdownPlugin || typeof markdownPlugin.markdownSchema !== 'function') {
      console.warn('📝 Markdown plugin not properly exported')
      return null
    }
    
    // Call the plugin function
    const pluginInstance = markdownPlugin.markdownSchema()
    console.log('✅ Markdown plugin loaded successfully')
    
    return pluginInstance
  } catch (error: any) {
    console.warn('⚠️ Markdown plugin failed to load:', error.message)
    
    // Log specific error types for debugging
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('   → Plugin not installed or path incorrect')
    } else if (error.message.includes('Cannot read properties')) {
      console.log('   → Plugin structure incompatible with current Sanity version')
    } else {
      console.log('   → Unexpected error:', error.stack?.split('\n')[0])
    }
    
    return null
  }
}

// Export a function that can be used conditionally in the config
export function withMarkdownPlugin(plugins: PluginOptions[]): PluginOptions[] {
  const markdownPlugin = safeMarkdownPlugin()
  
  if (markdownPlugin) {
    return [...plugins, markdownPlugin]
  }
  
  console.log('📝 Studio running without markdown plugin - using standard text fields')
  return plugins
}
